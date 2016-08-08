import yargs from 'yargs';

import packageJson from '../../package.json';
import logger from '../util/logger';

const argv = yargs.argv,
      dev  = !!argv.dev;

logger.info(`CTI Manager version ${packageJson.version}`);
if (dev) {
    logger.info('dev mode enabled');
}

export default {
    dev,
    version: packageJson.version,
    api: {
        port: 3333
    },
    db: {
        host: 'localhost',
        port: 27017,
        name: dev ? 'cti-dev' : 'cti',
        filesCollection: 'fs.files',
        tagsCollection: 'tags'
    },
    tmpDir: 'tmp',
    thumbnailSize: 180
};
