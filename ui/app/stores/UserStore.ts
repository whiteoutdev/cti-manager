import Reflux, {Store} from 'reflux';

import UserApi from '../api/UserApi';
import User from '../model/user/User';

const UserActions = Reflux.createActions([
    'updateCurrentUser',
    'login'
]);

interface UserStoreState {
    user: User;
}

class UserStore extends Store<UserStoreState> {
    constructor() {
        super();
        this.listenables = UserActions;
        this.onUpdateCurrentUser();
        this.state = {
            user: null
        };
    }

    public onUpdateCurrentUser(): Promise<void> {
        return UserApi.getCurrentUser()
            .then(user => {
                this.setState({user});
            });
    }

    public onLogin(username: string, password: string): Promise<void> {
        return UserApi.login(username, password)
            .then(this.onUpdateCurrentUser.bind(this));
    }
}

const store = new UserStore();
export {store as default, store as UserStore, UserActions, UserStoreState};
