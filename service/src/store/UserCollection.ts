import {ObjectID} from 'bson';
import appConfig from '../config/app.config';
import User from '../model/user/User';
import CryptoService from '../util/CryptoService';
import logger from '../util/logger';
import DBConnectionService from './DBConnectionService';

export default class UserCollection {
    public static init(): Promise<any> {
        return UserCollection.createUser({
            username: appConfig.db.admin.username,
            password: appConfig.db.admin.password,
            admin   : true
        });
    }

    public static createUser(userData: {username: string, password: string, admin: boolean}): Promise<any> {
        const password = CryptoService.hashPassword(userData.password),
              user     = new User(userData.username, password, userData.admin);

        logger.info(`User creation requested: ${user.getUsername()}`);

        return DBConnectionService.getDB().then(db => {
            return db.collection(appConfig.db.userCollection)
                .insertOne(user.serialiseToDatabase());
        });
    }

    public static findById(id: string): Promise<User> {
        return DBConnectionService.getDB().then(db => {
            return db.collection(appConfig.db.userCollection)
                .findOne({_id: ObjectID.createFromHexString(id)})
                .then(doc => {
                    return doc ? User.fromDatabase(doc) : null;
                });
        });
    }

    public static findByUsername(username: string): Promise<User> {
        return DBConnectionService.getDB().then(db => {
            return db.collection(appConfig.db.userCollection)
                .findOne({u: username})
                .then(doc => {
                    return doc ? User.fromDatabase(doc) : null;
                });
        });
    }
}
