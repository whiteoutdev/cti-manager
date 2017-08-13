import * as React from 'react';

import appConfig from '../../config/app.config';
import history from '../../services/history';
import {UserStore, UserActions, UserStoreState} from '../../stores/UserStore';
import {Component} from 'reflux';

import './LoginPage.scss';
import {FormEvent} from 'react';

interface LoginPageState extends UserStoreState {
}

export default class LoginPage extends Component<{}, LoginPageState> {
    private usernameInput: HTMLInputElement;
    private passwordInput: HTMLInputElement;

    constructor(props: any) {
        super(props);
        this.state = {
            user: null
        };
        this.store = UserStore;
    }

    componentDidUpdate() {
        this.checkUser();
    }

    checkUser() {
        if (this.state.user) {
            history.push('/');
        }
    }

    login(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        UserActions.login(this.usernameInput.value, this.passwordInput.value);
    }

    render() {
        return (
            <div className="LoginPage">
                <div className="container">
                    <h1>{appConfig.appName}</h1>
                    <h2>Please log in</h2>
                    <form className="login-form" onSubmit={this.login.bind(this)}>
                        <div className="form-row">
                            <label htmlFor="username-input">Username:</label>
                            <input id="username-input"
                                   name="username"
                                   type="text"
                                   ref={input => this.usernameInput = input}/>
                        </div>
                        <div className="form-row">
                            <label htmlFor="password-input">Password:</label>
                            <input id="password-input"
                                   name="password"
                                   type="password"
                                   ref={input => this.passwordInput = input}/>
                        </div>
                        <button className="primary" formAction="submit">Login</button>
                    </form>
                </div>
            </div>
        );
    }
}
