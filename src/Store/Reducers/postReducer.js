import * as actions from '../Actions/actions';

const initialState = {
    posts : [],
    error : null
}

const fetchPosts = (state,action) => {
    const prevState = {...state};
    prevState.posts = prevState.posts.concat(action.posts);
    prevState.error = null;

    return prevState;
}

const updateError = (state,action) => {
    const prevState = {...state};
    prevState.error = action.error;
    prevState.posts = [];

    return prevState;
}

const deletePost = (state,action) => {
    const prevState = {...state};
    prevState.posts = action.posts;

    return prevState;
}

const updatePosts = (state,action) => {
    const prevState = {...state};
    prevState.posts = prevState.posts.concat(action.post);
    prevState.error = null;

    return prevState;
}

const updateLikes = (state,action) => {
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

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.FETCHED_POSTS : return fetchPosts(state, action);
        case actions.ERROR_POSTS : return updateError(state, action);
        case actions.DELETE_POST : return deletePost(state, action);
        case actions.UPDATE_POSTS : return updatePosts(state, action);
        case actions.UPDATE_LIKES_SUCCESS : return updateLikes(state,action);

        default : return state;
    }
}

export default reducer;