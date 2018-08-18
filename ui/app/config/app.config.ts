import {getPresetData} from './PresetData';

const packageJson = require('../../package.json');

export const appConfig = {
    appName   : getPresetData().preset === 'sfw' ? 'App' : 'CTI Manager',
    version   : packageJson.version,
    api       : {
        host: 'localhost',
        port: 3333,
        get path(): string {
            return `http://${this.host}:${this.port}/api`;
        }
    },
    images    : {
        defaultPageLimit: 40
    },
    pagination: {
        maxPagesShown: 7
    }
};

export default appConfig;
