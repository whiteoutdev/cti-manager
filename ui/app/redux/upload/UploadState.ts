import {AxiosError} from 'axios';

export interface UploadState {
    uploadPending: boolean;
    uploadPendingFileCount: number;
    uploadError: AxiosError;
}

export const DEFAULT_UPLOAD_STATE: UploadState = {
    uploadPending         : false,
    uploadPendingFileCount: 0,
    uploadError           : null
};
