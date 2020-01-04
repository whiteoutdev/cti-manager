import * as DataStore from 'nedb';
import {PromiseCursor} from './PromiseCursor';

export class PromiseDb {
    public constructor(private readonly db: DataStore) {
    }

    public async insertOne<T>(newDoc: T): Promise<T> {
        return await new Promise((resolve, reject) => {
            this.db.insert(newDoc, (err, inserted) => this.dbCallback(resolve, reject, err, inserted));
        });
    }

    public async insert<T>(...newDocs: T[]): Promise<T[]> {
        return await new Promise((resolve, reject) => {
            this.db.insert(newDocs, (err, inserted) => this.dbCallback(resolve, reject, err, inserted));
        });
    }

    public async findOne<T>(query: any): Promise<T> {
        return await new Promise((resolve, reject) => {
            this.db.findOne<T>(query, (err, doc) => this.dbCallback(resolve, reject, err, doc));
        });
    }

    public find<T>(query: any): PromiseCursor<T> {
        return new PromiseCursor<T>(this.db.find(query));
    }

    private dbCallback<T>(resolve: (value: T) => void, reject: (reason: any) => void, err: Error, value: T): void {
        if (err) {
            return reject(err);
        }
        resolve(value);
    }
}
