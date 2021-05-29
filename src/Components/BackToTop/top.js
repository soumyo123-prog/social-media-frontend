import React from 'react';
import classes from './top.module.css';

const top = props => {
    const moveTop = (e) => {
        props.element.current.scrollTop = 0;
    }

    const topClasses = [classes.Top];
    if (props.show) {
        topClasses.push(classes.Top_Visible);
    } else {
        topClasses.push(classes.Top_Invisible);
    }

    return (
        <button
            className = {topClasses.join(' ')}
            onClick = {moveTop}
        >
            Top
        </button>
    );
}

export default top;