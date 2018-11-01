import {
    GET_PROFILE,
    PROFILE_LOADING,
    CLEAR_CURRENT_PROFILE,
    GET_PROFILE_LIST
} from '../actions/types';

const initialState = {
    profile: null,
    profileList: null,
    loading: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        default:
            return state;
        case PROFILE_LOADING:
            return {
                ...state,
                loading: true
            };
        case GET_PROFILE:
            return {
                ...state,
                profile: action.payload,
                loading: false
            };
        case GET_PROFILE_LIST:
            return {
                ...state,
                profiles: action.payload,
                loading: false
            }    
        case CLEAR_CURRENT_PROFILE:
            return {
                ...state,
                profile: null
            }    
    }
}