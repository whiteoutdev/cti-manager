import {AxiosResponse} from 'axios';
import history from '../services/history';
import http from '../services/http';

abstract class AbstractApi {
    protected getData(path: string): Promise<any> {
        return http.get(path)
            .then(this.extractData.bind(this))
            .catch(err => this.catchUnauthorized(err));
    }

    protected postData(path: string, data: any): Promise<any> {
        return http.post(path, data)
            .then(this.extractData.bind(this))
            .catch(err => this.catchUnauthorized(err));
    }

    protected extractData(res: AxiosResponse): any {
        return res.data;
    }

    private catchUnauthorized(err: any): {} {
        const res = err.response;

        if (res.status === 401) {
            history.push('/login');
            return {};
        }

        throw err;
    }
}

export default AbstractApi;
