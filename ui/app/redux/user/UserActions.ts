import {AxiosError} from 'axios';
import {Action} from 'redux';
import UserApi from '../../api/UserApi';
import User from '../../model/user/User';
import {PayloadAction, PromiseAction} from '../PromiseAction';

export enum UserActionTypes {
    LOGIN           = 'LOGIN',
    LOGIN_PENDING   = 'LOGIN_PENDING',
    LOGIN_FULFILLED = 'LOGIN_FULFILLED',
    LOGIN_REJECTED  = 'LOGIN_REJECTED'
}

export class LoginAction extends PromiseAction<User> {
    constructor(public username: string, public password: string) {
        super(UserActionTypes.LOGIN);
        this.payload = UserApi.login(username, password)
            .then(() => UserApi.getCurrentUser());
    }
}

export interface LoginPendingAction extends Action {
    type: UserActionTypes.LOGIN_PENDING;
}

export interface LoginFulfilledAction extends PayloadAction<User> {
    type: UserActionTypes.LOGIN_FULFILLED;
}

export interface LoginRejectedAction extends PayloadAction<AxiosError> {
    type: UserActionTypes.LOGIN_REJECTED;
}
