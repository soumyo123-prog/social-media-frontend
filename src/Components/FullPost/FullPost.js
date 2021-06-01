import React, {useEffect, useState} from 'react';
import classes from './FullPost.module.css';
import Spinner from '../Spinner/Spinner';

import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import * as types from '../../Store/Actions/index';

const Fullpost = props => {
    const [post, setPost] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        props.showSpinner();
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + props.token );

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        
        fetch("/posts/"+props.match.params.id , requestOptions)
        .then(response => response.json())
        .then(post => {
            props.hideSpinner();
            setPost(post);
            setError(null);
            console.log(post);
        })
        .catch(error => {
            props.hideSpinner();
            setPost({});
            setError(error);
        });

    }, []);

    const onClickHandler = () => {
        props.history.goBack();
    }

    let render = (
        <Spinner 
            showSpinner = {props.spinner}
            text = "Fetching Post"
        />
    )

    if (!props.spinner) {
        render = (
            <div
                className = {classes.Fullpost_Container}
            >
                <button
                    className = {classes.GoBackButton}
                    onClick = {onClickHandler}
                >
                    X
                </button>

                <div className = {classes.Fullpost}>
                    <img src = {'/posts/image/' + props.match.params.id} />
                    <div className = {classes.PostHeading}>
                        {post.heading}
                    </div>
                    <div className = {classes.PostContent}>
                        {post.content}
                    </div>
                </div>
            </div>
        )
    }

    return render;
}

const mapStateToProps = state => {
    return {
        token : state.auth.token,
        spinner : state.auth.spinner
    }
}

const mapDispatchToProps = dispatch => {
    return {
        showSpinner : () => dispatch(types.showSpinner()),
        hideSpinner : () => dispatch(types.hideSpinner())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Fullpost));