import {React, useRef} from 'react';
import classes from './auth.module.css';
import {connect} from 'react-redux';
import {Redirect, Link} from 'react-router-dom';

import * as types from '../../Store/Actions/index';
import Aux from '../../HOC/auxil';
import Name from '../Name/Name';
import Spinner from '../Spinner/Spinner';

const Signup = props => {
    const comp = false;

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const submitHandler = (event) => {
        event.preventDefault();
        props.authSignUp({
            name : nameRef.current.value,
            email : emailRef.current.value,
            password : passwordRef.current.value
        },"up");
    }

    return (
        <Aux>
            <Name />
            <Spinner 
                showSpinner = {props.spinner}
                text = "Creating account"
            />
            <div className={classes.Login_Form_Container}>
                <form 
                    className={classes.Login_Form}
                    onSubmit={submitHandler}
                >
                    <input 
                        type="text" 
                        placeholder="Name"
                        ref = {nameRef}
                    />

                    <input 
                        type="email" 
                        placeholder="Email"
                        ref = {emailRef}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        ref = {passwordRef}
                    />

                    <button>
                        Create
                    </button>
                </form>
                {props.token ? <Redirect to='/' /> : null}

                <div className = {classes.Already}>
                    Already have an account ?
                    <button onClick = {props.toggle} >Login</button>
                </div>
            </div>
        </Aux>
    )
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
        pathChange : () => dispatch(types.redirected()),
        toggle : () => dispatch(types.toggleAuth())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);