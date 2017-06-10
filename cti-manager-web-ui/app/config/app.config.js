import packageJson from '../../package.json';

export default {
    appName: 'CTI Manager',
    version: packageJson.version,
    api    : {
        host: 'localhost',
        port: 3333,
        get path() {
            return `http://${this.host}:${this.port}/api`;
        }
    },
    images : {
        defaultPageLimit: 40
    }
};
