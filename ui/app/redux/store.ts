import {applyMiddleware, createStore} from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import {appReducer} from './appReducer';

export const store = createStore(
    appReducer,
    applyMiddleware(promiseMiddleware())
);
