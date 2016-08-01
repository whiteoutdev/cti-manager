import co from 'co';
import MongoDB from 'mongodb';

import appConfig from '../config/app.config';

const MongoClient = MongoDB.MongoClient,
      url         = `mongodb://${appConfig.db.host}:${appConfig.db.port}/${appConfig.db.name}`;

export default class DBConnectionService {
    static getDB() {
        return co(function*() {
            return yield MongoClient.connect(url);
        });
    }
}
