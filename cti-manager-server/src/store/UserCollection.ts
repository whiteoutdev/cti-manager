import appConfig from '../config/app.config';
import DBConnectionService from './DBConnectionService';
import User from '../model/user/User';
import logger from '../util/logger';
import CryptoService from '../util/CryptoService';

export default class UserCollection {
    public static init(): Promise<any> {
        // TODO: Don't hardcode this
        return UserCollection.createUser({
            username: 'dev',
            password: 'password'
        });
    }

    static createUser(userData: {username: string, password: string}) {
        const username = userData.username,
              password = CryptoService.hashPassword(userData.password),
              user     = new User(username, password);

        logger.info('User creation requested: ${username}');

        return DBConnectionService.getDB().then((db) => {
            return db.collection(appConfig.db.userCollection)
                .insertOne(user.serialiseToDatabase());
        });
    }

    static findUser(username: string) {
        return DBConnectionService.getDB().then((db) => {
            return db.collection(appConfig.db.userCollection)
                .findOne({_id: username})
                .then((doc) => {
                    return doc ? User.fromDatabase(doc) : null;
                });
        });
    }
}

