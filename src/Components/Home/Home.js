import React from 'react';
import {connect} from 'react-redux';

import Name from '../Name/Name';
import IsAuth from './authenticated';
import IsNotAuth from './not_authenticated';

import classes from './Home.module.css';

const home = props => {
    const show = props.isAuthenticated ? <IsAuth /> : <IsNotAuth />;

    return(
        <div className = {classes.Home}>
            {show}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        isAuthenticated : state.auth.token 
    }
}

export default connect(mapStateToProps)(home);