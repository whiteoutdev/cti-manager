import * as yargs from 'yargs';
import * as _ from 'lodash';

const packageJson = require('../../package.json'),
      overrides   = require('../../appConfig.json');

const argv = yargs.argv,
      dev  = !!argv.dev;

const appConfig = {
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

console.log(appConfig);
console.log(overrides);

_.merge(appConfig, overrides);

console.log(appConfig);

export default appConfig;
