import 'babel-polyfill';

import logger from '../../src/util/logger';
import DBConnectionService  from '../../src/store/DBConnectionService';
import MediaCollection from '../../src/store/MediaCollection';
import TagCollection from '../../src/store/TagCollection';
import UserCollection from '../../src/store/UserCollection';

export default function () {
    return DBConnectionService.getDB().then((db) => {
        return db.listCollections({}).toArray().then((collections) => {
            const dropPromises = collections.map((collection) => {
                return db.collection(collection.name)
                    .drop()
                    .then(() => {
                        logger.info(`Dropped collection: ${collection.name}`)
                    });
            });

            return Promise.all(dropPromises).then(() => {
                const createPromises = [
                    MediaCollection.init(),
                    TagCollection.init(),
                    UserCollection.init()
                ];
                return Promise.all(createPromises).then(() => {
                    logger.info('Database rebuilt');
                    db.close();
                });
            });
        });
    });
};
