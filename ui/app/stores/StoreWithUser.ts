import {Store} from 'reflux';

import User from '../model/user/User';
import UserStore, {UserStoreState} from './UserStore';

export default class StoreWithUser<S> extends Store<S> {
    protected user: User;

    constructor() {
        super();
        this.listenTo(UserStore, this.onUpdateUser, this.onUpdateUser);
    }

    public onUpdateUser(userData: UserStoreState): void {
        if (userData && userData.user) {
            this.user = userData.user;
        }

        if (!this.user) {
            return;
        }

        this.onUserSet();
    }

    public onUserSet(): void {
        // TODO: What is this for???
    }
}
