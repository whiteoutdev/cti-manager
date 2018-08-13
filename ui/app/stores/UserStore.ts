import {createActions, Store} from 'reflux';

import UserApi from '../api/UserApi';
import User from '../model/user/User';

export const UserActions = createActions([
    'updateCurrentUser',
    'propagateNewUser',
    'login'
]);

export interface UserStoreState {
    user: User;
}

export class UserStore extends Store {
    constructor() {
        super();
        this.listenables = UserActions;
        this.state = {
            user: null
        };
        this.onUpdateCurrentUser();
    }

    public onUpdateCurrentUser(): Promise<void> {
        return UserApi.getCurrentUser()
            .then(user => {
                UserActions.propagateNewUser(user);
            });
    }

    public onLogin(username: string, password: string): Promise<void> {
        return UserApi.login(username, password)
            .then(this.onUpdateCurrentUser.bind(this));
    }

    public onPropagateNewUser(user: User): void {
        this.setState({user});
    }
}

export const userStore = new UserStore();
