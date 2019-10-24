import {AxiosError} from 'axios';
import {Action} from 'redux';
import TagsApi from '../../api/TagsApi';
import Tag from '../../model/tag/Tag';
import {PayloadAction, PromiseAction} from '../PromiseAction';

export enum TagActionTypes {
    UPDATE_TAGS                = 'UPDATE_TAGS',
    UPDATE_TAGS_PENDING        = 'UPDATE_TAGS_PENDING',
    UPDATE_TAGS_FULFILLED      = 'UPDATE_TAGS_FULFILLED',
    UPDATE_TAGS_REJECTED       = 'UPDATE_TAGS_REJECTED',
    UPDATE_TAG_TYPES           = 'UPDATE_TAG_TYPES',
    UPDATE_TAG_TYPES_PENDING   = 'UPDATE_TAGS_TYPES_PENDING',
    UPDATE_TAG_TYPES_FULFILLED = 'UPDATE_TAG_TYPES_FULFILLED',
    UPDATE_TAG_TYPES_REJECTED  = 'UPDATE_TAG_TYPES_REJECTED'
}

export class UpdateTagsAction extends PromiseAction<Tag[]> {
    constructor() {
        super(TagActionTypes.UPDATE_TAGS);
        this.payload = TagsApi.getTags();
    }
}

export interface UpdateTagsPendingAction extends Action {
    type: TagActionTypes.UPDATE_TAGS_PENDING;
}

export interface UpdateTagsFulfilledAction extends PayloadAction<Tag[]> {
    type: TagActionTypes.UPDATE_TAGS_FULFILLED;
}

export interface UpdateTagsRejectedAction extends PayloadAction<AxiosError> {
    type: TagActionTypes.UPDATE_TAGS_REJECTED;
}

export class UpdateTagTypesAction extends PromiseAction<string[]> {
    constructor() {
        super(TagActionTypes.UPDATE_TAG_TYPES);
        this.payload = TagsApi.getTagTypes();
    }
}

export interface UpdateTagTypesPendingAction extends Action {
    type: TagActionTypes.UPDATE_TAG_TYPES_PENDING;
}

export interface UpdateTagTypesFulfilledAction extends PayloadAction<string[]> {
    type: TagActionTypes.UPDATE_TAG_TYPES_FULFILLED;
}

export interface UpdateTagTypesRejectedAction extends PayloadAction<AxiosError> {
    type: TagActionTypes.UPDATE_TAG_TYPES_REJECTED;
}
