import {AxiosError} from 'axios';
import {Action} from 'redux';
import MediaApi from '../../api/MediaApi';
import {PayloadAction, PromiseAction} from '../PromiseAction';

export enum MediaActions {
    QUERY_MIME_TYPES           = 'QUERY_MIME_TYPES',
    QUERY_MIME_TYPES_PENDING   = 'QUERY_MIME_TYPES_PENDING',
    QUERY_MIME_TYPES_FULFILLED = 'QUERY_MIME_TYPES_FULFILLED',
    QUERY_MIME_TYPES_REJECTED  = 'QUERY_MIME_TYPES_REJECTED'
}

export class QueryMimeTypesAction extends PromiseAction<string[]> {
    constructor() {
        super(MediaActions.QUERY_MIME_TYPES);
        this.payload = MediaApi.getSupportedMimeTypes();
    }
}

export interface QueryMimeTypesPendingAction extends Action {
    type: MediaActions.QUERY_MIME_TYPES_PENDING;
}

export interface QueryMimeTypesFulfilledAction extends PayloadAction<string[]> {
    type: MediaActions.QUERY_MIME_TYPES_FULFILLED;
}

export interface QueryMimeTypesRejectedAction extends PayloadAction<AxiosError> {
    type: MediaActions.QUERY_MIME_TYPES_REJECTED;
}
