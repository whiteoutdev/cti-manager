export default {
    appName: 'CTI Manager',
    api: {
        host: 'localhost',
        port: 3333,
        get path() {
            return `http://${this.host}:${this.port}`;
        }
    },
    images: {
        defaultPageLimit: 40
    }
}
