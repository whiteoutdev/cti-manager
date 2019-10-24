import {Action} from 'redux';
import {
    FetchImageFulfilledAction,
    FetchImageRejectedAction,
    ImagePageActions,
    UpdateImageTagsFulfilledAction,
    UpdateImageTagsRejectedAction
} from './ImagePageActions';
import {DEFAULT_IMAGE_PAGE_STATE, ImagePageState} from './ImagePageState';

export function imagePageReducer(state: ImagePageState = DEFAULT_IMAGE_PAGE_STATE, action: Action): ImagePageState {
    if (action.type.startsWith(ImagePageActions.FETCH_IMAGE)) {
        return fetchImageReducer(state, action);
    } else if (action.type.startsWith(ImagePageActions.UPDATE_IMAGE_TAGS)) {
        return updateImageTagsReducer(state, action);
    } else {
        return {...state};
    }
}

export function fetchImageReducer(state: ImagePageState, action: Action): ImagePageState {
    switch (action.type) {
        case ImagePageActions.FETCH_IMAGE_PENDING:
            return {
                ...state,
                image            : null,
                imageQueryPending: true,
                imageQueryError  : null
            };
        case ImagePageActions.FETCH_IMAGE_FULFILLED:
            return {
                ...state,
                image            : (action as FetchImageFulfilledAction).payload,
                imageQueryPending: false
            };
        case ImagePageActions.FETCH_IMAGE_REJECTED:
            return {
                ...state,
                imageQueryPending: false,
                imageQueryError  : (action as FetchImageRejectedAction).payload
            };
        default:
            return {...state};
    }
}

export function updateImageTagsReducer(state: ImagePageState, action: Action): ImagePageState {
    switch (action.type) {
        case ImagePageActions.UPDATE_IMAGE_TAGS_PENDING:
            return {
                ...state,
                imageTagsUpdatePending: true,
                imageTagsUpdateError  : null
            };
        case ImagePageActions.UPDATE_IMAGE_TAGS_FULFILLED:
            return {
                ...state,
                image                 : (action as UpdateImageTagsFulfilledAction).payload,
                imageTagsUpdatePending: false
            };
        case ImagePageActions.UPDATE_IMAGE_TAGS_REJECTED:
            return {
                ...state,
                imageTagsUpdatePending: false,
                imageTagsUpdateError  : (action as UpdateImageTagsRejectedAction).payload
            };
        default:
            return {...state};
    }
}
