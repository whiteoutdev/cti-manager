import {AxiosError} from 'axios';
import {Action} from 'redux';
import MediaApi from '../../api/MediaApi';
import {PayloadAction, PromiseAction} from '../PromiseAction';

export enum UploadActionTypes {
    UPLOAD_IMAGES           = 'UPLOAD_IMAGES',
    UPLOAD_IMAGES_PENDING   = 'UPLOAD_IMAGES_PENDING',
    UPLOAD_IMAGES_FULFILLED = 'UPLOAD_IMAGES_FULFILLED',
    UPLOAD_IMAGES_REJECTED  = 'UPLOAD_IMAGES_REJECTED'
}

export class UploadImagesAction extends PromiseAction<any> {
    public fileCount: number;

    constructor(files: FileList) {
        super(UploadActionTypes.UPLOAD_IMAGES);
        this.fileCount = files.length;
        this.payload = MediaApi.uploadFiles(files);
    }
}

export interface UploadImagesPendingAction extends Action {
    type: UploadActionTypes.UPLOAD_IMAGES_PENDING;
}

export interface UploadImagesFulfilledAction extends PayloadAction<any> {
    type: UploadActionTypes.UPLOAD_IMAGES_FULFILLED;
}

export interface UploadImagesRejectedAction extends PayloadAction<AxiosError> {
    type: UploadActionTypes.UPLOAD_IMAGES_REJECTED;
}
