import {
    GET_POST,
    GET_POST_LIST,
    ADD_POST,
    DELETE_POST,
    GET_ERRORS,
    POST_LOADING,
    CLEAR_ERRORS
} from './types';
import axios from 'axios';

// Adding a new post
export const addPost = (postData) => dispatch => {
    dispatch(clearErrors());
    
    axios.post('/api/posts', postData).then((res) => {
        dispatch({
            type: ADD_POST,
            payload: res.data
        });
    }).catch((err) => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        });
    });
}

// Get list of posts
export const getPosts = () => dispatch => {
    dispatch(setPostLoading());

    axios.get('/api/posts').then((res) => {
        dispatch({
            type: GET_POST_LIST,
            payload: res.data
        });
    }).catch((err) => {
        dispatch({
            type: GET_POST_LIST,
            payload: null
        });
    });
}

// Get individual post
export const getPost = (id) => dispatch => {
    dispatch(setPostLoading());

    axios.get(`/api/posts/${id}`).then((res) => {
        dispatch({
            type: GET_POST,
            payload: res.data
        });
    }).catch((err) => {
        dispatch({
            type: GET_POST,
            payload: null
        });
    });
}

// Delete Post
export const deletePost = (id) => dispatch => {
    axios.delete(`/api/posts/${id}`).then((res) => {
        dispatch({
            type: DELETE_POST,
            payload: id
        });
    }).catch((err) => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        });
    });
}

// Adding like to post
export const addLike = (id) => dispatch => {
    axios.post(`/api/posts/like/${id}`, ).then((res) => {
        dispatch(getPosts());
    }).catch((err) => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        });
    });
}

// Adding a comment to a post
export const addComment = (postId, commentData) => dispatch => {
    dispatch(clearErrors());

    axios.post(`/api/posts/comment/${postId}`, commentData).then((res) => {
        dispatch({
            type: GET_POST,
            payload: res.data
        });
    }).catch((err) => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        });
    });
}

// Removing comment from post
export const removeComment = (postId, commentId) => dispatch => {
    axios.delete(`/api/posts/comment/${postId}/${commentId}`).then((res) => {
        dispatch({
            type: GET_POST,
            payload: res.data
        });
    }).catch((err) => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        });
    });
}

// Removing like from post
export const removeLike = (id) => dispatch => {
    axios.post(`/api/posts/unlike/${id}`, ).then((res) => {
        dispatch(getPosts());
    }).catch((err) => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        });
    });
}

// Set Loading State
export const setPostLoading = () => {
    return {
        type: POST_LOADING
    }
}


// Clear errors
export const clearErrors = () => {
    return {
        type: CLEAR_ERRORS
    }
}
