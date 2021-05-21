import React from 'react';
import classes from './FullPost.module.css';

const fullPost = props => {
    let render = null;
    if (props.show) {
        render = (
            <div
            className = {classes.Modal}        
            >
                <div className = {classes.Image_Container}>
                    <img src = {'/posts/image/' + props.postId} />
                </div>

                <div className = {classes.Post_Heading}>
                    {props.heading}
                </div>

                <div className = {classes.Post_Content}>
                    {props.content}
                </div>
            </div>
        )
    }

    return render;
}

export default fullPost;