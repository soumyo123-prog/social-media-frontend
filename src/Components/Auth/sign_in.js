import {React, useRef} from 'react';
import classes from './auth.module.css';
import {connect} from 'react-redux';
import {Redirect, Link} from 'react-router-dom';

import * as types from '../../Store/Actions/index';
import Aux from '../../HOC/auxil';
import Name from '../Name/Name';
import Spinner from '../Spinner/Spinner';

const Signin = props => {
    const comp = true;

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const submitHandler = (event) => {
        event.preventDefault();
        props.authSignIn({
            email : emailRef.current.value,
            password : passwordRef.current.value
        },"in");
    }

    return (
        <Aux>
            <Name />
            <Spinner 
                showSpinner = {props.spinner}
                text = "Logging you in"
            />
            <div className={classes.Login_Form_Container}>
                <form 
                    className={classes.Login_Form}
                    onSubmit={submitHandler}
                >
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
                        Login
                    </button>
                </form>
                {props.token ? <Redirect to='/' /> : null}

                <div className = {classes.Already}>
                    Don't Have an Account ?
                    <Link to = '/auth/createAcc'> {comp ? "Create" : "Login"} </Link>
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
        authSignIn : (details, value) => dispatch(types.authInit(details,value))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signin);