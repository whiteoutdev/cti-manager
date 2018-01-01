import Reflux from 'reflux';

import UserStore from './UserStore';

export default class StoreWithUser extends Reflux.Store {
    constructor() {
        super();
        this.listenTo(UserStore, this.onUpdateUser, this.onUpdateUser);
    }

    onUpdateUser(userData) {
        if (userData && userData.user) {
            this.user = userData.user;
        }

        if (!this.user) {
            return;
        }

        this.onUserSet();
    }

    onUserSet() {}
}
