import {Cursor} from 'nedb';

export class PromiseCursor<T> {
    public constructor(private cursor: Cursor<T>) {

    }

    public sort(query: any): this {
        this.cursor = this.cursor.sort(query);
        return this;
    }

    public skip(n: number): this {
        this.cursor = this.cursor.skip(n);
        return this;
    }

    public limit(n: number): this {
        this.cursor = this.cursor.limit(n);
        return this;
    }

    public projection(query: any): this {
        this.cursor = this.cursor.projection(query);
        return this;
    }

    public async exec(): Promise<T[]> {
        return await new Promise((resolve, reject) => {
            this.cursor.exec((err, docs) => {
                if (err) {
                    return reject(err);
                }
                resolve(docs);
            });
        });
    }
}
