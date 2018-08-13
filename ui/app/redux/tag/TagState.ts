import {AxiosError} from 'axios';
import Tag from '../../model/tag/Tag';

export interface TagState {
    tags: Tag[];
    tagsUpdatePending: boolean;
    tagsUpdateError: AxiosError;
    tagTypes: string[];
    tagTypesUpdatePending: boolean;
    tagTypesUpdateError: AxiosError;
}

export const DEFAULT_TAG_STATE: TagState = {
    tags                 : [],
    tagsUpdatePending    : false,
    tagsUpdateError      : null,
    tagTypes             : [],
    tagTypesUpdatePending: false,
    tagTypesUpdateError  : null
};
