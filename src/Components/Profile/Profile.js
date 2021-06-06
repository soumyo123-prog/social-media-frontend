import {React, useState, useRef, lazy, Suspense} from 'react';
import classes from './Profile.module.css';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Navbar from '../Navbar/Navbar';
import Redirector from '../Redirector/redirect';
import Top from '../BackToTop/top';
import MinSpinner from '../Spinner/minifiedSpinner';

const Posts = lazy(() => import('../Posts/posts'))

const Profile = props => {

    const [fileError, setFileError] = useState(null);
    const [above, setAbove] = useState(false);
    const [callNextBatch, setCallNextBatch] = useState(false);

    const postsRef = useRef(null);

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

        if (props.posts.length === props.countPosts) {
            return;
        }

        const postDiv = postsRef.current;
        if (postDiv.scrollTop + postDiv.offsetHeight >= postDiv.scrollHeight - 100) {
            if (!callNextBatch) {
                setCallNextBatch(true);
            }
        } else {
            if (callNextBatch) {
                setCallNextBatch(false);
            }
        }
    }

    let updateError = null;
    if (fileError) {
        updateError = <div className={classes.ErrorMessage}> {fileError} </div>
    }

    return (
        <div className={classes.Main}>
            <Top 
                show = {above}
                element = {postsRef}
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

                <Suspense
                    fallback={<MinSpinner showSpinner={true} text="Loading Posts"/>}
                >
                    <Posts canCallNext = {callNextBatch} />
                </Suspense>

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

export default connect(mapStateToProps)(Profile);