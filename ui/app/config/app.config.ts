const packageJson = require('../../package.json');

export default {
    appName: presetData.preset === 'sfw' ? 'App' : 'CTI Manager',
    version: packageJson.version,
    api    : {
        host: 'localhost',
        port: 3333,
        get path(): string {
            return `http://${this.host}:${this.port}/api`;
        }
    },
    images : {
        defaultPageLimit: 40
    }
};
