import {React, useState, useRef} from 'react';
import classes from './Navbar.module.css';
import * as types from '../../Store/Actions/index';
import {NavLink, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import Aux from '../../HOC/auxil';
import Backdrop from '../Backdrop/Backdrop';
import Sidebar from '../Sidebar/Sidebar';

import search from '../../Assets/search-icon.svg'
import {FaHome} from 'react-icons/fa';
import {CgProfile} from 'react-icons/cg';

const Navbar = props => {

	const [clicked, setClicked] = useState(false);
	const [showSidebar, setShowSidebar] = useState(false);

	const searchContentRef = useRef(null);

	const searchSubmitHandler = (e) => {
		e.preventDefault();
		if (searchContentRef.current.value) {
			const url = '/search?name=' + searchContentRef.current.value;
			props.history.push(decodeURIComponent(url));
		} else {
			return;
		}
	}

	const openSidebarClickHandler = () => {
		setShowSidebar(true);
	}

	const closeSidebarClickHandler = () => {
		setShowSidebar(false);
	}

	
	return (
		<Aux>
			<Backdrop 
				show = {showSidebar}
				hide = {closeSidebarClickHandler}
			/>

			<Sidebar 
				show = {showSidebar}
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
                        <FaHome size="1.3em"/> Home
					</NavLink>
				</li>
				<li
					className = {classes.Profile}
				>
					<NavLink to='/profile/me'> 
						<CgProfile size="1.3em"/> Profile 
					</NavLink>
				</li>
				<li
					className = {classes.Search}
				>
					<div className = {classes.Search_Bar}>
						<form onSubmit = {searchSubmitHandler}>
							<input 
								type = "text"
								placeholder = "Username"
								ref = {searchContentRef}
							/>
							<button>
                                <img src={search} />
                            </button>
						</form>
					</div>
				</li>
				<li
					className = {classes.Sidebar_Opener}
					onClick = {openSidebarClickHandler}
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