import React from 'react';
import classes from './dragDrop.module.css';

import { connect } from 'react-redux';
import * as types from '../../Store/Actions/index';
import { Redirect } from 'react-router';

let file;

class DragDrop extends React.Component {
	constructor(props) {
		super(props);
		this.dragFileRef = React.createRef();
	}

	state = {
		fileError: null,
		redirect : false
	}

	avatarUpdateSubmit = (e) => {

		if (e.target.value) {
			this.props.showSpinner();

			let myHeaders = new Headers();
			myHeaders.append("Authorization", "Bearer " + this.props.token);

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
					this.props.hideSpinner();

					this.setState({
						redirect : true
					})
				})
				.catch(error => {
					this.props.hideSpinner();

					this.setState({
						redirect : false
					})
				});
		}
	}

	fileDragOverHandler = (e) => {
		e.preventDefault();
	}

	fileDragLeaveHandler = (e) => {
		e.preventDefault();
	}

	fileDropHandler = (e) => {
		e.preventDefault();

		file = e.dataTransfer.files[0];
		const supported = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

		if (supported.includes(file.type)) {
			if (file.size <= 1000000) {
				this.props.showSpinner();

				let myHeaders = new Headers();
				myHeaders.append("Authorization", "Bearer " + this.props.token);

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
						this.props.hideSpinner();

						this.setState({
							fileError: null,
							redirect : true
						})
					})
					.catch(error => {
						this.props.hideSpinner();

						this.setState({
							fileError: "Internal Server Error !",
							redirect : false
						})
					});

			} else {
				this.setState({
					fileError: "Size of file should be less than 1 MegaByte !"
				})
			}

		} else {
			this.setState({
				fileError: "Please upload file with extensions .jpeg, .png or .webp !"
			})
		}
	}

	render() {
		const dragClasses = [classes.Dragdrop_Container];

		return (
			<div
				className={dragClasses.join(' ')}
				onDragOver={this.fileDragOverHandler}
				onDragLeave={this.fileDragLeaveHandler}
				onDrop={this.fileDropHandler}
			>
				{this.state.redirect ? <Redirect to ='/profile/me' /> : null}
				<div>Drag and Drop File</div>
				<div>OR</div>

				<input
					className={classes.Browse}
					type="file"
					accept="image/png, image/jpeg, image/webp, image/jpg"
					name="avatar"
					id="avatar-upload"
					onChange={this.avatarUpdateSubmit}
				/>
				<label for="avatar-upload">Browse</label>

			</div>
		)
	}
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