import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {AppState} from '../../redux/AppState';
import {LoginAction} from '../../redux/user/UserActions';
import LoginPage, {LoginPageProps} from './LoginPage';

function mapStateToProps(state: AppState): Partial<LoginPageProps> {
    return {...state.user};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: LoginPageProps): Partial<LoginPageProps> {
    return {
        onLoginClick: (username: string, password: string) => {
            dispatch(new LoginAction(username, password));
        }
    };
}

export const LoginPageConnector = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginPage);
