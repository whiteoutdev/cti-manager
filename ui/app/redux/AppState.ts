import {DEFAULT_IMAGES_PAGE_STATE, ImagesPageState} from './imagesPage/ImagesPageState';
import {DEFAULT_MEDIA_STATE, MediaState} from './media/MediaState';
import {DEFAULT_TAG_STATE, TagState} from './tag/TagState';
import {DEFAULT_UPLOAD_STATE, UploadState} from './upload/UploadState';
import {DEFAULT_USER_STATE, UserState} from './user/UserState';

export interface AppState {
    user: UserState;
    tag: TagState;
    imagesPage: ImagesPageState;
    upload: UploadState;
    media: MediaState;
}

export const DEFAULT_APP_STATE: AppState = {
    user      : DEFAULT_USER_STATE,
    tag       : DEFAULT_TAG_STATE,
    imagesPage: DEFAULT_IMAGES_PAGE_STATE,
    upload    : DEFAULT_UPLOAD_STATE,
    media     : DEFAULT_MEDIA_STATE
};
