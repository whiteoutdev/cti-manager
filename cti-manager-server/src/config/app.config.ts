import * as _ from 'lodash';
import * as yargs from 'yargs';

const packageJson = require('../../package.json'),
      overrides   = require('../../appConfig.json');

const argv = yargs.argv,
      dev  = !!argv.dev;

const appConfig = {
    dev,
    version       : packageJson.version,
    api           : {
        port: 3333
    },
    db            : {
        host           : 'localhost',
        port           : 27017,
        name           : dev ? 'cti-dev' : 'cti',
        filesCollection: 'fs.files',
        tagsCollection : 'tags',
        userCollection : 'users',
        admin          : {
            username: 'admin',
            password: 'admin'
        }
    },
    secretsFile   : 'secrets.json',
    tmpDir        : 'tmp',
    thumbnailSize : 180,
    authCookieName: `cti-${packageJson.version}`
};

_.merge(appConfig, overrides);

export default appConfig;
