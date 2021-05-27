import * as actions from '../Actions/actions';

const initialState = {
    user: null,
    token: null,
    error: null,
    redirectPath: null,
    spinner : false
};

const authStart = (state, action) => {
    const prevState = { ...state };
    prevState.user = null;
    prevState.token = null;
    prevState.error = null;
    prevState.redirectPath = null;

    return prevState;
}

const authSuccess = (state, action) => {
    const prevState = { ...state };
    prevState.token = action.token;
    prevState.user = action.user;
    prevState.redirectPath = '/';

    return prevState;
}

const authFailure = (state, action) => {
    const prevState = { ...state };
    prevState.error = action.error;

    return prevState;
}

const redirected = (state, action) => {
    const prevState = { ...state };
    prevState.redirectPath = null;

    return prevState;
}

const logoutOnce = (state, action) => {
    const prevState = { ...state };
    prevState.user = null;
    prevState.token = null;
    prevState.error = null;
    prevState.redirectPath = '/';

    return prevState;
}

const logoutAll = (state, action) => {
    const prevState = { ...state };
    prevState.user = null;
    prevState.token = null;
    prevState.error = null;
    prevState.redirectPath = '/';

    return prevState;
}

const logoutFailed = (state, action) => {
    const prevState = { ...state };
    prevState.error = action.error;
    prevState.redirectPath = null;

    return prevState;
}

const updateUser = (state, action) => {
    const prevState = { ...state };
    const prevUser = { ...prevState.user };
    prevUser.name = action.name;
    prevUser.email = action.email;

    prevState.user = prevUser;

    return prevState;
}

const deleteUser = (state, action) => {
    const prevState = { ...state };
    prevState.user = null;
    prevState.token = null;
    prevState.error = null;
    prevState.redirectPath = null

    return prevState;
}

const changeCount = (state, action) => {
    const prevState = { ...state };
    const prevUser = { ...prevState.user };

    if (action.nature) {
        prevUser.countPosts += 1;
    } else {
        prevUser.countPosts -= 1;
    }
    prevState.user = prevUser;

    return prevState;
}

const updateLikedSuccess = (state, action) => {
    const prevState = { ...state };
    prevState.user = action.user;

    return prevState;
}

const updateLikedFailure = (state, action) => {
    const prevState = { ...state };
    prevState.error = action.error;

    return prevState;
}

const updateAboutSuccess = (state, action) => {
    const prevState = { ...state };
    const prevUser = {...prevState.user};
    prevUser.about = action.about;
    prevState.user = prevUser;

    return prevState;
}

const updateAboutFailure = (state, action) => {
    const prevState = { ...state };
    prevState.error = action.error;

    return prevState;
}

const showSpinner = (state, action) => {
    const prevState = { ...state };
    prevState.spinner = true;

    return prevState;
}

const hideSpinner = (state, action) => {
    const prevState = { ...state };
    prevState.spinner = false;

    return prevState;
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.AUTH_START: return authStart(state, action);
        case actions.AUTH_SUCCESS: return authSuccess(state, action);
        case actions.AUTH_FAILED: return authFailure(state, action);
        case actions.REDIRECTED: return redirected(state, action);
        case actions.LOGOUT_ONCE: return logoutOnce(state, action);
        case actions.LOGOUT_ALL: return logoutAll(state, action);
        case actions.LOGOUT_FAILED: return logoutFailed(state, action);
        case actions.UPDATE_USER: return updateUser(state, action);
        case actions.DELETE_USER: return deleteUser(state, action);
        case actions.CHANGE_COUNT: return changeCount(state, action);
        case actions.UPDATE_LIKED_SUCCESS: return updateLikedSuccess(state, action);
        case actions.UPDATE_LIKED_FAILURE: return updateLikedFailure(state, action);
        case actions.UPDATE_ABOUT_SUCCESS : return updateAboutSuccess(state, action);
        case actions.UPDATE_LIKED_FAILURE : return updateAboutFailure(state, action);
        case actions.SHOW_SPINNER : return showSpinner(state, action);
        case actions.HIDE_SPINNER : return hideSpinner(state, action);

        default: return state;
    }
}

export default reducer;