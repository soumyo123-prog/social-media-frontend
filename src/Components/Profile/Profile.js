import React from 'react';
import classes from './Profile.module.css';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as types from '../../Store/Actions/index';

import Navbar from '../Navbar/Navbar';
import Redirector from '../Redirector/redirect';
import Backdrop from '../Backdrop/Backdrop';
import FullPost from '../FullPost/FullPost';

let skip = 0;
let scrollable = true;

let isLiked = "rgb(252, 3, 127)";
let isNotLiked = "rgb(240, 204, 222)";

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.postsRef = React.createRef();
    }

    state = {
        showFullPost: false,
        fullPost: {},
        fileError: null,
        canIncrease: true,
        touchShow: false
    }

    componentDidMount() {
        if (this.props.posts.length === 0 && this.props.token) {
            this.props.fetchPosts(this.props.token, 0);
        }
    }

    deletePostHandler = id => {
        const allPosts = this.props.posts.filter(post => post._id !== id);

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + this.props.token);

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("/posts/remove/" + id, requestOptions)
            .then(response => {
                this.props.deletePost(allPosts);
                this.props.getCount(false);
            })
            .catch(error => error);
    }

    seeFullPost = (id) => {
        const fullPost = this.props.posts.filter(post => post._id === id)[0];

        this.setState({
            showFullPost: true,
            fullPost: fullPost
        })
    }

    hideFullPost = () => {
        this.setState({
            showFullPost: false
        })
    }

    postScrollHandler = (e) => {
        if (this.props.posts.length === this.props.countPosts) {
            return;
        }

        const postDiv = this.postsRef.current;
        if (postDiv.scrollTop + postDiv.offsetHeight >= postDiv.scrollHeight - 100
            && scrollable) {

            scrollable = false;
            if (this.state.canIncrease) {
                skip += 5;
                this.props.fetchPosts(this.props.token, skip);
            }

        } else {
            scrollable = true;
        }
    }

    postLiker = (e, id) => {
        if (e.target.style.backgroundColor === isNotLiked) {

            this.props.updateLiked(this.props.token, id, 1);
            this.props.updateLikes(id, 1);
            e.target.style.backgroundColor = isLiked;

        } else {

            this.props.updateLiked(this.props.token, id, 0);
            this.props.updateLikes(id, 0);
            e.target.style.backgroundColor = isNotLiked;

        }
    }

    onHoverHandler = (type, id) => {
        const doc = document.getElementById(id);

        if (doc.childNodes) {
            if (type === 'over') {
                doc.childNodes[doc.childNodes.length - 1].style.display = 'block';
            }
            else if (type === 'out') {
                doc.childNodes[doc.childNodes.length - 1].style.display = 'none';
            }
        }
    }

    onTouchHandler = (id) => {
        const doc = document.getElementById(id);

        this.setState(prev => {
            return {
                touchShow: !(prev.touchShow)
            }
        })

        if (doc.childNodes) {
            if (this.state.touchShow) {
                doc.childNodes[doc.childNodes.length - 1].style.display = 'block';
            } else {
                doc.childNodes[doc.childNodes.length - 1].style.display = 'none';
            }
        }
    }

    render() {
        const callBackPosts = post => {
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
                backgroundColor: isNotLiked
            }
            if (like) {
                style.backgroundColor = isLiked;
            }

            let showHover = (
                <div className={classes.Post_Hover}>
                    <div className={classes.Post_Heading}>
                        {post.heading}
                    </div>

                    <div className={classes.Like_Container}>
                        <div
                            className={classes.isNotLiked}
                            onClick={(event) => this.postLiker(event, post._id)}
                            style={style}
                        />

                        <span>{post.likes} Likes</span>
                    </div>

                    <button
                        className={classes.FullPost}
                        onClick={() => this.seeFullPost(post._id)}
                    >Full</button>
                </div>
            );

            return (
                <div
                    className={classes.Post}
                    key={post._id}
                    id={post._id}
                    onMouseEnter={() => this.onHoverHandler('over', post._id)}
                    onMouseLeave={() => this.onHoverHandler('out', post._id)}
                    onClick={window.innerWidth <= 680 ? () => this.onTouchHandler(post._id) : null}
                >
                    <div
                        className={classes.Post_Picture}
                        style={{
                            backgroundImage: 'url(/posts/image/' + post._id + ')'
                        }}
                    />

                    <button
                        className={classes.Delete_Post}
                        onClick={() => this.deletePostHandler(post._id)}
                    >X</button>

                    {showHover}
                </div>
            )
        }
        let posts = (this.props.posts.length > 0 ? this.props.posts.map(callBackPosts) : null);

        if (this.props.error) {
            posts = <div className={classes.ErrorMessage}> {this.state.error} </div>
        }

        let updateError = null;
        if (this.state.fileError) {
            updateError = <div className={classes.ErrorMessage}> {this.state.fileError} </div>
        }

        return (
            <div className={classes.Main}>

                <Backdrop
                    show={this.state.showFullPost}
                    hide={this.hideFullPost}
                />

                <FullPost
                    show={this.state.showFullPost}
                    hide={this.hideFullPost}
                    postId={this.state.fullPost._id}
                    heading={this.state.fullPost.heading}
                    content={this.state.fullPost.content}
                />

                <Redirector />
                <Navbar />

                <div
                    className={classes.Profile_Container_1}
                    ref={this.postsRef}
                    onScroll={this.postScrollHandler}
                >

                    <div className={classes.Avatar_Container}>
                        <div className={classes.Avatar}>
                            <img
                                src={'/users/' + this.props.id + '/avatar'}
                            />
                        </div>
                        <div className={classes.Profile_Name}>
                            {this.props.name}
                        </div>
                    </div>

                    <div className={classes.Profile_Details}>
                        <div className={classes.Profile_About}>
                            About
                        </div>

                        <div className={classes.Profile_Settings}>
                            <Link
                                className={classes.Profile_Settings_Button}
                                to='/profile/settings'
                            >
                                Edit Profile
                            </Link>
                        </div>
                    </div>

                    {updateError}

                    <div className={classes.My_Posts}>
                        {posts}
                    </div>

                </div>

                <div
                    className={classes.Add_Post}
                >
                    <Link
                        to='/posts/add'
                        className={classes.Add_Post_Button}
                    >
                        +
                    </Link>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        name: state.auth.user ? state.auth.user.name : null,
        id: state.auth.user ? state.auth.user._id : null,
        countPosts: state.auth.user ? state.auth.user.countPosts : null,
        token: state.auth.token,
        posts: state.post.posts,
        error: state.post.error,
        liked : state.auth.user ? state.auth.user.liked : null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchPosts: (t, s) => dispatch(types.fetchPosts(t, s)),
        deletePost: (p) => dispatch(types.deletePost(p)),
        getCount: (n) => dispatch(types.getCount(n)),
        updateLiked: (token, id, type) => dispatch(types.updateLiked(token, id, type)),
        updateLikes: (id, type) => dispatch(types.updateLikes(id, type))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);