import {React, useState, useEffect, useRef} from 'react';
import classes from './Profile.module.css';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as types from '../../Store/Actions/index';

import Navbar from '../Navbar/Navbar';
import Redirector from '../Redirector/redirect';
import Backdrop from '../Backdrop/Backdrop';
import FullPost from '../FullPost/FullPost';
import Top from '../BackToTop/top';

let skip = 0;
let scrollable = true;

let isLiked = "rgb(252, 3, 127)";
let isNotLiked = "rgb(240, 204, 222)";

const Profile = props => {

    const [showFullPost, setShowFullPost] = useState(false);
    const [fullPost, setFullPost] = useState({});
    const [fileError, setFileError] = useState(null);
    const [canIncrease, setCanIncrease] = useState(true);
    const [touchShow, setTouchShow] = useState(false);
    const [above, setAbove] = useState(false);

    const postsRef = useRef(null);

    useEffect(() => {
        if (props.posts.length === 0 && props.token) {
            props.fetchPosts(props.token, 0);
        }
    }, []);

    const deletePostHandler = id => {
        const allPosts = props.posts.filter(post => post._id !== id);

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + props.token);

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("/posts/remove/" + id, requestOptions)
            .then(response => {
                props.deletePost(allPosts);
                props.getCount(false);
            })
            .catch(error => error);
    }

    const seeFullPost = (id) => {
        const fullPost = props.posts.filter(post => post._id === id)[0];

        setShowFullPost(true);
        setFullPost(fullPost);
    }

    const hideFullPost = () => {
        setShowFullPost(false);
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

        const postDiv = postsRef.current;
        if (postDiv.scrollTop + postDiv.offsetHeight >= postDiv.scrollHeight - 100
            && scrollable) {

            scrollable = false;
            if (canIncrease) {
                if (skip < maxSkip) {
                    skip += 5;
                    props.fetchPosts(props.token, skip);
                }
            }

        } else {
            scrollable = true;
        }
    }

    const postLiker = (e, id) => {
        if (e.target.style.backgroundColor === isNotLiked) {

            props.updateLiked(props.token, id, 1);
            props.updateLikes(id, 1);
            e.target.style.backgroundColor = isLiked;

        } else {

            props.updateLiked(props.token, id, 0);
            props.updateLikes(id, 0);
            e.target.style.backgroundColor = isNotLiked;

        }
    }

    const onHoverHandler = (type, id) => {
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

    const onTouchHandler = (id) => {
        const doc = document.getElementById(id);

        setTouchShow(!touchShow);

        if (doc.childNodes) {
            if (touchShow) {
                doc.childNodes[doc.childNodes.length - 1].style.display = 'block';
            } else {
                doc.childNodes[doc.childNodes.length - 1].style.display = 'none';
            }
        }
    }
    
    const callBackPosts = post => {
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
                        onClick={(event) => postLiker(event, post._id)}
                        style={style}
                    />

                    <span>{post.likes} Likes</span>
                </div>

                <button
                    className={classes.FullPost}
                    onClick={() => seeFullPost(post._id)}
                >Full</button>
            </div>
        );

        return (
            <div
                className={classes.Post}
                key={post._id}
                id={post._id}
                onMouseEnter={() => onHoverHandler('over', post._id)}
                onMouseLeave={() => onHoverHandler('out', post._id)}
                onClick={window.innerWidth <= 680 ? () => onTouchHandler(post._id) : null}
            >
                <div
                    className={classes.Post_Picture}
                    style={{
                        backgroundImage: 'url(/posts/image/' + post._id + ')'
                    }}
                />

                <button
                    className={classes.Delete_Post}
                    onClick={() => deletePostHandler(post._id)}
                >X</button>

                {showHover}
            </div>
        )
    }
    let posts = (props.posts.length > 0 ? props.posts.map(callBackPosts) : null);

    if (props.error) {
        posts = <div className={classes.ErrorMessage}> {props.error} </div>
    }

    let updateError = null;
    if (fileError) {
        updateError = <div className={classes.ErrorMessage}> {fileError} </div>
    }

    return (
        <div className={classes.Main}>
            <Backdrop
                show={showFullPost}
                hide={hideFullPost}
            />

            <Top 
                show = {above}
                element = {postsRef}
            />

            <FullPost
                show={showFullPost}
                hide={hideFullPost}
                postId={fullPost._id}
                heading={fullPost.heading}
                content={fullPost.content}
            />

            <Redirector />
            <Navbar />

            <div
                className={classes.Profile_Container_1}
                ref={postsRef}
                onScroll={postScrollHandler}
            >
                <div className={classes.Avatar_Container}>
                    <div className={classes.Avatar}>
                        <img
                            src={'/users/' + props.id + '/avatar'}
                        />
                    </div>
                    <div className={classes.Profile_Name}>
                        {props.name}
                    </div>
                </div>

                <div className={classes.Profile_Details}>
                    <div 
                        className={classes.Profile_About}
                    >
                        {props.about}
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

const mapStateToProps = state => {
    return {
        name: state.auth.user ? state.auth.user.name : null,
        id: state.auth.user ? state.auth.user._id : null,
        countPosts: state.auth.user ? state.auth.user.countPosts : null,
        token: state.auth.token,
        posts: state.post.posts,
        error: state.post.error,
        liked : state.auth.user ? state.auth.user.liked : null,
        about : state.auth.user ? state.auth.user.about : null
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