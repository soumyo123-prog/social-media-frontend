import React, {useState, useEffect} from 'react';
import classes from './authenticated.module.css';
import Navbar from '../Navbar/Navbar';

import {connect} from 'react-redux';

let skip = 0;

const IsAuth = props => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
    },[]);

    const fetchPosts = () => {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + props.token);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("/posts?skip="+skip, requestOptions)
            .then(response => response.json())
            .then(posts => {
                setPosts(prevPosts => {
                    const updatedPosts = prevPosts.concat(posts);
                    return updatedPosts;
                })
            })
            .catch(error => error);
    }

    const recPosts = posts.length > 0 ? posts.map(post => {
        return (
            <div className={classes.Post}>
                <div 
                    className={classes.Post_Picture} 
                    style = {{
                        backgroundImage : 'url(/posts/image/'+post._id+')'
                    }}
                />
            </div>
        )
    }) : null;

    return(
        <>
        <Navbar />
        <div className = {classes.Posts_Container}>
            {recPosts}
        </div>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        token : state.auth.token
    }
}

export default connect(mapStateToProps)(IsAuth);