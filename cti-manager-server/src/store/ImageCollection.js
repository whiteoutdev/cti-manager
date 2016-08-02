import fs from 'fs';
import MongoDB from 'mongodb';
import del from 'del';
import lwip from 'lwip';

import appConfig from '../config/app.config';
import logger from '../util/logger';
import DBConnectionService from './DBConnectionService';
import HashService from '../util/HashService';
import FileType from '../model/gridfs/FileType';
import Image from '../model/gridfs/Image';
import Thumbnail from '../model/gridfs/Thumbnail';

const ObjectID      = MongoDB.ObjectID,
      GridFSBucket  = MongoDB.GridFSBucket,
      thumbnailSize = appConfig.thumbnailSize;

export default class ImageCollection {
    static addImages(files) {
        logger.info(`${files.length} images received for ingest`);
        return DBConnectionService.getDB().then((db) => {
            const promises = files.map((file) => {
                return new Promise((resolve, reject) => {
                    HashService.getHash(file.path).then((hash) => {
                        this.createThumbnail(db, file, hash).then((thumbnailID) => {
                            const image = new Image(file, hash, thumbnailID);
                            this.storeFile(db, image, file.path).then(() => {
                                resolve();
                            });
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

    static createThumbnail(db, file, hash) {
        const fileType       = file.originalname.match(/\.((?:\w|\d)+)$/)[1],
              thumbnailName  = `${hash}-thumb.${fileType}`,
              thumbnailModel = new Thumbnail(thumbnailName),
              thumbnailPath  = `${appConfig.tmpDir}/${thumbnailName}`;
        return new Promise((resolve, reject) => {
            lwip.open(file.path, fileType, (err, image) => {
                if (err) {
                    reject(err);
                }
                const scale = Math.min(thumbnailSize / image.width(), thumbnailSize / image.height());
                image.batch()
                    .scale(scale)
                    .writeFile(thumbnailPath, (err) => {
                        if (err) {
                            reject(err);
                        }
                        this.storeFile(db, thumbnailModel, thumbnailPath).then((thumbnailID) => {
                            resolve(thumbnailID);
                        });
                    });
            });
        });
    }

    static storeFile(db, file, path) {
        const options = {
                  metadata: file
              },
              bucket  = new GridFSBucket(db);

        return new Promise((resolve, reject) => {
            const uploadStream = bucket.openUploadStream(file.name, options);
            fs.createReadStream(path)
                .pipe(uploadStream)
                .on('error', (err) => {
                    reject(err);
                })
                .on('finish', () => {
                    logger.debug(`${path} stored to database as ${file.name}`);
                    del([path]).then(() => {
                        logger.debug(`Temporary file deleted: ${path}`);
                        resolve(uploadStream.id);
                    });
                });
        });
    }

    static downloadImage(objectIDHex) {
        return DBConnectionService.getDB().then((db) => {
            const oid    = ObjectID.createFromHexString(objectIDHex),
                  bucket = new GridFSBucket(db);
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

    static getImage(imageIDHex) {
        return DBConnectionService.getDB().then((db) => {
            const oid    = ObjectID.createFromHexString(imageIDHex),
                  bucket = new GridFSBucket(db);
            return bucket.find({_id: oid}).toArray().then((arr) => {
                if (arr.length) {
                    return arr[0];
                }
            });
        });
    }

    static getImages(skip, limit) {
        return DBConnectionService.getDB().then((db) => {
            const bucket = new GridFSBucket(db);
            return bucket.find({'metadata.fileType': FileType.IMAGE})
                .skip(skip || 0)
                .limit(limit || 0)
                .sort({uploadDate: -1})
                .toArray()
                .then((docs) => {
                    return docs;
                });
        });
    }

    static getThumbnail(imageIDHex) {
        return this.getImage(imageIDHex).then((image) => {
            return this.getImage(image.metadata.thumbnailID.toHexString());
        });
    }

    static downloadThumbnail(imageIDHex) {
        return this.getImage(imageIDHex).then((image) => {
            return this.downloadImage(image.metadata.thumbnailID.toHexString());
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
