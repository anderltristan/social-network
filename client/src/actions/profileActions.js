import {
    GET_PROFILE,
    PROFILE_LOADING,
    CLEAR_CURRENT_PROFILE,
    GET_ERRORS,
    SET_CURRENT_USER,
    GET_PROFILE_LIST
} from './types';
import axios from 'axios';

// Getting current profile
export const getCurrentProfile = () => (dispatch) => {
    dispatch(setProfileLoading());
    axios.get('/api/profile').then((response) => {
        dispatch({
            type: GET_PROFILE,
            payload: response.data
        });
    }).catch((err) => {
        dispatch({
            type: GET_PROFILE,
            payload: {}
        });
    });
}

// Getting all profiles
export const getProfiles = () => (dispatch) => {
    dispatch(setProfileLoading());
    axios.get('/api/profile/all').then((response) => {
        dispatch({
            type: GET_PROFILE_LIST,
            payload: response.data
        });
    }).catch((err) => {
        dispatch({
            type: GET_PROFILE_LIST,
            payload: {}
        });
    });
}

// Getting profile by handle
export const getProfileByHandle = (handle) => (dispatch) => {
    console.log("getting...");
    dispatch(setProfileLoading());
    axios.get(`/api/profile/handle/${handle}`).then((response) => {
        dispatch({
            type: GET_PROFILE,
            payload: response.data
        });
    }).catch((err) => {
        dispatch({
            type: GET_PROFILE,
            payload: null
        });
    });
}

// Create new profile
export const createNewProfile = (profileData, history) => dispatch => {
    axios.post('/api/profile', profileData)
      .then(res => history.push('/dashboard'))
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  };

// Profile is loading
export const setProfileLoading = () => {
    return {
        type: PROFILE_LOADING
    }
}

// Clearing profile
export const clearCurrentProfile = () => {
    return {
        type: CLEAR_CURRENT_PROFILE
    }
}

// Adding experience
export const addExperience = (experience, history) => dispatch => {
    axios.post('/api/profile/experience', experience).then((response) => {
        history.push("/dashboard");
    }).catch((err) => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        });
    });
}

// Adding education
export const addEducation = (education, history) => dispatch => {
    axios.post('/api/profile/education', education).then((response) => {
        history.push("/dashboard");
    }).catch((err) => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        });
    });
}

// Deleting experience
export const deleteExperience = (experienceId) => dispatch => {
    axios.delete(`/api/profile/experience/${experienceId}`).then((response) => {
        dispatch({
            type: GET_PROFILE,
            payload: response.data
        })
    }).catch((err) => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        });
    });
}

// Deleting education
export const deleteEducation = (educationId) => dispatch => {
    axios.delete(`/api/profile/education/${educationId}`).then((response) => {
        dispatch({
            type: GET_PROFILE,
            payload: response.data
        })
    }).catch((err) => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        });
    });
}

// Deleting account and profile
export const deleteAccount = () => dispatch => {
    if (window.confirm('Are you sure?')) {
        axios.delete('/api/profile').then((result) => {
            dispatch({
                type: SET_CURRENT_USER,
                payload: {}
            });
        }).catch((err) => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        });
    }
}