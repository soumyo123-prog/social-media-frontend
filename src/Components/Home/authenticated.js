import React from 'react';
import classes from './Home.module.css';

import Aux from '../../HOC/auxil';
import Navbar from '../Navbar/Navbar';

const isAuth = props => {
    return(
        <Aux>
            <Navbar />
        </Aux>
    )
}

export default isAuth;