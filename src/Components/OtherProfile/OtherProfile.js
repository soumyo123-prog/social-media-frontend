import {React, useRef, useState, useEffect} from 'react';
import classes from './OtherProfile.module.css';
import * as types from '../../Store/Actions/index';

import Navbar from '../Navbar/Navbar';
import Redirector from '../Redirector/redirect';
import Top from '../BackToTop/top';

import {connect} from 'react-redux';

let skip = 0;
let scrollable = true;

let isLiked = "rgb(252, 3, 127)";
let isNotLiked = "rgb(240, 204, 222)";

const Other = props => {
    
    const [canIncrease, setCanIncrease] = useState(true);
    const [above, setAbove] = useState(false);
    const [touchShow, setTouchShow] = useState(false);

    const scrollRef = useRef(null);

    useEffect(() => {
        props.fetchProfile(props.match.params.id ,props.token);

        if (props.token && props.posts.length === 0) {
            props.fetchPosts(props.match.params.id,props.token,0);
        }
    }, []);

    useEffect(() => {
        

        return () => {
            props.clearProfile();
        }
    }, []);

    const showFullPost = (id) => {
        props.history.push('/posts/' + id);
    }

    const postScrollHandler = (e) => {
        if (e.target.scrollTop > 20) {
            if (!above) {
                setAbove(true);
            }
        } else {
            if (above) {
                setAbove(false);
            }
        }

        const maxSkip = Math.ceil(props.countPosts/5);

        if (props.posts.length === props.countPosts) {
            return;
        }

        const postDiv = scrollRef.current;
        if (postDiv.scrollTop + postDiv.offsetHeight >= postDiv.scrollHeight-100
            && scrollable ) {

                scrollable = false;
                if (canIncrease) { 
                    if (skip < maxSkip) {
                        skip += 5; 
                        props.fetchPosts(props.match.params.id,props.token, skip);
                    }
                }
        } else {
            scrollable = true;
        }
    }

    const postLiker = (e,id) => {
        if (e.target.style.backgroundColor === isNotLiked) {

            props.updateLiked(props.token, id, 1);
            props.updateLikesOthers(id, 1);
            e.target.style.backgroundColor = isLiked;

        } else {

            props.updateLiked(props.token, id, 0);
            props.updateLikesOthers(id, 0);
            e.target.style.backgroundColor = isNotLiked;

        }
    }

    const onHoverHandler = (type,id) => {
        const doc = document.getElementById(id);
        
        if (type === 'over') {
            doc.childNodes[doc.childNodes.length-1].style.display = 'block';
        }
        else if (type === 'out') {
            doc.childNodes[doc.childNodes.length-1].style.display = 'none';
        }
    }

    const onTouchHandler = (id) => {
        const doc = document.getElementById(id);

        setTouchShow(!touchShow);

        if (touchShow) {
            doc.childNodes[doc.childNodes.length-1].style.display = 'block';
        } else {
            doc.childNodes[doc.childNodes.length-1].style.display = 'none';
        }   
    }

   
    let posts = null;
    if (props.posts.length > 0) {
        posts = props.posts.map(post => {

            let like = false;
            if (props.liked) {
                props.liked.forEach(el => {
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

                    <div className = {classes.Like_Container}>

                        <div
                            className = {classes.isNotLiked}
                            onClick = {(event) => postLiker(event,post._id)}
                            style = {style}
                        />

                            <span>{post.likes} Likes</span>
                    </div>

                </div>
            )

            return (
                <div 
                    className={classes.Post}
                    key = {post._id}
                    id = {post._id}
                    onMouseEnter = {() => onHoverHandler('over',post._id)}
                    onMouseLeave = {() => onHoverHandler('out',post._id)}
                    onTouchStart = {() => onTouchHandler(post._id)}
                >
                    <div 
                        className = {classes.Post_Picture}
                        style = {{
                            backgroundImage : 'url(/posts/image/'+post._id+')'
                        }}
                    />

                    <button
                        className = {classes.FullPost}
                        onClick = {() => showFullPost(post._id)}
                    >Full</button>

                    {showHover}

                </div>
            )
        })
    }
    
    return (
        <div className = {classes.Main}>
            <Navbar />
            <Redirector />

            <Top 
                show = {above}
                element = {scrollRef}
            />

            <div
                className = {classes.Profile_Container_1}
                ref = {scrollRef}
                onScroll = {postScrollHandler}
            >
                <div className = {classes.Avatar_Container}>
                    <div className = {classes.Avatar}>
                        <img 
                            src = {'/users/' + props.match.params.id + '/avatar'} 
                        />
                    </div>

                    <div className = {classes.Profile_Name}>
                        {props.name}
                    </div>
                </div>

                <div className = {classes.Profile_Details}>
                    <div className = {classes.Profile_About}>
                        {props.about}
                    </div>
                </div>

                <div className={classes.My_Posts}>
                    {posts}
                </div>
                
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        token : state.auth.token,
        name : state.other.user ? state.other.user.name : null,
        countPosts : state.other.user ? state.other.user.countPosts : null,
        posts : state.other.posts,
        userErr : state.other.userErr,
        postErr : state.other.postErr,
        liked : state.other.user ? state.other.user.liked : null,
        about : state.other.user ? state.other.user.about : null
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPosts : (id,token,skip) => dispatch(types.fetchOtherPosts(id,token,skip)),
        fetchProfile : (id, token) => dispatch(types.fetchOtherProfile(id, token)),
        clearProfile : () => dispatch(types.clearOtherProfile()),
        updateLiked : (token,id,type) => dispatch(types.updateLiked(token,id,type)),
        updateLikesOthers : (id,type) => dispatch(types.updateLikesOthers(id,type))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Other);
