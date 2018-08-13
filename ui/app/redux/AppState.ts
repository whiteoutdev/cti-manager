import {DEFAULT_IMAGES_PAGE_STATE, ImagesPageState} from './imagesPage/ImagesPageState';
import {DEFAULT_TAG_STATE, TagState} from './tag/TagState';
import {DEFAULT_USER_STATE, UserState} from './user/UserState';

export interface AppState {
    user: UserState;
    tag: TagState;
    imagesPage: ImagesPageState;
}

export const DEFAULT_APP_STATE: AppState = {
    user      : DEFAULT_USER_STATE,
    tag       : DEFAULT_TAG_STATE,
    imagesPage: DEFAULT_IMAGES_PAGE_STATE
};
