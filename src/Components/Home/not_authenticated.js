import React from 'react';
import classes from './Home.module.css';
import Create from '../Auth/sign_up';

import {NavLink} from 'react-router-dom';

const isNotAuth = props => {
    return(
        <Create />
    )
}

export default isNotAuth;