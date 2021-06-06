import React, {useEffect,useState} from 'react';
import classes from './posts.module.css';

import * as types from '../../Store/Actions/index';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'

import {AiOutlineZoomIn} from 'react-icons/ai';

let skip = 0;
let scrollable = true;

let isLiked = "rgb(252, 3, 127)";
let isNotLiked = "rgb(240, 204, 222)";

const Posts = props => {
    const [canIncrease, setCanIncrease] = useState(true);
    const [touchShow, setTouchShow] = useState(false);

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
        props.history.push('/posts/' + id);
    }

    const callNextBatch = () => {
        const maxSkip = Math.ceil(props.countPosts/5);

        if (scrollable) {

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

    let posts = (props.posts.length > 0 ? props.posts.map((post) => {
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

                <button
                    className={classes.FullPost}
                    onClick={() => seeFullPost(post._id)}
                >
                    <AiOutlineZoomIn size="2em"/>
                </button>

                {showHover}
            </div>
        )
    }) : null);

    if (props.canCallNext) {
        callNextBatch();
    }

    return (
        <div className={classes.My_Posts}>
            {posts}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        posts: state.post.posts,
        token: state.auth.token,
        countPosts: state.auth.user ? state.auth.user.countPosts : null,
        liked : state.auth.user ? state.auth.user.liked : null,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPosts: (t, s) => dispatch(types.fetchPosts(t, s)),
        deletePost: (p) => dispatch(types.deletePost(p)),
        getCount: (n) => dispatch(types.getCount(n)),
        updateLiked: (token, id, type) => dispatch(types.updateLiked(token, id, type)),
        updateLikes: (id, type) => dispatch(types.updateLikes(id, type))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Posts));