import React from 'react';
import classes from './Sidebar.module.css';
import '../../icons-styling.css';

import {connect} from 'react-redux';
import {withRouter, NavLink} from 'react-router-dom';
import * as types from '../../Store/Actions/index';

import {GrLogout} from 'react-icons/gr';

let searchContent = "'";

const updateSearchQuery = (e) => {
	searchContent  = e.target.value;
}

const searchSubmitHandler = (e,props) => {
	e.preventDefault();
	if (searchContent) {
		const url = '/search?name=' + searchContent;
		props.history.push(decodeURIComponent(url));
	} else {
		return;
	}
}

const sidebar = props => {
	let sideClass = [classes.Sidebar];
	if (props.show) {
		sideClass.push(classes.Open);
	} else {
		sideClass.push(classes.Close);
	}

	return (
		<ul
			className = {sideClass.join(' ')}
		>
			<div className = {classes.Search_Bar}>
				<form onSubmit = {(e) => searchSubmitHandler(e,props)}>
					<input 
						type = "text"
						placeholder = "Username"
						onChange={updateSearchQuery}
					/>
					<button> GO </button>
				</form>
			</div>

			<li
				className = {classes.Profile}
			>
				<NavLink to='/profile/me'> 
					Profile 
				</NavLink>
			</li>

			<li 
				className = {classes.Logout}
				onClick = {() => props.logoutInit("once",props.token)}
			>
				<GrLogout 
                    size="1.3em"
                /> From This Device
			</li>
			<li 
				className = {classes.Logout}
				onClick = {() => props.logoutInit("all",props.token)}
			>
				<GrLogout 
                    size="1.3em"
                /> Logout From all Devices
			</li>
		</ul>
	)
}

const mapStateToProps = (state) => {
        return {
                token : state.auth.token
        }
}

const mapDispatchToProps = dispatch => {
        return {
            logoutInit : (type,token) => dispatch(types.logout(type,token))
        }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(sidebar));