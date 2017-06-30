import axios from 'axios';
import _ from 'lodash';

class Http {
    constructor() {
        this.defaultConfig = {
            withCredentials: true
        };
    }

    get(url, config, merge) {
        return axios.get(url, this.getConfig(config, merge));
    }

    post(url, data, config, merge) {
        return axios.post(url, data, this.getConfig(config, merge));
    }

    setConfig(config) {
        if (config) {
            _.merge(this.defaultConfig, config);
        }
    }

    getConfig(config, merge) {
        if (config && merge !== false) {
            return _.merge({}, this.defaultConfig, config);
        }

        return JSON.parse(JSON.stringify(this.defaultConfig));
    }
}

export default new Http();
