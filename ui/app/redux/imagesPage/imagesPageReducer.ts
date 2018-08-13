import {Action} from 'redux';
import {FetchImagesFulfilledAction, FetchImagesRejectedAction, ImagesPageActionTypes} from './ImagesPageActions';
import {DEFAULT_IMAGES_PAGE_STATE, ImagesPageState} from './ImagesPageState';

export function imagesPageReducer(state: ImagesPageState = DEFAULT_IMAGES_PAGE_STATE, action: Action): ImagesPageState {
    if (action.type.startsWith(ImagesPageActionTypes.FETCH_IMAGES)) {
        return fetchImagesReducer(state, action);
    } else {
        return {...state};
    }
}

export function fetchImagesReducer(state: ImagesPageState, action: Action): ImagesPageState {
    switch (action.type) {
        case ImagesPageActionTypes.FETCH_IMAGES_PENDING:
            return {
                ...state,
                imagesQueryPending: true,
                imagesQueryError  : null
            };
        case ImagesPageActionTypes.FETCH_IMAGES_FULFILLED:
            const mediaResult = (action as FetchImagesFulfilledAction).payload;
            return {
                ...state,
                images: mediaResult.media,
                skip  : mediaResult.skip,
                limit : mediaResult.limit,
                count : mediaResult.count
            };
        case ImagesPageActionTypes.FETCH_IMAGES_REJECTED:
            return {
                ...state,
                imagesQueryPending: false,
                imagesQueryError  : (action as FetchImagesRejectedAction).payload
            };
        default:
            return {...state};
    }
}
