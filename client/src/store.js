import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import indexReducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

const initialState = {};
const middleware = [thunk];

const store = createStore(
    indexReducer,
    initialState,
    composeWithDevTools(
        applyMiddleware(...middleware)
    )
);

export default store;