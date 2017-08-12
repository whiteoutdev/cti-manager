import axios, {AxiosPromise, AxiosResponse} from 'axios';
import * as _ from 'lodash';
import utils from './utils';

class Http {
    private defaultConfig: any = {
        withCredentials: true
    };

    public get (url: string, config?: any, merge = true): AxiosPromise {
        return axios.get(url, this.getConfig(config, merge));
    }

    public post(url: string, data: any, config?: any, merge = true): AxiosPromise {
        return axios.post(url, data, this.getConfig(config, merge));
    }

    public setConfig(config: any): void {
        if (config) {
            _.merge(this.defaultConfig, config);
        }
    }

    private getConfig(config: any, merge: boolean) {
        if (config && merge !== false) {
            return _.merge({}, this.defaultConfig, config);
        }

        return utils.clone(this.defaultConfig);
    }
}

export default new Http();
