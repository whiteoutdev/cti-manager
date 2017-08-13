import {Store} from 'reflux';

import UserStore, {UserStoreState} from './UserStore';
import User from '../model/user/User';

export default class StoreWithUser<S> extends Store<S> {
    protected user: User;

    constructor() {
        super();
        this.listenTo(UserStore, this.onUpdateUser, this.onUpdateUser);
    }

    onUpdateUser(userData: UserStoreState) {
        if (userData && userData.user) {
            this.user = userData.user;
        }

        if (!this.user) {
            return;
        }

        this.onUserSet();
    }

    onUserSet() {
    }
}
