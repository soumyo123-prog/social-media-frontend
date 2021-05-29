import {React, useState} from 'react';
import classes from './dragDrop.module.css';

import { connect } from 'react-redux';
import * as types from '../../Store/Actions/index';
import { Redirect } from 'react-router';

let file;

const DragDrop = props => {

	const [fileError, setFileError] = useState(null);
	const [redirect, setRedirect] = useState(false);

	const avatarUpdateSubmit = (e) => {

		if (e.target.value) {
			props.showSpinner();

			let myHeaders = new Headers();
			myHeaders.append("Authorization", "Bearer " + props.token);

			let formdata = new FormData();
			formdata.append("avatar", e.target.files[0], e.target.value);

			let requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: formdata,
				redirect: 'follow'
			};

			fetch("/users/me/avatar", requestOptions)
				.then(response => {
					props.hideSpinner();

					setRedirect(true);
				})
				.catch(error => {
					props.hideSpinner();

					setRedirect(false);
				});
		}
	}

	const fileDragOverHandler = (e) => {
		e.preventDefault();
	}

	const fileDragLeaveHandler = (e) => {
		e.preventDefault();
	}

	const fileDropHandler = (e) => {
		e.preventDefault();

		file = e.dataTransfer.files[0];
		const supported = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

		if (supported.includes(file.type)) {
			if (file.size <= 1000000) {
				props.showSpinner();

				let myHeaders = new Headers();
				myHeaders.append("Authorization", "Bearer " + props.token);

				let formdata = new FormData();
				formdata.append("avatar-drop", file);

				let requestOptions = {
					method: 'POST',
					headers: myHeaders,
					body: formdata,
					redirect: 'follow'
				};

				fetch("/users/me/avatar/drop", requestOptions)
					.then(response => {
						props.hideSpinner();

						setRedirect(true);
						setFileError(null);
					})
					.catch(error => {
						props.hideSpinner();

						setRedirect(false);
						setFileError("Internal Server Error !");
					});

			} else {
				setFileError("Size of file should be less than 1 MegaByte !");
			}

		} else {
			setFileError("Please upload file with extensions .jpeg, .png or .webp !");
		}
	}

	const dragClasses = [classes.Dragdrop_Container];

	return (
		<div
			className={dragClasses.join(' ')}
			onDragOver={fileDragOverHandler}
			onDragLeave={fileDragLeaveHandler}
			onDrop={fileDropHandler}
		>
			{redirect ? <Redirect to ='/profile/me' /> : null}
			<div>Drag and Drop File</div>
			<div>OR</div>

			<input
				className={classes.Browse}
				type="file"
				accept="image/png, image/jpeg, image/webp, image/jpg"
				name="avatar"
				id="avatar-upload"
				onChange={avatarUpdateSubmit}
			/>
			<label for="avatar-upload">Browse</label>

		</div>
	)
}

const mapStateToProps = state => {
	return {
		token: state.auth.token ? state.auth.token : null
	}
}

const mapDispatchToProps = dispatch => {
	return {
		showSpinner : () => dispatch(types.showSpinner()),
		hideSpinner : () => dispatch(types.hideSpinner())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(DragDrop);