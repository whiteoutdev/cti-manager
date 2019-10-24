import {AxiosError} from 'axios';
import appConfig from '../../config/app.config';
import Media from '../../model/media/Media';

export interface ImagesPageState {
    images: Media[];
    tags: string[];
    skip: number;
    limit: number;
    count: number;
    imagesQueryPending: boolean;
    imagesQueryError: AxiosError;
    tagsQuery: string;
}

export const DEFAULT_IMAGES_PAGE_STATE: ImagesPageState = {
    images            : [],
    tags              : [],
    skip              : 0,
    limit             : appConfig.images.defaultPageLimit,
    count             : 0,
    imagesQueryPending: false,
    imagesQueryError  : null,
    tagsQuery         : ''
};
