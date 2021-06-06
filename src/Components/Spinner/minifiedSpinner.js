import React from 'react';
import classes from './Spinner.module.css';

const spinner = props => {
    let show = null;
    console.log(props.showSpinner);
    if (props.showSpinner) {
        show = (
            <div
                className = {classes.Spinner_Container_Min}
            >
                <div 
                    className = {classes.Spinner}
                />
                <div
                    className = {classes.Spinner_Text}
                >
                    {null || props.text}
                </div>
            </div>
        )
    }
    return show;
}

export default spinner;