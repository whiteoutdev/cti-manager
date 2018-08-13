import {Action} from 'redux';
import {LoginFulfilledAction, LoginRejectedAction, UserActionTypes} from './UserActions';
import {DEFAULT_USER_STATE, UserState} from './UserState';

export function userReducer(state: UserState = DEFAULT_USER_STATE, action: Action): UserState {
    switch (action.type) {
        case UserActionTypes.LOGIN_PENDING:
            return {...state, loginPending: true, loginFailed: false, loginError: null};
        case UserActionTypes.LOGIN_FULFILLED:
            const user = (action as LoginFulfilledAction).payload;
            return {...state, loginPending: false, user};
        case UserActionTypes.LOGIN_REJECTED:
            const err = (action as LoginRejectedAction).payload;
            return {...state, loginPending: false, loginFailed: true, loginError: err};
        default:
            return {...state};
    }
}
