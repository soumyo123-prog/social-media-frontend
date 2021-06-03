import React from 'react';
import classes from './Home.module.css';

import {connect} from 'react-redux';
import IsAuth from './authenticated';
import IsNotAuth from './not_authenticated';

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