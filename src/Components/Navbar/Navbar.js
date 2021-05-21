import React from 'react';
import classes from './Navbar.module.css';
import * as types from '../../Store/Actions/index';
import {NavLink, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import Aux from '../../HOC/auxil';
import Backdrop from '../Backdrop/Backdrop';
import Sidebar from '../Sidebar/Sidebar';

class Navbar extends React.Component{
    constructor(props){
        super(props);
        this.searchContentRef = React.createRef();
    }

    state = {
        clicked : false,
        showSidebar : false
    }

    searchClickHandler = () => {
        this.setState(prevState => {
            return {
                clicked : !(prevState.clicked)
            }
        })
    }

    searchSubmitHandler = (e) => {
        e.preventDefault();
        if (this.searchContentRef.current.value) {
            const url = '/search?name=' + this.searchContentRef.current.value;
            this.props.history.push(decodeURIComponent(url));
        } else {
            return;
        }
    }

    openSidebarClickHandler = () => {
            this.setState({
                    showSidebar : true
            })
    }

    closeSidebarClickHandler = () => {
            this.setState({
                    showSidebar : false
            })
    }

    render () {
        const searchClasses = [classes.Search_Bar];
        if (this.state.clicked) {
            searchClasses.push(classes.Search_Bar_Visible);
        }

        return (
            <Aux>
                <Backdrop 
                    show = {this.state.showSidebar}
                    hide = {this.closeSidebarClickHandler}
                />

                <Sidebar 
                        show = {this.state.showSidebar}
                />

                <header
                    className = {classes.Navbar_Container}
                >
                    <nav
                        className = {classes.Navbar}
                    >
                        <ul className={classes.Navlist}>
                            <li>
                                <NavLink to='/'>
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to='/profile/me'> 
                                    Profile 
                                </NavLink>
                            </li>
                            <li
                                className = {classes.Search}
                                onClick = {this.searchClickHandler}
                            >
                                <div className = {searchClasses.join(' ')}>
					<form onSubmit = {this.searchSubmitHandler}>
						<input 
						type = "text"
						placeholder = "Enter username"
						ref = {this.searchContentRef}
						/>
						<button> GO </button>
					</form>
				</div>
                            </li>
                            <li
                                className = {classes.Sidebar_Opener}
                                onClick = {this.openSidebarClickHandler}
                            >
                                    <hr />
                                    <hr />
                                    <hr />
                            </li>
                        </ul>
                    </nav>
                </header>

            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        error : state.auth.error,
        token : state.auth.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logoutInit : (type,token) => dispatch(types.logout(type,token))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Navbar));