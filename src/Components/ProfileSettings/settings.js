import {React, useState, useRef} from 'react';
import classes from './settings.module.css';
import * as types from '../../Store/Actions/index';

import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import Dragdrop from '../DragDrop/dragDrop';
import Spinner from '../Spinner/Spinner';

const Settings = props => {

    const [update, setUpdate] = useState(false);
    const [del, setDel] = useState(false);
    const [avatar, setAvatar] = useState(false);
    const [about, setAbout] = useState(false);
    const [error, setError] = useState(null);
    const [redirect, setRedirect] = useState(false);

    const newNameRef = useRef(null);
    const newEmailRef = useRef(null);
    const inputFileRef = useRef(null);
    const textRef = useRef(null);

    const updateClickHandler = () => {
        setUpdate(!update);
    }

    const updateSubmitHandler = e => {
        props.showSpinner();
        e.preventDefault();

        const newName = (newNameRef.current.value === "" ? 
                        props.name : newNameRef.current.value);
        
        const newEmail = (newEmailRef.current.value === "" ? 
                        props.email : newEmailRef.current.value);
        
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + props.token);
        myHeaders.append("Content-Type", "application/json");
        
        var raw = JSON.stringify({
            "name": newName,
            "email": newEmail
        });
        
        var requestOptions = {
            method: 'PATCH',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        
        fetch("/users/modify/me", requestOptions)
            .then(response => {
                props.hideSpinner();

                setRedirect(true);
                setUpdate(false);
                setError(null);

                props.updateUser(newName,newEmail);
            })
            .catch(error => {
                props.hideSpinner();

                setError("Internal Server Error !");
                setRedirect(false);
            });
    }

    const delClickHandler = () => {
        setDel(!del);
    }

    const confirmDelClickHandler = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+props.token);

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("/users/remove/me", requestOptions)
            .then(response => {
                setDel(false);
                setError(null);

                props.deleteUser();
            })
            .catch(error => {
                setError("Internal Server Error !");
            });
    }

    const avatarUpdateClick = () => {
        setAvatar(!avatar);
    }

    const aboutClickHandler = () => {
        setAbout(!about);
    }

    const updateAboutHandler = (e) => {
        e.preventDefault();

        const value = textRef.current.value;
        props.updateAbout(value, props.token);
    }

    let updateForm = null;
    if (update) {
        updateForm = (
            <form 
                onSubmit={updateSubmitHandler}
                className = {classes.Update_Form}
            >
                <input 
                    type = "text" 
                    placeholder = "New name" 
                    ref = {newNameRef} 
                />
                <input 
                    type = "email" 
                    placeholder = "New E-Mail" 
                    ref = {newEmailRef} 
                />
                <button className = {classes.Submit_Button}>
                    Submit
                </button>
            </form>
        )
    }  
    
    let delForm = null;
    if (del) {
        delForm = (
            <main className = {classes.Delete}>
                <button 
                    className = {classes.Back}
                    onClick = {delClickHandler}
                >Back</button>

                <button 
                    className = {classes.Confirm}
                    onClick = {confirmDelClickHandler}
                >Confirm</button>
            </main>
        );
    }

    let avatarForm = null;
    if (avatar) {
        avatarForm = (
            <Dragdrop />
        )
    }

    let aboutForm = null;
    if (about) {
        aboutForm = (
            <form
                onSubmit = {updateAboutHandler}
                className = {classes.About_Form}
            >
                <textarea 
                    ref = {textRef}
                    placeholder = "About"
                />
                <button>
                    Submit
                </button>
            </form>
        )
    }

    let redirector = null;
    if (!props.token) {
        redirector = <Redirect to = '/' />
    }

    return (
        <div className = {classes.Settings_Container}>
            <Spinner 
                text = "Updating Profile"
                showSpinner = {props.spinner}
            />
            {redirector}
            {redirect ? <Redirect to='/profile/me' /> : null}

            <div className = {classes.Redirect_To_Profile}>
                <Link to='/profile/me' > X </Link>
            </div>
            <div className = {classes.Setting_Container}>

                <div 
                    className = {classes.Update_Avatar}
                    onClick = {avatarUpdateClick}
                > 
                    Update Avatar
                </div>
                {avatarForm}

                <div 
                    className = {classes.Update_Profile}
                    onClick = {updateClickHandler}
                > 
                    Update Profile
                </div>
                {updateForm}

                <div 
                    className = {classes.Delete_Profile}
                    onClick = {delClickHandler}
                >
                    Delete Profile
                </div>
                {delForm}

                <div
                    className = {classes.Update_About}
                    onClick = {aboutClickHandler}
                >
                    Update About
                </div>
                {aboutForm}
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        name : state.auth.user ? state.auth.user.name :  null,
        email : state.auth.user ? state.auth.user.email : null,
        token : state.auth.token ? state.auth.token : null,
        spinner : state.auth.spinner
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateUser : (name,email) => dispatch(types.updateUser(name,email)),
        deleteUser : () => dispatch(types.deleteUser()),
        updateAbout : (about, token) => dispatch(types.updateAbout(about, token)),
        showSpinner : () => dispatch(types.showSpinner()),
        hideSpinner : () => dispatch(types.hideSpinner())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Settings);