import AbstractModel from '../AbstractModel';

import logger from '../../util/logger';

export default class User extends AbstractModel {
    constructor(username, password) {
        super();
        this.username = username;
        this.password = password;
    }

    serialiseToDatabase() {
        return {
            _id: this.username,
            p  : this.password
        };
    }

    serialiseToApi() {
        return {
            username: this.username
        };
    }

    static fromDatabase(doc) {
        logger.debug(doc._id, doc.p);
        return new User(doc._id, doc.p);
    }
}
