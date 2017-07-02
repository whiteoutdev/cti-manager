import Reflux from 'reflux';

import UserApi from '../api/UserApi';

const UserActions = Reflux.createActions([
    'updateCurrentUser',
    'login'
]);

class UserStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = UserActions;
        this.onUpdateCurrentUser();
        this.state = {};
    }

    onUpdateCurrentUser() {
        UserApi.getCurrentUser()
            .then(user => {
                this.setState({user});
            });
    }

    onLogin(username, password) {
        UserApi.login(username, password)
            .then(this.onUpdateCurrentUser.bind(this));
    }
}

const store = new UserStore();
export {store as default, store as UserStore, UserActions};
