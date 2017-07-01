import React from 'react';

import appConfig from '../../config/app.config';
import UserApi from '../../api/UserApi';
import history from '../../services/history';

import './LoginPage.scss';

export default class LoginPage extends React.Component {
    login(e) {
        e.preventDefault();
        UserApi.login(this.usernameInput.value, this.passwordInput.value)
            .then(() => {
                history.push('/');
            });
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
