import yargs from 'yargs';

import logger from '../util/logger';

const argv = yargs.argv,
      dev  = !!argv.dev;

if (dev) {
    logger.info('dev mode enabled');
}

export default {
    dev,
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
