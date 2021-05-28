import React from 'react';
import classes from './auth.module.css';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import * as types from '../../Store/Actions/index';
import Aux from '../../HOC/auxil';
import Name from '../Name/Name';
import Spinner from '../Spinner/Spinner';

class SignUp extends React.Component {
    state = {
        name : "",
        email : "",
        password : ""
    }
    
    onChangeHandler = (event, field) => {
        const value = event.target.value;
        this.setState({
            [field] : value
        })
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.authSignUp({
            name : this.state.name,
            email : this.state.email,
            password : this.state.password
        },"up");
    }

    render () {
        let errorMessage = null;
        if (this.props.error) {
            errorMessage = (
                <div className={classes.Error_Message}>
                    {this.props.error}
                </div>
            );
        }

        return (
            <Aux>
                <Name />
                <Spinner 
                    showSpinner = {this.props.spinner}
                    text = "Creating account"
                />
                <div className={classes.Login_Form_Container}>
                    <form 
                        className={classes.Login_Form}
                        onSubmit={this.submitHandler}
                    >
                        <input 
                            type="text" 
                            placeholder="Name"
                            onChange={(event) => this.onChangeHandler(event,"name")}
                        ></input>
                        <input 
                            type="email" 
                            placeholder="Email"
                            onChange={(event) => this.onChangeHandler(event,"email")}
                        ></input>
                        <input
                            type="password"
                            placeholder="Password"
                            onChange={(event) => this.onChangeHandler(event,"password")}
                        ></input>
                        <button>
                            Create
                        </button>
                    </form>
                    {errorMessage}
                    {this.props.token ? <Redirect to='/' /> : null}
                </div>
            </Aux>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        error : state.auth.error,
        token : state.auth.token,
        spinner : state.auth.spinner
    }
}

const mapDispatchToProps = dispatch => {
    return {
        authSignUp : (details, value) => dispatch(types.authInit(details, value)),
        pathChange : () => dispatch(types.redirected())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);