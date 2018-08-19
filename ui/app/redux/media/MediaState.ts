import {AxiosError} from 'axios';

export interface MediaState {
    mimeTypes: string[];
    queryMimeTypesPending: boolean;
    queryMimeTypesError: AxiosError;
}

export const DEFAULT_MEDIA_STATE: MediaState = {
    mimeTypes            : [],
    queryMimeTypesPending: false,
    queryMimeTypesError  : null
};
