import * as actions from '../Actions/actions';

const initialState = {
    user : null,
    userErr : null,
    posts : [],
    postErr : null
}

const fetchPostsSuccess = (state,action) => {
    const prevState = {...state};
    prevState.posts = prevState.posts.concat(action.post);
    prevState.postErr = null;

    return prevState;
}

const fetchPostsFail = (state,action) => {
    const prevState = {...state};
    prevState.posts = null;
    prevState.postErr = "Cannot fetch posts !";

    return prevState;
}

const fetchProfileSuccess = (state,action) => {
    const prevState = {...state};
    prevState.user = action.user;
    prevState.userErr = null;

    return prevState;
}

const fetchProfileFail = (state,action) => {
    const prevState = {...state};
    prevState.user = null;
    prevState.userErr = "Cannot fetch profile !";

    return prevState;
}

const clearOtherProfile = (state,action) => {
    const prevState = {
        ...state,
        user : null,
        userErr : null,
        posts : [],
        postErr : null
    }

    return prevState;
}

const updateLikesSuccess = (state,action) => {
    const prevState = {...state};
    const prevPosts = [...prevState.posts];

    prevPosts.forEach(post => {
        if (post._id == action.id) {
            if (action.manner === 1) {
                post.likes += 1;
                return;

            } else {
                post.likes -= 1;
                return;
            }
        }
    })

    prevState.posts = prevPosts;
    return prevState;
}

const reducer = (state = initialState,action) => {
    switch (action.type) {
        case actions.FETCH_OTHER_PROFILE_SUCCESS : return fetchProfileSuccess(state,action);
        case actions.FETCH_OTHER_PROFILE_FAIL : return fetchProfileFail(state,action);
        case actions.FETCH_OTHER_POSTS_SUCCESS : return fetchPostsSuccess(state,action);
        case actions.FETCH_OTHER_POSTS_FAIL : return fetchPostsFail(state,action);
        case actions.CLEAR_OTHER_PROFILE : return clearOtherProfile(state,action);
        case actions.UPDATE_LIKES_SUCCESS_OTHER : return updateLikesSuccess(state,action);

        default : return state;
    }
}

export default reducer;