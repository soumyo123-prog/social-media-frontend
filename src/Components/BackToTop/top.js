import React from 'react';
import classes from './top.module.css';

const top = props => {
    const topHandler = () => {
        props.scrollEl.scrollTop = 0;
    }

    return (
        <button
            className = {classes.Top}
            onClick = {topHandler}
        >
            Top
        </button>
    );
}

export default top;