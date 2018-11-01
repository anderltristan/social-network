import { SET_CURRENT_USER } from '../actions/types';
import isEmpty from '../validation/isEmpty';

const initialState = {
    isAuthenticated: false,
    user: {}
};

export default function (state=initialState, action) {
    switch (action.type) {
        default:
            return state;
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };    
    }
};