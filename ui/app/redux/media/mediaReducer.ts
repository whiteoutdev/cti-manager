import {Action} from 'redux';
import {MediaActions, QueryMimeTypesFulfilledAction, QueryMimeTypesRejectedAction} from './MediaActions';
import {DEFAULT_MEDIA_STATE, MediaState} from './MediaState';

export function mediaReducer(state: MediaState = DEFAULT_MEDIA_STATE, action: Action): MediaState {
    if (action.type.startsWith(MediaActions.QUERY_MIME_TYPES)) {
        return queryMimeTypesReducer(state, action);
    } else {
        return {...state};
    }
}

export function queryMimeTypesReducer(state: MediaState, action: Action): MediaState {
    switch (action.type) {
        case MediaActions.QUERY_MIME_TYPES_PENDING:
            return {
                ...state,
                queryMimeTypesPending: true,
                queryMimeTypesError  : null
            };
        case MediaActions.QUERY_MIME_TYPES_FULFILLED:
            return {
                ...state,
                queryMimeTypesPending: false,
                mimeTypes            : (action as QueryMimeTypesFulfilledAction).payload
            };
        case MediaActions.QUERY_MIME_TYPES_REJECTED:
            return {
                ...state,
                queryMimeTypesPending: false,
                queryMimeTypesError  : (action as QueryMimeTypesRejectedAction).payload
            };
        default:
            return {...state};
    }
}
