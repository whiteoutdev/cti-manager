import {noop} from 'lodash';
import * as React from 'react';
import {Component, FormEvent, ReactElement} from 'react';
import appConfig from '../../config/app.config';
import {DEFAULT_USER_STATE, UserState} from '../../redux/user/UserState';
import history from '../../services/history';
import './LoginPage.scss';

export interface LoginPageProps extends UserState {
    onLoginClick: (username: string, password: string) => void;
}

export default class LoginPage extends Component<LoginPageProps> {
    public static defaultProps: LoginPageProps = {
        ...DEFAULT_USER_STATE,
        onLoginClick: noop
    };

    private usernameInput: HTMLInputElement;
    private passwordInput: HTMLInputElement;

    public componentDidUpdate(): void {
        this.checkUser();
    }

    public checkUser(): void {
        if (this.props.user) {
            history.push('/');
        }
    }

    public login(e: FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        this.props.onLoginClick(this.usernameInput.value, this.passwordInput.value);
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
                        <button className='primary' formAction='submit' disabled={this.props.loginPending}>Login</button>
                    </form>
                </div>
            </div>
        );
    }
}
