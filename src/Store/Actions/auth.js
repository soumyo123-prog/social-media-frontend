import * as actions from './actions';
import * as types from './index';

export const showSpinner = () => {
    return {
        type : actions.SHOW_SPINNER
    }
}

export const hideSpinner = () => {
    return {
        type : actions.HIDE_SPINNER
    }
}

export const authStart = () => {
    return {
        type: actions.AUTH_START
    }
}

export const authSuccess = (user, token) => {
    return {
        type: actions.AUTH_SUCCESS,
        user,
        token
    }
}

export const authFailed = (error) => {
    return {
        type: actions.AUTH_FAILED,
        error: error
    }
}

export const redirected = () => {
    return {
        type: actions.REDIRECTED
    }
}

export const authInit = (details, value) => {
    return dispatch => {
        dispatch(authStart());
        dispatch(showSpinner());

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
                    dispatch(hideSpinner());
                    return dispatch(authFailed("User with this email already exists !"));
                }

                if (result.error) {
                    dispatch(hideSpinner());
                    return dispatch(authFailed(result.error));
                }

                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));

                dispatch(hideSpinner());
                dispatch(authSuccess(result.user, result.token));
            })
            .catch(error => {
                dispatch(hideSpinner());
                dispatch(authFailed(error.message));
            });
    }
}

export const tryAutoSignIn = () => {
    return dispatch => {
        dispatch(authStart());
        dispatch(showSpinner());

        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (token && user) {
            let myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);

            let requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("/users/me", requestOptions)
            .then(response => response.json())
            .then(user => {
                localStorage.setItem('user', JSON.stringify(user));

                dispatch(hideSpinner());
                dispatch(authSuccess(user,token));
            })
            .catch(error => {
                localStorage.removeItem('user');
                localStorage.removeItem('token');

                dispatch(hideSpinner());
                dispatch(authFailed("Login Again !"));
            });

        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            
            dispatch(hideSpinner());
            dispatch(authFailed("SignIn Again !"));
        }
    }
}

export const logoutOnce = () => {
    return {
        type: actions.LOGOUT_ONCE
    }
}

export const logoutAll = () => {
    return {
        type: actions.LOGOUT_ALL,
        reload: true
    }
}

export const logoutFailed = (error) => {
    return {
        type: actions.LOGOUT_FAILED,
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
        myHeaders.append("Authorization", "Bearer " + token);

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
    localStorage.setItem('user', JSON.stringify(user));

    return {
        type: actions.UPDATE_USER,
        name,
        email
    }
}

export const deleteUser = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    return {
        type: actions.DELETE_USER
    }
}

export const getCount = (nature) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (nature) {
        user.countPosts += 1;
    } else {
        user.countPosts -= 1;
    }
    localStorage.setItem('user', JSON.stringify(user));

    return {
        type: actions.CHANGE_COUNT,
        nature
    }
}

export const updateLikedSuccess = (user) => {
    localStorage.setItem('user', JSON.stringify(user));

    return {
        type: actions.UPDATE_LIKED_SUCCESS,
        user
    }
}

export const updateLikedFailure = (error) => {
    return {
        type: actions.UPDATE_LIKED_FAILURE,
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

        fetch("/posts/" + id + "/likes?type=" + type, requestOptions)
            .then(response => {
                let options = {
                    method: 'GET',
                    headers : myHeaders,
                    redirect : 'follow'
                }

                return fetch('/users/me', options)
            })
            .then(res => res.json())
            .then(user => {
                dispatch(updateLikedSuccess(user));
            })
            .catch(error => {
                dispatch(updateLikedFailure(error));
            });
    }
}

export const updateAboutSuccess = (about) => {
    const user = JSON.parse(localStorage.getItem('user'));
    user.about = about;
    localStorage.setItem('user', JSON.stringify(user));

    return {
        type : actions.UPDATE_ABOUT_SUCCESS,
        about
    }
}

export const updateAboutFailure = (error) => {
    return {
        type : actions.UPDATE_ABOUT_FAILURE,
        error
    }
}

export const updateAbout = (about, token) => {
    return dispatch => {
        dispatch(showSpinner());

        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({
            "about": about
        });

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("/users/me/about", requestOptions)
        .then(response => {
            dispatch(hideSpinner());
            dispatch(updateAboutSuccess(about));
        })
        .catch(error => {
            dispatch(hideSpinner());
            dispatch(updateAboutFailure(error));
        });
    }
}
