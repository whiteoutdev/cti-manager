import {AxiosError} from 'axios';
import User from '../../model/user/User';

export interface UserState {
    loginPending: boolean;
    loginFailed: boolean;
    loginError: AxiosError;
    user: User;
}

export const DEFAULT_USER_STATE: UserState = {
    loginPending: false,
    loginFailed : false,
    loginError  : null,
    user        : null
};
