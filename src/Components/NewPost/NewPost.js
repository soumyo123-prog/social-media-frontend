import {React, useRef, useState} from 'react';
import classes from './NewPost.module.css';
import * as types from '../../Store/Actions/index';

import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import Spinner from '../Spinner/Spinner';

const NewPost = props => {

    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState(false);

    const headingRef = useRef(null);
    const contentRef = useRef(null);
    const fileRef = useRef(null);

    const onSubmitHandler = (e) => {
        props.showSpinner();
        e.preventDefault();

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + props.token);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "heading": "" || headingRef.current.value,
            "content": "" || contentRef.current.value
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("/posts/add", requestOptions)
        .then(response => response.json())
        .then(result => {
            props.updatePosts(result);
            props.getCount(true);

            if (fileRef.current.files.length === 0) {
                setRedirect(true);
                setError(null);
                
                return new Promise((resolve, reject) => {
                    resolve();
                });

            } else {
                
                var myHeaders = new Headers();
                myHeaders.append("Authorization", "Bearer " + props.token);
    
                var formdata = new FormData();
                formdata.append("post", fileRef.current.files[0], fileRef.current.value);
    
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: formdata,
                    redirect: 'follow'
                };
    
                return fetch("/posts/image/" + result._id, requestOptions)
            }
        })
        .then(response => {
            props.hideSpinner();

            setRedirect(true);
            setError(null);

        })
        .catch(error => {
            props.hideSpinner();

            setRedirect(false);
            setError("Internal Server Error !");
        });
    }

    let redirector = null;
    if (redirect) {
        redirector = <Redirect to = '/profile/me' />
    }

    return (
        <div className = {classes.New_Post_Container}>
            <Spinner 
                showSpinner = {props.spinner}
                text = "Uploading Post"
            />
            {redirector}

            <div className = {classes.Redirect_To_Profile}>
                <Link to = '/profile/me'> X </Link>
            </div>

            <div className = {classes.New_Post_Contents}>

                <form onSubmit={onSubmitHandler}>
                    <input 
                        type = "text"
                        placeholder = "Heading"
                        ref = {headingRef}
                    />

                    <textarea
                        placeholder = "Content"
                        ref = {contentRef}
                    />

                    <input
                        type = "file"
                        accept = "image/jpg, image/png, image/jpeg, image/webp"
                        ref = {fileRef}
                        id = "upload-post-picture"
                        className = {classes.Post_Pic_Upload}
                    />

                    <label for = "upload-post-picture">
                        Browse
                    </label>

                    <button>
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        token : state.auth.token,
        spinner : state.auth.spinner
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updatePosts : (post) => dispatch(types.updatePosts(post)),
        getCount : (n) => dispatch(types.getCount(n)),
        showSpinner : () => dispatch(types.showSpinner()),
        hideSpinner : () => dispatch(types.hideSpinner())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPost);