import React from 'react';
import Reflux from 'reflux';

import appConfig from '../../config/app.config';
import history from '../../services/history';
import {UserStore, UserActions} from '../../stores/UserStore';

import './LoginPage.scss';

export default class LoginPage extends Reflux.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.store = UserStore;
    }

    componentDidMount() {
        this.checkUser();
    }

    componentDidUpdate() {
        this.checkUser();
    }

    checkUser() {
        if (this.state.user) {
            history.push('/');
        }
    }

    login(e) {
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
                        <button className="primary" action="submit">Login</button>
                    </form>
                </div>
            </div>
        );
    }
}
