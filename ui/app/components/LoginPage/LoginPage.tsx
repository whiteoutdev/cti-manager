import * as React from 'react';

import {Component, Store} from 'reflux';
import appConfig from '../../config/app.config';
import history from '../../services/history';
import {UserActions, UserStore, UserStoreState} from '../../stores/UserStore';

import {FormEvent, ReactElement} from 'react';
import './LoginPage.scss';

// tslint:disable-next-line:no-empty-interface
interface LoginPageState extends UserStoreState {
}

export default class LoginPage extends Component<typeof Store, {}, LoginPageState> {
    private usernameInput: HTMLInputElement;
    private passwordInput: HTMLInputElement;

    constructor(props: any) {
        super(props);
        this.state = {
            user: null
        };
        this.store = UserStore;
    }

    public componentDidUpdate(): void {
        this.checkUser();
    }

    public checkUser(): void {
        if (this.state.user) {
            history.push('/');
        }
    }

    public login(e: FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        UserActions.login(this.usernameInput.value, this.passwordInput.value);
    }

    public render(): ReactElement<{}> {
        return (
            <div className='LoginPage'>
                <div className='container'>
                    <h1>{appConfig.appName}</h1>
                    <h2>Please log in</h2>
                    <form className='login-form' onSubmit={this.login.bind(this)}>
                        <div className='form-row'>
                            <label htmlFor='username-input'>Username:</label>
                            <input id='username-input'
                                   name='username'
                                   type='text'
                                   ref={input => this.usernameInput = input}/>
                        </div>
                        <div className='form-row'>
                            <label htmlFor='password-input'>Password:</label>
                            <input id='password-input'
                                   name='password'
                                   type='password'
                                   ref={input => this.passwordInput = input}/>
                        </div>
                        <button className='primary' formAction='submit'>Login</button>
                    </form>
                </div>
            </div>
        );
    }
}
