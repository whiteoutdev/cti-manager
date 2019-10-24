import {AxiosError} from 'axios';
import {Action} from 'redux';
import MediaApi from '../../api/MediaApi';
import Media from '../../model/media/Media';
import {PayloadAction, PromiseAction} from '../PromiseAction';

export enum ImagePageActions {
    FETCH_IMAGE                 = 'FETCH_IMAGE',
    FETCH_IMAGE_PENDING         = 'FETCH_IMAGE_PENDING',
    FETCH_IMAGE_FULFILLED       = 'FETCH_IMAGE_FULFILLED',
    FETCH_IMAGE_REJECTED        = 'FETCH_IMAGE_REJECTED',
    UPDATE_IMAGE_TAGS           = 'UPDATE_IMAGE_TAGS',
    UPDATE_IMAGE_TAGS_PENDING   = 'UPDATE_IMAGE_TAGS_PENDING',
    UPDATE_IMAGE_TAGS_FULFILLED = 'UPDATE_IMAGE_TAGS_FULFILLED',
    UPDATE_IMAGE_TAGS_REJECTED  = 'UPDATE_IMAGE_TAGS_REJECTED'
}

/***************
 * FETCH_IMAGE *
 ***************/

export class FetchImageAction extends PromiseAction<Media> {
    constructor(id: string) {
        super(ImagePageActions.FETCH_IMAGE);
        this.payload = MediaApi.getMedia(id);
    }
}

export interface FetchImagePendingAction extends Action {
    type: ImagePageActions.FETCH_IMAGE_PENDING;
}

export interface FetchImageFulfilledAction extends PayloadAction<Media> {
    type: ImagePageActions.FETCH_IMAGE_FULFILLED;
}

export interface FetchImageRejectedAction extends PayloadAction<AxiosError> {
    type: ImagePageActions.FETCH_IMAGE_REJECTED;
}

/*********************
 * UPDATE_IMAGE_TAGS *
 *********************/

export class UpdateImageTagsAction extends PromiseAction<Media> {
    constructor(id: string, tags: string[]) {
        super(ImagePageActions.UPDATE_IMAGE_TAGS);
        this.payload = MediaApi.setTags(id, tags);
    }
}

export interface UpdateImageTagsPendingAction extends Action {
    type: ImagePageActions.UPDATE_IMAGE_TAGS_PENDING;
}

export interface UpdateImageTagsFulfilledAction extends PayloadAction<Media> {
    type: ImagePageActions.UPDATE_IMAGE_TAGS_FULFILLED;
}

export interface UpdateImageTagsRejectedAction extends PayloadAction<AxiosError> {
    type: ImagePageActions.UPDATE_IMAGE_TAGS_REJECTED;
}
