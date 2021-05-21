import * as actions from './actions';
import * as types from './index';

export const authStart = () => {
    return {
        type : actions.AUTH_START
    }
}

export const authSuccess = (user,token) => {
    return {
        type : actions.AUTH_SUCCESS,
        user,
        token
    }
}

export const authFailed = (error) => {
    return {
        type : actions.AUTH_FAILED,
        error : error
    }
}

export const redirected = () => {
    return {
        type : actions.REDIRECTED
    }
}

export const authInit = (details,value) => {
    return dispatch => {
        dispatch(authStart());

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let url = "/users/login";
        if (value === "up") {
            url = "/users/add";
        }

        let raw = JSON.stringify(details);

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.name === "MongoError" && result.keyPattern.email === 1) {
                    return dispatch(authFailed("User with this email already exists !"));
                }

                if (result.error) {
                    return dispatch(authFailed(result.error));
                }

                localStorage.setItem('token',result.token);
                localStorage.setItem('user',JSON.stringify(result.user));

                dispatch(authSuccess(result.user, result.token));
            })
            .catch(error => {
                dispatch(authFailed(error.message));
            });
        }
}

export const tryAutoSignIn = () => {
    return dispatch => {
        dispatch(authStart());

        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (token && user) {
            dispatch(authSuccess(user,token));
        } else {
            dispatch(authFailed());
        }
    }
}

export const logoutOnce = () => {
    return {
        type : actions.LOGOUT_ONCE
    }
}

export const logoutAll = () => {
    return {
        type : actions.LOGOUT_ALL
    }
}

export const logoutFailed = (error) => {
    return {
        type : actions.LOGOUT_FAILED,
        error 
    }
}

export const logout = (type, token) => {
    return dispatch => {

        let url = "/users/logout";
        if (type === "all") {
            url = "/users/logoutAll";
        }

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+token);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.text())
            .then(result => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');

		dispatch(types.delWhileLogout());

                if (type === "all") {
                    dispatch(logoutAll());
                } else {
                    dispatch(logoutOnce());
                }
            })
            .catch(error => {
                dispatch(logoutFailed("Cannot logout due to internal server error !"));
            });
        }
}

export const updateUser = (name, email) => {
    const user = JSON.parse(localStorage.getItem('user'));
    user.name = name;
    user.email = email;
    localStorage.setItem('user',JSON.stringify(user));

    return {
        type : actions.UPDATE_USER,
        name,
        email
    }
}

export const deleteUser = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    return {
        type : actions.DELETE_USER
    }
}

export const getCount = (nature) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (nature) {
        user.countPosts += 1;
    } else {
        user.countPosts -= 1;
    }
    localStorage.setItem('user',JSON.stringify(user));

    return {
        type : actions.CHANGE_COUNT,
        nature
    }
}

export const updateLikedSuccess = (user) => {
    localStorage.setItem('user', JSON.stringify(user));

    return {
        type : actions.UPDATE_LIKED_SUCCESS,
        user
    }
}

export const updateLikedFailure = (error) => {
    return {
        type : actions.UPDATE_LIKED_FAILURE,
        error
    }
}

export const updateLiked = (token, id, type) => {
    return dispatch => {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        let requestOptions = {
            method: 'PATCH',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("/posts/"+id+"/likes?type="+type, requestOptions)
        .then(response => response.json())
        .then(user => {
            dispatch(updateLikedSuccess(user));
        })
        .catch(error => {
            dispatch(updateLikedFailure(error));
        });
    }
}
