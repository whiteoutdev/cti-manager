import 'babel-polyfill';

import logger from '../../src/util/logger';
import DBConnectionService  from '../../src/store/DBConnectionService';
import ImageCollection from '../../src/store/ImageCollection';
import TagCollection from '../../src/store/TagCollection';

export default function() {
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
                    ImageCollection.init(),
                    TagCollection.init()
                ];
                return Promise.all(createPromises).then(() => {
                    logger.info('Database rebuilt');
                    db.close();
                });
            });
        });
    });
};
