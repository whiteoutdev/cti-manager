import appConfig from '../config/app.config';
import AbstractApi from './AbstractApi';
import http from '../services/http';
import User from '../model/user/User';

const apiPath = appConfig.api.path;

class UserApi extends AbstractApi {
    getCurrentUser(): Promise<User> {
        return this.getData(`${apiPath}/user`);
    }

    login(username: string, password: string): Promise<any> {
        return this.postData(`${apiPath}/login`, {username, password})
            .then(data => {
                const token = data.token;
                if (token) {
                    http.setConfig({
                        headers: {
                            Authorization: `JWT ${token}`
                        }
                    });
                }
                return data;
            });
    }
}

export default new UserApi();
