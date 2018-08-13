import {Action, combineReducers} from 'redux';
import {AppState} from './AppState';
import {imagesPageReducer} from './imagesPage/imagesPageReducer';
import {tagReducer} from './tag/tagReducer';
import {userReducer} from './user/userReducer';

const reducers = {
    user      : userReducer,
    tag       : tagReducer,
    imagesPage: imagesPageReducer
};

export const appReducer: (state: AppState, action: Action) => AppState = combineReducers(reducers);
