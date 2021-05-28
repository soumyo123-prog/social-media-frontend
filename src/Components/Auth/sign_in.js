import React from 'react';
import classes from './auth.module.css';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import * as types from '../../Store/Actions/index';
import Aux from '../../HOC/auxil';
import Name from '../Name/Name';
import Spinner from '../Spinner/Spinner';

class SignIn extends React.Component {
    state = {
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
        this.props.authSignIn({
            email : this.state.email,
            password : this.state.password
        },"in");
    }

    render () {
        return (
            <Aux>
                <Name />
                <Spinner 
                    showSpinner = {this.props.spinner}
                    text = "Logging you in"
                />
                <div className={classes.Login_Form_Container}>
                    <form 
                        className={classes.Login_Form}
                        onSubmit={this.submitHandler}
                    >
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
                            Login
                        </button>
                    </form>
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
        authSignIn : (details, value) => dispatch(types.authInit(details,value))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);