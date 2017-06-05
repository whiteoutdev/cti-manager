import * as yargs from 'yargs';

const packageJson = require('../../package.json');

const argv = yargs.argv,
      dev  = !!argv.dev;

export default {
    dev,
    version      : packageJson.version,
    api          : {
        port: 3333
    },
    db           : {
        host           : 'localhost',
        port           : 27017,
        name           : dev ? 'cti-dev' : 'cti',
        filesCollection: 'fs.files',
        tagsCollection : 'tags',
        userCollection : 'users'
    },
    tmpDir       : 'tmp',
    thumbnailSize: 180
};
