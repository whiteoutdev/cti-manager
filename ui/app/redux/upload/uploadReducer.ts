import {Action} from 'redux';
import {UploadActionTypes, UploadImagesAction, UploadImagesRejectedAction} from './UploadActions';
import {DEFAULT_UPLOAD_STATE, UploadState} from './UploadState';

export function uploadReducer(state: UploadState = DEFAULT_UPLOAD_STATE, action: Action): UploadState {
    if (action.type.startsWith(UploadActionTypes.UPLOAD_IMAGES)) {
        return uploadImagesReducer(state, action);
    } else {
        return {...state};
    }
}

export function uploadImagesReducer(state: UploadState, action: Action): UploadState {
    switch (action.type) {
        case UploadActionTypes.UPLOAD_IMAGES:
            return {
                ...state,
                uploadPendingFileCount: (action as UploadImagesAction).fileCount
            };
        case UploadActionTypes.UPLOAD_IMAGES_PENDING:
            return {
                ...state,
                uploadPending: true,
                uploadError  : null
            };
        case UploadActionTypes.UPLOAD_IMAGES_FULFILLED:
            return {
                ...state,
                uploadPending         : false,
                uploadPendingFileCount: 0,
                uploadError           : null
            };
        case UploadActionTypes.UPLOAD_IMAGES_REJECTED:
            return {
                ...state,
                uploadPending         : false,
                uploadPendingFileCount: 0,
                uploadError           : (action as UploadImagesRejectedAction).payload
            };
        default:
            return {...state};
    }
}
