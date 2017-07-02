import DBConnectionService from '../store/DBConnectionService';
import MediaCollection from '../store/MediaCollection';
import TagCollection from '../store/TagCollection';
import UserCollection from '../store/UserCollection';
import logger from '../util/logger';

function rebuildDatabase(): Promise<any> {
    return DBConnectionService.getDB().then(db => {
        return db.listCollections({}).toArray().then(collections => {
            const dropPromises = collections.map(collection => {
                return db.collection(collection.name)
                    .drop()
                    .then(() => {
                        logger.info(`Dropped collection: ${collection.name}`);
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
}

rebuildDatabase();
