import React from 'react';
import classes from './OtherProfile.module.css';
import * as types from '../../Store/Actions/index';

import Name from '../Name/Name';
import Navbar from '../Navbar/Navbar';
import Redirector from '../Redirector/redirect';
import Fullpost from '../FullPost/FullPost';
import Backdrop from '../Backdrop/Backdrop';

import {connect} from 'react-redux';

let skip = 0;
let scrollable = true;

let isLiked = "rgb(252, 3, 127)";
let isNotLiked = "rgb(240, 204, 222)";

class Other extends React.Component {
    constructor(props) {
        super(props);
        this.scrollRef = React.createRef();  
    }

    state = {
        canIncrease : true,
        seeFullPost : false,
        fullPost : {}
    }

    componentDidMount () {
        if (this.props.token && this.props.posts.length === 0) {
            this.props.fetchPosts(this.props.match.params.id,this.props.token,0);
        }
    }

    componentWillUnmount () {
        this.props.clearProfile();
    }

    seeFullPost = (id) => {
        const fullPost = this.props.posts.filter(post => post._id === id)[0];

        this.setState({
            seeFullPost : true,
            fullPost : fullPost
        })
    }

    hideFullPost = () => {
        this.setState({
            seeFullPost : false
        })
    }

    postScrollHandler = (e) => {
        if (this.props.posts.length === this.props.countPosts) {
            return;
        }

        const postDiv = this.scrollRef.current;
        if (postDiv.scrollTop + postDiv.offsetHeight >= postDiv.scrollHeight-100
            && scrollable ) {

                scrollable = false;
                if (this.state.canIncrease) { 
                    skip += 5; 
                    this.props.fetchPosts(this.props.match.params.id,this.props.token, skip);
                }

        } else {
            scrollable = true;
        }
    }

    postLiker = (e,id) => {
        if (e.target.style.backgroundColor === isNotLiked) {

            this.props.updateLiked(this.props.token, id, 1);
            this.props.updateLikesOthers(id, 1);
            e.target.style.backgroundColor = isLiked;

        } else {

            this.props.updateLiked(this.props.token, id, 0);
            this.props.updateLikesOthers(id, 0);
            e.target.style.backgroundColor = isNotLiked;

        }
    }

    onHoverHandler = (type,id) => {
        const doc = document.getElementById(id);
        
        if (type === 'over') {
            doc.childNodes[doc.childNodes.length-1].style.display = 'block';
        }
        else if (type === 'out') {
            doc.childNodes[doc.childNodes.length-1].style.display = 'none';
        }
    }

    onTouchHandler = (id) => {
        const doc = document.getElementById(id);

        this.setState(prev => {
            return {
                touchShow : !(prev.touchShow)
            }
        })

        if (this.state.touchShow) {
            doc.childNodes[doc.childNodes.length-1].style.display = 'block';
        } else {
            doc.childNodes[doc.childNodes.length-1].style.display = 'none';
        }   
    }

    render () {
        let posts = null;
        if (this.props.posts.length > 0) {
            posts = this.props.posts.map(post => {

                let like = false;
                if (this.props.liked) {
                    this.props.liked.forEach(el => {
                        if (post._id == el.post) {
                            like = true;
                            return;
                        }
                    });
                }
                
                const style = {
                    backgroundColor : isNotLiked
                }
                if (like) {
                    style.backgroundColor = isLiked;
                }

                const showHover = (
                    <div className = {classes.Post_Hover}>
                        <div className = {classes.Post_Heading}>
                            {post.heading}
                        </div>

                        <div className = {classes.Post_Content}>
                            {post.content}
                        </div>

                        <div className = {classes.Like_Container}>

                            <div
                                className = {classes.isNotLiked}
                                onClick = {(event) => this.postLiker(event,post._id)}
                                style = {style}
                            />

                                <span>{post.likes} Likes</span>
                        </div>

                        <button
                            className = {classes.FullPost}
                            onClick = {() => this.seeFullPost(post._id)}
                        >Full</button>
                    </div>
                )

                return (
                    <div 
                        className={classes.Post}
                        key = {post._id}
                        id = {post._id}
                        onMouseEnter = {() => this.onHoverHandler('over',post._id)}
                        onMouseLeave = {() => this.onHoverHandler('out',post._id)}
                        onTouchStart = {() => this.onTouchHandler(post._id)}
                    >
                        <div 
                            className = {classes.Post_Picture}
                            style = {{
                                backgroundImage : 'url(/posts/image/'+post._id+')'
                            }}
                        />

                        {showHover}

                    </div>
                )
            })
        }
        
        return (
            <div className = {classes.Main}>
                <Navbar />
                <Redirector />

                <Backdrop 
                    show = {this.state.seeFullPost}
                    hide = {this.hideFullPost}
                />

                <Fullpost 
                    show = {this.state.seeFullPost}
                    hide = {this.hideFullPost}
                    postId = {this.state.fullPost._id}
                    heading = {this.state.fullPost.heading}
                    content = {this.state.fullPost.content}
                />

                <div
                    className = {classes.Profile_Container_1}
                    ref = {this.scrollRef}
                    onScroll = {this.postScrollHandler}
                >
                    <div className = {classes.Avatar_Container}>
                        <div className = {classes.Avatar}>
                            <img 
                                src = {'/users/' + this.props.match.params.id + '/avatar'} 
                            />
                        </div>

                        <div className = {classes.Profile_Name}>
                            {this.props.name}
                        </div>
                    </div>

                    <div className = {classes.Profile_Details}>
                        <div className = {classes.Profile_About}>
                            About
                        </div>
                    </div>

                    <div className={classes.My_Posts}>
                        {posts}
                    </div>
                    
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        token : state.auth.token,
        name : state.other.user ? state.other.user.name : null,
        countPosts : state.other.user ? state.other.user.countPosts : null,
        posts : state.other.posts,
        userErr : state.other.userErr,
        postErr : state.other.postErr,
        liked : state.auth.user ? state.auth.user.liked : null,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPosts : (id,token,skip) => dispatch(types.fetchOtherPosts(id,token,skip)),
        clearProfile : () => dispatch(types.clearOtherProfile()),
        updateLiked : (token,id,type) => dispatch(types.updateLiked(token,id,type)),
        updateLikesOthers : (id,type) => dispatch(types.updateLikesOthers(id,type))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Other);
