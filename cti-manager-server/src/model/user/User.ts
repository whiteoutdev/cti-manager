import AbstractModel from '../AbstractModel';

import logger from '../../util/logger';

export default class User extends AbstractModel {
    public static fromDatabase(doc: any): User {
        logger.debug(doc._id, doc.p);
        return new User(doc._id, doc.p);
    }

    private id: string;
    private username: string;
    private password: string;

    constructor(username: string, password: string) {
        super();
        this.username = username;
        this.password = password;
    }

    public getId(): string {
        return this.id;
    }

    public getUsername(): string {
        return this.username;
    }

    public getPassword(): string {
        return this.password;
    }

    public serialiseToDatabase(): any {
        return {
            _id: this.username,
            p  : this.password
        };
    }

    public serialiseToApi(): any {
        return {
            username: this.username
        };
    }
}
