import Reflux from 'reflux';

import UserActions from '../actions/UserActions';
import UserApi from '../api/UserApi';

export default Reflux.createStore({
    init() {
        this.listenTo(UserActions.updateCurrentUser, this.onUpdateCurrentUser);
        this.listenTo(UserActions.login, this.onLogin);
        this.user = null;
        this.onUpdateCurrentUser();
    },

    onUpdateCurrentUser() {
        UserApi.getCurrentUser()
            .then(user => {
                this.user = user;
                this.trigger(this.user);
            });
    },

    onLogin(username, password) {
        UserApi.login(username, password)
            .then(this.onUpdateCurrentUser.bind(this));
    },

    getInitialState() {
        return this.user;
    }
});
