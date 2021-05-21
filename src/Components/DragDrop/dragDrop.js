import React from 'react';
import classes from './dragDrop.module.css';

import {connect} from 'react-redux';

let file;

class DragDrop extends React.Component {
	constructor(props) {
		super(props);
		this.dragFileRef = React.createRef();
		this.inputFileRef = React.createRef();
	}

	state = {
		dragging : false,
		fileError : null
	}

	avatarUpdateSubmit = (e) => {
		e.preventDefault();
	
		if (this.inputFileRef.current.value) {
	
		    var myHeaders = new Headers();
		    myHeaders.append("Authorization", "Bearer " + this.props.token);
	
		    var formdata = new FormData();
		    formdata.append("avatar", this.inputFileRef.current.files[0], this.inputFileRef.current.value);
	
		    var requestOptions = {
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
			dragging : true
		})

		console.log("User is dragging");
	}

	fileDragLeaveHandler = (e) => {
		this.setState({
			dragging : false
		})

		console.log("User is leaving");
	}

	fileDropHandler = (e) => {
		e.preventDefault();

		file = e.dataTransfer.files[0];
		const supported = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

		if (file.type.includes(supported)) {
			const fileReader = new FileReader();
			fileReader.onload = () => {
				const fileUrl = fileReader.result;
				console.log(fileReader);
			}

			fileReader.readAsDataURL(file);

		} else {
			this.setState({
				fileError : "Please upload file with extensions .jpeg, .png or .webp"
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
				className = {dragClasses.join(' ')}
				onDragOver = {this.fileDragOverHandler}
				onDragLeave = {this.fileDragLeaveHandler}
				onDrop = {this.fileDropHandler}
			>
				<div>Drag and Drop File</div>
				<div>OR</div>

				<form 
					className={classes.Add_Avatar} 
					onSubmit={this.avatarUpdateSubmit} 
				>
					<input 
						type = "file"
						accept = "image/png, image/jpeg, image/webp, image/jpg"
						name = "avatar" 
						ref = {this.inputFileRef}
					/>
					<button
						className = {classes.Avatar_Submit}
					> Submit </button>
				</form>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
	    token : state.auth.token ? state.auth.token : null
	}
}
    
export default connect(mapStateToProps)(DragDrop);