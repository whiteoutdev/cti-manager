import 'babel-polyfill';

import logger from '../util/logger';
import DBConnectionService  from '../store/DBConnectionService';

DBConnectionService.getDB().then((db) => {
    db.listCollections({}).toArray().then((collections) => {
        const dropPromises = collections.map((collection) => {
            return db.collection(collection.name)
                .drop()
                .then(() => {
                    logger.info(`Dropped collection: ${collection.name}`)
                });
        });

        Promise.all(dropPromises).then(() => {
            logger.info('Database rebuilt');
            db.close();
        });
    });
});
