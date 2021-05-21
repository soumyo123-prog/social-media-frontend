import React from 'react';
import classes from './Backdrop.module.css';

const backdrop = props => {
    let render = null;
    if (props.show) {
        render = <div className = {classes.Backdrop} onClick = {props.hide} />
    }

    return render
}

export default backdrop;