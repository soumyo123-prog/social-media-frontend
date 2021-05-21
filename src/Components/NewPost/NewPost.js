import React from 'react';
import classes from './NewPost.module.css';
import * as types from '../../Store/Actions/index';

import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

class NewPost extends React.Component {
    constructor(props) {
        super(props);
        this.headingRef = React.createRef();
        this.contentRef = React.createRef();
        this.fileRef = React.createRef();
    }

    state = {
        redirect : false,
        error : null
    }

    onSubmitHandler = (e) => {
        e.preventDefault();

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + this.props.token);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "heading": "" || this.headingRef.current.value,
            "content": "" || this.contentRef.current.value
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
            this.props.updatePosts(result);
            this.props.getCount(true);

            if (this.fileRef.current.files.length === 0) {
                this.setState({
                    redirect : true,
                    error : null
                })
                
                return new Promise((resolve, reject) => {
                    resolve();
                });

            } else {
                
                var myHeaders = new Headers();
                myHeaders.append("Authorization", "Bearer " + this.props.token);
    
                var formdata = new FormData();
                formdata.append("post", this.fileRef.current.files[0], this.fileRef.current.value);
    
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
            this.setState({
                redirect : true,
                error : null
            })
        })
        .catch(error => {
            this.setState({
                redirect : false,
                error : "Could not upload post due to internal server error !"
            })
        });
    }

    render() {
        console.log("here");

        let redirect = null;
        if (this.state.redirect) {
            redirect = <Redirect to = '/profile/me' />
        }

        let errorMessage = null;
        if (this.state.error) {
            errorMessage = <div className = {classes.ErrorMessage}> {this.state.error} </div>;
        }

        return (
            <div className = {classes.New_Post_Container}>
                {redirect}

                <div className = {classes.Redirect_To_Profile}>
                    <Link to = '/profile/me'> X </Link>
                </div>

                <div className = {classes.New_Post_Contents}>

                    <form onSubmit={this.onSubmitHandler}>
                        <input 
                            type = "text"
                            placeholder = "Heading"
                            ref = {this.headingRef}
                        />

                        <textarea
                            placeholder = "Content"
                            ref = {this.contentRef}
                        />

                        <input
                            type = "file"
                            accept = "image/jpg, image/png, image/jpeg, image/webp"
                            ref = {this.fileRef}
                        />

                        <button>
                            Submit
                        </button>
                    </form>

                    {errorMessage}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        token : state.auth.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updatePosts : (post) => dispatch(types.updatePosts(post)),
        getCount : (n) => dispatch(types.getCount(n))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPost);