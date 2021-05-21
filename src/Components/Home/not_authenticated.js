import React from 'react';
import classes from './Home.module.css';
import {NavLink} from 'react-router-dom';

const isNotAuth = props => {
    return(
        <ul className={classes.isNot}>
            <li>
                <NavLink to='/auth/createAcc'>
                    Create
                </NavLink>
            </li>
            <li>
                <NavLink to='/auth/login'>
                    Login
                </NavLink>
            </li>
        </ul>
    )
}

export default isNotAuth;