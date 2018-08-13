import {Action} from 'redux';
import {
    TagActionTypes,
    UpdateTagsFulfilledAction,
    UpdateTagsRejectedAction,
    UpdateTagTypesFulfilledAction,
    UpdateTagTypesRejectedAction
} from './TagActions';
import {DEFAULT_TAG_STATE, TagState} from './TagState';

export function tagReducer(state: TagState = DEFAULT_TAG_STATE, action: Action): TagState {
    switch (action.type) {
        case TagActionTypes.UPDATE_TAGS_PENDING:
            return {
                ...state,
                tagsUpdatePending: true,
                tagsUpdateError  : null
            };
        case TagActionTypes.UPDATE_TAGS_FULFILLED:
            return {
                ...state,
                tags             : (action as UpdateTagsFulfilledAction).payload,
                tagsUpdatePending: false
            };
        case TagActionTypes.UPDATE_TAGS_REJECTED:
            return {
                ...state,
                tagsUpdatePending: false,
                tagsUpdateError  : (action as UpdateTagsRejectedAction).payload
            };
        case TagActionTypes.UPDATE_TAG_TYPES_PENDING:
            return {
                ...state,
                tagTypesUpdatePending: true,
                tagTypesUpdateError  : null
            };
        case TagActionTypes.UPDATE_TAG_TYPES_FULFILLED:
            return {
                ...state,
                tagTypes             : (action as UpdateTagTypesFulfilledAction).payload,
                tagTypesUpdatePending: false
            };
        case TagActionTypes.UPDATE_TAG_TYPES_REJECTED:
            return {
                ...state,
                tagTypesUpdatePending: false,
                tagTypesUpdateError  : (action as UpdateTagTypesRejectedAction).payload
            };
        default:
            return {...state};
    }
}
