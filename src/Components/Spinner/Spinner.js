import React from 'react';
import classes from './Spinner.module.css';

import Backdrop from '../Backdrop/Backdrop';
import Aux from '../../HOC/auxil';

const spinner = props => {
    let show = null;
    if (props.showSpinner) {
        show = (
            <Aux>
                <Backdrop 
                    show = {true}
                />

                <div
                className = {classes.Spinner_Container}
                >
                    <div 
                        className = {classes.Spinner}
                    />
                </div>
            </Aux>
        )
    }

    return show;
}

export default spinner;