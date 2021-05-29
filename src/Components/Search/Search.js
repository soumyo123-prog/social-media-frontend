import {React, useState, useEffect} from 'react';
import classes from './Search.module.css';
import Redirector from '../Redirector/redirect';
import * as types from '../../Store/Actions/index';

import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';

let skip = 0;

const Search = props => {
    
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        usersCaller();
    }, []);

    const usersCaller = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + props.token ); 

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const url="/users?skip="+skip+'&name='+props.location.search.replace('?name=','');

        fetch(url, requestOptions)
        .then(response => response.json())
        .then(users => {
            setUsers(users);
            setError(null);
        })
        .catch(error => {
            setUsers([]);
            setError("Internal Server Error !");
        });
    }

    const onClickHandler = () => {
        props.history.goBack();
    }

    const prevPage = () => {
        skip -= 5;
        usersCaller();
    }

    const nextPage = () => {
        skip += 5;
        usersCaller();
    }

    const findUser = (id) => {
        props.fetchUser(id,props.token);
    }

   
    let results = users.map(user => {
        return (
            <Link
                className = {classes.User}
                key = {user._id}
                id = {user._id}
                to = {'/profile/' + user._id}
                onClick = {() => findUser(user._id)}
            >
                <div className = {classes.User_Avatar}>
                    <img src = {'/users/'+user._id+'/avatar'} />
                </div>

                <div className = {classes.User_Details}>
                    {user.name}
                </div>
            </Link>
        )
    });

    return (
        <div
            className = {classes.Search_Container}
        >
            <Redirector />

            <div className = {classes.Redirect_To_Profile}>
                <button onClick={onClickHandler}> X </button>
            </div>
            Search Results ....

            {results}

            <div className = {classes.Change_Buttons}>
                <button
                    onClick = {prevPage}
                    disabled = {skip === 0}
                > &larr; </button>

                <button
                    onClick = {nextPage}
                    disabled = {users.length < 5}
                > &rarr; </button>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        token : state.auth.token
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUser : (id,token) => dispatch(types.fetchOtherProfile(id,token))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Search));