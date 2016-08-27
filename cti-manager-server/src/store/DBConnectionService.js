import MongoDB from 'mongodb';

import appConfig from '../config/app.config';

const MongoClient = MongoDB.MongoClient,
      url         = `mongodb://${appConfig.db.host}:${appConfig.db.port}/${appConfig.db.name}`;

class DBConnectionService {
    constructor() {
        this.connectionPromise = MongoClient.connect(url);
    }

    getDB() {
        return this.connectionPromise;
    }
}

export default new DBConnectionService();
