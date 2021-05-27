import React from 'react';
import classes from './dragDrop.module.css';

import { connect } from 'react-redux';

let file;

class DragDrop extends React.Component {
	constructor(props) {
		super(props);
		this.dragFileRef = React.createRef();
	}

	state = {
		dragging: false,
		fileError: null
	}

	avatarUpdateSubmit = (e) => {

		if (e.target.value) {

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
					return response;
				})
				.catch(error => {
					return error;
				});
		}
	}

	fileDragOverHandler = (e) => {
		e.preventDefault();
		this.setState({
			dragging: true
		})
	}

	fileDragLeaveHandler = (e) => {
		this.setState({
			dragging: false
		})
	}

	fileDropHandler = (e) => {
		e.preventDefault();

		file = e.dataTransfer.files[0];
		const supported = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

		if (supported.includes(file.type)) {
			if (file.size <= 1000000) {

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
					.then(response => response)
					.catch(error => {
						this.setState({
							fileError: "Internal Server Error !"
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
		if (this.state.dragging) {
			dragClasses.push(classes.IsDragging)
		}

		return (
			<div
				className={dragClasses.join(' ')}
				onDragOver={this.fileDragOverHandler}
				onDragLeave={this.fileDragLeaveHandler}
				onDrop={this.fileDropHandler}
			>
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

export default connect(mapStateToProps)(DragDrop);