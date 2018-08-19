import {Action, combineReducers} from 'redux';
import {AppState} from './AppState';
import {imagesPageReducer} from './imagesPage/imagesPageReducer';
import {mediaReducer} from './media/mediaReducer';
import {tagReducer} from './tag/tagReducer';
import {uploadReducer} from './upload/uploadReducer';
import {userReducer} from './user/userReducer';

const reducers = {
    user      : userReducer,
    tag       : tagReducer,
    imagesPage: imagesPageReducer,
    upload    : uploadReducer,
    media     : mediaReducer
};

export const appReducer: (state: AppState, action: Action) => AppState = combineReducers(reducers);
