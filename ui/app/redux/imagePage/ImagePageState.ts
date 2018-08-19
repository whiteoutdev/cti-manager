import {AxiosError} from 'axios';
import Media from '../../model/media/Media';

export interface ImagePageState {
    image: Media;
    imageQueryPending: boolean;
    imageQueryError: AxiosError;
    imageTagsUpdatePending: boolean;
    imageTagsUpdateError: AxiosError;
}

export const DEFAULT_IMAGE_PAGE_STATE: ImagePageState = {
    image                 : null,
    imageQueryPending     : false,
    imageQueryError       : null,
    imageTagsUpdatePending: false,
    imageTagsUpdateError  : null
};
