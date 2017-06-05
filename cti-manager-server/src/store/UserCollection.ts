import appConfig from '../config/app.config';
import User from '../model/user/User';
import CryptoService from '../util/CryptoService';
import logger from '../util/logger';
import DBConnectionService from './DBConnectionService';

export default class UserCollection {
    public static init(): Promise<any> {
        // TODO: Don't hardcode this
        return UserCollection.createUser({
            username: 'dev',
            password: 'password'
        });
    }

    public static createUser(userData: {username: string, password: string}): Promise<any> {
        const username = userData.username,
              password = CryptoService.hashPassword(userData.password),
              user     = new User(username, password);

        logger.info('User creation requested: ${username}');

        return DBConnectionService.getDB().then((db) => {
            return db.collection(appConfig.db.userCollection)
                .insertOne(user.serialiseToDatabase());
        });
    }

    public static findUser(username: string): Promise<User> {
        return DBConnectionService.getDB().then((db) => {
            return db.collection(appConfig.db.userCollection)
                .findOne({_id: username})
                .then((doc) => {
                    return doc ? User.fromDatabase(doc) : null;
                });
        });
    }
}
