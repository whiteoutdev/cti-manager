import {Store} from 'reflux';
import User from '../model/user/User';
import {UserActions} from './UserStore';

export class StoreWithUser<S extends object> extends Store {
    public state: Readonly<S>;

    protected user: User;

    constructor() {
        super();
        this.listenTo(UserActions.propagateNewUser, this.onUpdateUser);
    }

    public setState(state: S): void {
        return super.setState(state);
    }

    public onUpdateUser(user: User): void {
        if (user) {
            this.user = user;
        } else {
            return;
        }

        this.onUserSet();
    }

    public onUserSet(): void {
        // TODO: What is this for???
    }
}
