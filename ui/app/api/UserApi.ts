import appConfig from '../config/app.config';
import User from '../model/user/User';
import http from '../services/http';
import AbstractApi from './AbstractApi';

const apiPath = appConfig.api.path;

class UserApi extends AbstractApi {
    public getCurrentUser(): Promise<User> {
        return this.getData(`${apiPath}/user`);
    }

    public login(username: string, password: string): Promise<any> {
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
