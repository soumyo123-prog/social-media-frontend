import React from 'react';
import Create from '../Auth/sign_up';
import Login from '../Auth/sign_in';

import {connect} from 'react-redux';

const isNotAuth = props => {
    let show = <Create />
    if (props.login) {
        show = <Login />
    }

    return show;
}

const mapStateToProps = state => {
    return {
        login : state.auth.login
    }
}

export default connect(mapStateToProps)(isNotAuth);