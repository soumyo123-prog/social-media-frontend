import * as actions from './actions';

export const fetchOtherProfileSuccess = (user) => {
    return {
        type : actions.FETCH_OTHER_PROFILE_SUCCESS,
        user
    }
}

export const fetchOtherProfileFail = (error) => {
    return {
        type : actions.FETCH_OTHER_PROFILE_FAIL,
        error
    }
}

export const fetchOtherProfile = (id, token) => {
    return dispatch => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("/users/" + id, requestOptions)
        .then(response => response.json())
        .then(user => {
            if (user.error) {
                return dispatch(fetchOtherProfileFail(user.error));
            }
            dispatch(fetchOtherProfileSuccess(user));
        })
        .catch(error => {
            dispatch(fetchOtherProfileFail(error));
        });
    }
}

export const fetchOtherPostsSuccess = (post) => {
    return {
        type : actions.FETCH_OTHER_POSTS_SUCCESS,
        post
    }
}

export const fetchOtherPostsFail = (error) => {
    return {
        type : actions.FETCH_OTHER_POSTS_FAIL,
        error
    }
}

export const fetchOtherPosts = (id, token, skip) => {
    return dispatch => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("/posts/" + id + "/all?skip=" + skip, requestOptions)
        .then(response => response.json())
        .then(post => {
            dispatch(fetchOtherPostsSuccess(post));
        })
        .catch(error => {
            dispatch(fetchOtherPostsFail(error));
        });
    }
}

export const clearOtherProfile = () => {
    return {
        type : actions.CLEAR_OTHER_PROFILE
    }
}

export const updateLikesOthers = (id,type) => {
    return {
        type : actions.UPDATE_LIKES_SUCCESS_OTHER,
        manner : type,
        id
    }
}