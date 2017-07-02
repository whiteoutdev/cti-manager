import http from '../services/http';
import history from '../services/history';

export default class AbstractApi {
    getData(path) {
        return http.get(path)
            .catch(res => this.catchUnauthorized(res))
            .then(res => res.data);
    }

    postData(path, data) {
        return http.post(path, data)
            .catch(err => this.catchUnauthorized(err))
            .then(res => res.data);
    }

    catchUnauthorized(err) {
        const res = err.response;

        if (res.status === 401) {
            history.push('/login');
            return {};
        }

        throw err;
    }
}
