import React from 'react';
import classes from './Sidebar.module.css';

import {connect} from 'react-redux';
import * as types from '../../Store/Actions/index';

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
			<li 
				className = {classes.Logout}
				onClick = {() => props.logoutInit("once",props.token)}
			>
				Logout From This Device
			</li>
			<li 
				className = {classes.Logout}
				onClick = {() => props.logoutInit("all",props.token)}
			>
				Logout From all Devices
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

export default connect(mapStateToProps, mapDispatchToProps)(sidebar);