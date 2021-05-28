import React from 'react';
import classes from './settings.module.css';
import * as types from '../../Store/Actions/index';

import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import Dragdrop from '../DragDrop/dragDrop';
import Spinner from '../Spinner/Spinner';

class Settings extends React.Component {
    constructor(props){
        super(props);
        this.newNameRef = React.createRef();
        this.newEmailRef = React.createRef();
        this.inputFileRef = React.createRef();
        this.textRef = React.createRef();
    }

    state = {
        update : false,
        delete : false,
        avatar: false,
        about : false,
        error : null,
        redirect : false
    }

    updateClickHandler = () => {
        this.setState(prev => {
            return {
                update : !(prev.update)
            }
        })
    }

    updateSubmitHandler = e => {
        this.props.showSpinner();
        e.preventDefault();

        const newName = (this.newNameRef.current.value === "" ? 
                        this.props.name : this.newNameRef.current.value);
        
        const newEmail = (this.newEmailRef.current.value === "" ? 
                        this.props.email : this.newEmailRef.current.value);
        
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + this.props.token);
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
                this.props.hideSpinner();

                this.setState({
                    update : false,
                    error : null,
                    redirect : true
                })
                this.props.updateUser(newName,newEmail);
            })
            .catch(error => {
                this.props.hideSpinner();

                this.setState({
                    error : error.message,
                    redirect : false
                })
            });
    }

    deleteClickHandler = () => {
        this.setState(prev => {
            return {
                delete : !(prev.delete)
            }
        })
    }

    confirmDeleteClickHandler = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+this.props.token);

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("/users/remove/me", requestOptions)
            .then(response => {
                this.setState({
                    error : null,
                    delete : false
                })

                this.props.deleteUser();
            })
            .catch(error => {
                this.setState({
                    error : error.message
                })
            });
    }

    avatarUpdateClick = () => {
        this.setState(prev => {
            return {
                avatar : !(prev.avatar)
            }
        })
    }

    aboutClickHandler = () => {
        this.setState(prev => {
            return {
                about : !(prev.about)
            }
        })
    }

    updateAboutHandler = (e) => {
        e.preventDefault();

        const value = this.textRef.current.value;
        this.props.updateAbout(value, this.props.token);
    }

    render () {
        let updateForm = null;
        if (this.state.update) {
            updateForm = (
                <form 
                    onSubmit={this.updateSubmitHandler}
                    className = {classes.Update_Form}
                >
                    <input 
                        type = "text" 
                        placeholder = "New name" 
                        ref = {this.newNameRef} 
                    />
                    <input 
                        type = "email" 
                        placeholder = "New E-Mail" 
                        ref = {this.newEmailRef} 
                    />
                    <button className = {classes.Submit_Button}>
                        Submit
                    </button>
                </form>
            )
        }  
        
        let deleteForm = null;
        if (this.state.delete) {
            deleteForm = (
                <main className = {classes.Delete}>
                    <button 
                        className = {classes.Back}
                        onClick = {this.deleteClickHandler}
                    >Back</button>

                    <button 
                        className = {classes.Confirm}
                        onClick = {this.confirmDeleteClickHandler}
                    >Confirm</button>
                </main>
            );
        }

        let avatarForm = null;
        if (this.state.avatar) {
            avatarForm = (
                <Dragdrop />
            )
        }

        let aboutForm = null;
        if (this.state.about) {
            aboutForm = (
                <form
                    onSubmit = {this.updateAboutHandler}
                    className = {classes.About_Form}
                >
                    <textarea 
                        ref = {this.textRef}
                        placeholder = "About"
                    />
                    <button>
                        Submit
                    </button>
                </form>
            )
        }

        let errorMessage = null;
        if (this.state.error) {
            errorMessage = <div className = {classes.ErrorMessage}> {this.state.error} </div>
        }

        let redirector = null;
        if (!this.props.token) {
            redirector = <Redirect to = '/' />
        }

        return (
            <div className = {classes.Settings_Container}>
                <Spinner 
                    text = "Updating Profile"
                    showSpinner = {this.props.spinner}
                />
                {redirector}
                {this.state.redirect ? <Redirect to='/profile/me' /> : null}

                <div className = {classes.Redirect_To_Profile}>
                    <Link to='/profile/me' > X </Link>
                </div>
                <div className = {classes.Setting_Container}>

                    <div 
                        className = {classes.Update_Avatar}
                        onClick = {this.avatarUpdateClick}
                    > 
                        Update Avatar
                    </div>
                    {avatarForm}

                    <div 
                        className = {classes.Update_Profile}
                        onClick = {this.updateClickHandler}
                    > 
                        Update Profile
                    </div>
                    {updateForm}

                    <div 
                        className = {classes.Delete_Profile}
                        onClick = {this.deleteClickHandler}
                    >
                        Delete Profile
                    </div>
                    {deleteForm}

                    <div
                        className = {classes.Update_About}
                        onClick = {this.aboutClickHandler}
                    >
                        Update About
                    </div>
                    {aboutForm}

                    {errorMessage}
                </div>
            </div>
        )
    }
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