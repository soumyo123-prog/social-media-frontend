import React from 'react';
import classes from './Name.module.css';
import {Link} from 'react-router-dom';

const name = props => {
    return (
        <div className = {classes.Company_Name}>
            <Link to='/'>
                Day-ConnectX
            </Link>
        </div>
    )
}

export default name;