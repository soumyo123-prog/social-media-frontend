import React from 'react';
import classes from './Search.module.css';
import Redirector from '../Redirector/redirect';
import * as types from '../../Store/Actions/index';

import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';

let skip = 0;

class Search extends React.Component {
    state = {
        users : [],
        error : null
    }

    componentDidMount () {
        this.usersCaller();
    }

    usersCaller = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + this.props.token ); 

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const url="/users?skip="+skip+'&name='+this.props.location.search.replace('?name=','');

        fetch(url, requestOptions)
        .then(response => response.json())
        .then(users => {
            this.setState({
                users : users,
                error : null 
            })
        })
        .catch(error => {
            this.setState({
                users : [],
                error : "Could not fetch results !"
            })
        });
    }

    onClickHandler = () => {
        this.props.history.goBack();
    }

    prevPage = () => {
        skip -= 5;
        this.usersCaller();
    }

    nextPage = () => {
        skip += 5;
        this.usersCaller();
    }

    findUser = (id) => {
        this.props.fetchUser(id,this.props.token);
    }

    render () {

        let results = this.state.users.map(user => {
            return (
                <Link
                    className = {classes.User}
                    key = {user._id}
                    id = {user._id}
                    to = {'/profile/' + user._id}
                    onClick = {() => this.findUser(user._id)}
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

        let errorMessage = null;
        if (this.state.error) {
            errorMessage = <div className = {classes.ErrorMessage}> {this.state.error} </div>
        }

        return (
            <div
                className = {classes.Search_Container}
            >
                <Redirector />

                <div className = {classes.Redirect_To_Profile}>
                    <button onClick={this.onClickHandler}> X </button>
                </div>
                Search Results ....

                {results}

                <div className = {classes.Change_Buttons}>
                    <button
                        onClick = {this.prevPage}
                        disabled = {skip === 0}
                    > &larr; </button>

                    <button
                        onClick = {this.nextPage}
                        disabled = {this.state.users.length < 5}
                    > &rarr; </button>
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

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUser : (id,token) => dispatch(types.fetchOtherProfile(id,token))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Search));