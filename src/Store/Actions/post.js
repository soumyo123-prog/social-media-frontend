import * as actions from './actions';

export const fetchedPosts = (posts) => {
    return {
        type : actions.FETCHED_POSTS,
        posts 
    }
}

export const errorPosts = error => {
    return {
        type : actions.ERROR_POSTS,
        error
    }
}

export const deletePost = (posts) => {
    return {
        type : actions.DELETE_POST,
        posts
    }
}

export const updatePosts = post => {
    return {
        type : actions.UPDATE_POSTS,
        post
    }
}

export const fetchPosts = (token,skip) => {
    return dispatch => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("/posts/me/all?skip=" + skip, requestOptions)
        .then(response => response.json())
        .then(posts => {
            dispatch(fetchedPosts(posts));
        })
        .catch(error => {
            dispatch(errorPosts("Could not fetch posts !"));
        });
    }
}

export const updateLikes = (id,type) => {
    return {
        type : actions.UPDATE_LIKES_SUCCESS,
        manner : type,
        id
    }
}

export const delWhileLogout = () => {
	return {
		type : actions.DEL_WHILE_LOGOUT
	}
}