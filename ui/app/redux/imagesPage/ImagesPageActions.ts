import {AxiosError} from 'axios';
import {Action} from 'redux';
import MediaApi, {MediaResult} from '../../api/MediaApi';
import {PayloadAction, PromiseAction} from '../PromiseAction';

export enum ImagesPageActionTypes {
    FETCH_IMAGES           = 'FETCH_IMAGES',
    FETCH_IMAGES_PENDING   = 'FETCH_IMAGES_PENDING',
    FETCH_IMAGES_FULFILLED = 'FETCH_IMAGES_FULFILLED',
    FETCH_IMAGES_REJECTED  = 'FETCH_IMAGES_REJECTED'
}

export class FetchImagesAction extends PromiseAction<MediaResult> {
    constructor(tags: string[], skip: number, limit: number) {
        super(ImagesPageActionTypes.FETCH_IMAGES);
        this.payload = MediaApi.findMedia(tags, skip, limit);
    }
}

export interface FetchImagesPendingAction extends Action {
    type: ImagesPageActionTypes.FETCH_IMAGES_PENDING;
}

export interface FetchImagesFulfilledAction extends PayloadAction<MediaResult> {
    type: ImagesPageActionTypes.FETCH_IMAGES_FULFILLED;
}

export interface FetchImagesRejectedAction extends PayloadAction<AxiosError> {
    type: ImagesPageActionTypes.FETCH_IMAGES_REJECTED;
}
