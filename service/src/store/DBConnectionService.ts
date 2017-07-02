import {Db, MongoClient} from 'mongodb';

import appConfig from '../config/app.config';
import Hooks from '../config/Hooks';
import logger from '../util/logger';

const url = `mongodb://${appConfig.db.host}:${appConfig.db.port}/${appConfig.db.name}`;

class DBConnectionService {
    private db: Db;
    private connectionPromise: Promise<Db>;

    constructor() {
        this.connectionPromise = MongoClient.connect(url)
            .then(db => {
                logger.info(`Database connection to ${url} established`);
                this.db = db;
                return db;
            });

        Hooks.onExit(() => {
            logger.info('Closing database connection...');
            this.db && this.db.close();
        });
    }

    public getDB(): Promise<Db> {
        return this.connectionPromise;
    }
}

export default new DBConnectionService();
