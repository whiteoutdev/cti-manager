import * as DataStore from 'nedb';
import {resolve} from 'path';
import {DB_PATH} from '../../consts';
import {CollectionName} from './CollectionName';
import {ImageCollection} from './collections/ImageCollection';

export class DbManager {
    private static readonly imageCollectionPromise: Promise<ImageCollection> = DbManager.initImageCollection();

    public static async getImageCollection(): Promise<ImageCollection> {
        return await DbManager.imageCollectionPromise;
    }

    private static async initImageCollection(): Promise<ImageCollection> {
        const imageDb = await DbManager.initDatabase(CollectionName.IMAGES);
        return new ImageCollection(imageDb);
    }

    private static async initDatabase(name: CollectionName): Promise<DataStore> {
        const db = new DataStore({filename: resolve(DB_PATH, `${name}.db`)});
        await new Promise((resolve, reject) => {
            db.loadDatabase((err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
        return db;
    }
}
