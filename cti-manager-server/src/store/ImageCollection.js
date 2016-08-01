import fs from 'fs';
import MongoDB from 'mongodb';
import del from 'del';

import appConfig from '../config/app.config';
import logger from '../util/logger';
import DBConnectionService from './DBConnectionService';
import HashService from '../util/HashService';
import Image from '../model/Image';

const ObjectID = MongoDB.ObjectID;
const GridFSBucket = MongoDB.GridFSBucket;

export default class ImageCollection {
    static addImages(files) {
        logger.info(`${files.length} images received for ingest`);
        return DBConnectionService.getDB().then((db) => {
            const promises = files.map((file) => {
                return new Promise((resolve, reject) => {
                    HashService.getHash(file.path).then((hash) => {
                        const image = new Image(file, hash);
                        this.createGridStore(db, file, image).then(() => {
                            resolve();
                        });
                    });
                });
            });

            Promise.all(promises).then(() => {
                logger.info(`${promises.length} images written to database`);
                db.close();
            });
        });
    }

    static createGridStore(db, file, image) {
        const options = {
                  metadata: image
              },
              bucket  = new GridFSBucket(db);

        return new Promise((resolve, reject) => {
            fs.createReadStream(file.path)
                .pipe(bucket.openUploadStream(image.name, options))
                .on('error', (error) => {
                    reject(error);
                })
                .on('finish', () => {
                    logger.debug(`${file.path} stored to database as ${image.name}`);
                    del([file.path]).then(() => {
                        logger.debug(`Temporary file deleted: ${file.path}`);
                        resolve();
                    });
                });
        });
    }

    static downloadImage(objectIDHex) {
        return DBConnectionService.getDB().then((db) => {
            const oid = ObjectID.createFromHexString(objectIDHex);
            const bucket = new GridFSBucket(db);
            return bucket.find({_id: oid}).toArray().then((arr) => {
                if (arr.length) {
                    const doc         = arr[0],
                          tmpLocation = `${appConfig.tmpDir}/${doc.metadata.name}`;
                    return new Promise((resolve, reject) => {
                        bucket.openDownloadStream(oid)
                            .pipe(fs.createWriteStream(tmpLocation))
                            .on('error', (err) => {
                                reject(err);
                            })
                            .on('finish', () => {
                                resolve({path: tmpLocation, fileData: doc});
                            });
                    });
                }
            });
        });
    }

    static findImages(tags, limit) {
        const query = {};
        if (tags && tags.length) {
            query['metadata.tags'] = {
                $all: tags
            }
        }
        return DBConnectionService.getDB().then((db) => {
            const pipeline = [
                {$match: query}
            ];
            if (limit) {
                pipeline.push({$sample: {size: limit}});
            }
            const cursor = db.collection('fs.files').aggregate(pipeline, {cursor: {batchSize: 1}});
            return cursor.toArray().then((documents) => {
                db.close();
                return documents;
            });
        });
    }
}
