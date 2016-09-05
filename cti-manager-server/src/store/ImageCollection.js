import fs from 'fs';
import MongoDB from 'mongodb';
import del from 'del';
import lwip from 'lwip';
import _ from 'lodash';

import appConfig from '../config/app.config';
import logger from '../util/logger';
import DBConnectionService from './DBConnectionService';
import TagCollection from './TagCollection';
import HashService from '../util/HashService';
import MimeService from '../util/MimeService';
import FileType from '../model/gridfs/FileType';
import Image from '../model/gridfs/Image';
import Thumbnail from '../model/gridfs/Thumbnail';
import ExceptionWrapper from '../model/exception/ExceptionWrapper';
import CTIWarning from '../model/exception/CTIWarning';

const ObjectID           = MongoDB.ObjectID,
      GridFSBucket       = MongoDB.GridFSBucket,
      thumbnailSize      = appConfig.thumbnailSize,
      supportedMimeTypes = [
          'image/jpeg',
          'image/pjpeg',
          'image/png',
          'image/gif'
      ];

export default class ImageCollection {
    static init() {
        return DBConnectionService.getDB().then((db) => {
            return db.collection(appConfig.db.filesCollection).createIndex({'metadata.ta': 1});
        });
    }

    static addImages(files) {
        logger.info(`${files.length} images received for ingest`);

        const exceptionWrapper = new ExceptionWrapper();

        return DBConnectionService.getDB().then((db) => {
            const promises = files.filter((file) => {
                if (!~supportedMimeTypes.indexOf(file.mimetype)) {
                    const message = `MIME type ${file.mimetype} not supported`;
                    exceptionWrapper.addException(new CTIWarning(message));
                    logger.debug(message);
                    return false;
                }
                return true;
            }).map((file) => {
                return new Promise((resolve) => {
                    HashService.getHash(file.path).then((hash) => {
                        this.createThumbnail(db, file, hash).then((info) => {
                            const thumbnailID = info.thumbnailID,
                                  width       = info.width,
                                  height      = info.height,
                                  image       = new Image(file.mimetype, hash, thumbnailID, width, height);
                            this.storeFile(db, image, file.path).then(() => {
                                resolve();
                            });
                        }).catch((exception) => {
                            exceptionWrapper.addException(exception);
                            resolve();
                        });
                    });
                });
            });

            return Promise.all(promises).then(() => {
                logger.info(`${promises.length} images written to database`);
                return exceptionWrapper;
            });
        });
    }

    static createThumbnail(db, file, hash) {
        console.log(file);
        const fileType           = MimeService.getFileExtension(file.mimetype),
              thumbnailExtension = fileType === 'gif' ? 'jpg' : fileType,
              thumbnailName      = `${hash}-thumb.${thumbnailExtension}`,
              thumbnailModel     = new Thumbnail(thumbnailName, file.mimetype),
              thumbnailPath      = `${appConfig.tmpDir}/${thumbnailName}`;
        return new Promise((resolve, reject) => {
            lwip.open(file.path, fileType, (err, image) => {
                if (err) {
                    const message = `Failed to create thumbnail for file ${file.originalname}`;
                    logger.warn(message);
                    reject(new CTIWarning(message, err));
                }
                const originalWidth  = image.width(),
                      originalHeight = image.height(),
                      scale          = Math.min(thumbnailSize / originalWidth, thumbnailSize / originalHeight);
                image.batch()
                    .scale(scale)
                    .writeFile(thumbnailPath, (err) => {
                        if (err) {
                            const message = `Failed to create thumbnail for file ${file.originalname}`;
                            logger.warn(message);
                            reject(new CTIWarning(message, err));
                        }
                        this.storeFile(db, thumbnailModel, thumbnailPath).then((thumbnailID) => {
                            resolve({
                                thumbnailID,
                                width : originalWidth,
                                height: originalHeight
                            });
                        }).catch((err) => {
                            const message = `Failed to store thumbnail for file ${file.originalname}`;
                            logger.warn(message);
                            reject(new CTIWarning(message, err));
                        });
                    });
            });
        });
    }

    static storeFile(db, file, path) {
        const options = {
                  metadata: file.serialiseToDatabase()
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

    static downloadFile(fileIDHex, deserialise) {
        return DBConnectionService.getDB().then((db) => {
            const oid    = ObjectID.createFromHexString(fileIDHex),
                  bucket = new GridFSBucket(db);
            return bucket.find({_id: oid}).toArray().then((arr) => {
                if (arr.length) {
                    return {
                        doc   : deserialise(arr[0]).serialiseToApi(),
                        stream: bucket.openDownloadStream(oid)
                    };
                }
            });
        });
    }

    static downloadImage(objectIDHex) {
        return ImageCollection.downloadFile(objectIDHex, Image.fromDatabase);
    }

    static getFile(fileIDHex, deserialize) {
        return DBConnectionService.getDB().then((db) => {
            const oid    = ObjectID.createFromHexString(fileIDHex),
                  bucket = new GridFSBucket(db);
            return bucket.find({_id: oid}).toArray().then((arr) => {
                if (arr.length) {
                    return deserialize(arr[0]).serialiseToApi();
                }
            });
        });
    }

    static getImage(imageIDHex) {
        return ImageCollection.getFile(imageIDHex, Image.fromDatabase);
    }

    static getImages(tags, skip, limit) {
        return DBConnectionService.getDB().then((db) => {
            const bucket = new GridFSBucket(db);
            let baseQuery    = {'metadata.t': FileType.IMAGE.code},
                queryPromise = null;

            if (tags && tags.length) {
                const queryPromises = tags.map((tag) => {
                    return TagCollection.getDerivingTags(tag)
                        .then((derivingTags) => {
                            const tagIds = derivingTags.map(derivingTag => derivingTag.id);
                            tagIds.unshift(tag);
                            return {
                                $or: tagIds.map((tagId) => {
                                    return {'metadata.ta': tagId};
                                })
                            };
                        });
                });

                queryPromise = Promise.all(queryPromises)
                    .then((queries) => {
                        return _.extend(baseQuery, {$and: queries});
                    });
            } else {
                queryPromise = Promise.resolve(baseQuery);
            }

            return queryPromise.then((query) => {
                const cursor = bucket.find(query);
                return cursor.count()
                    .then((count) => {
                        return cursor.skip(skip || 0)
                            .limit(limit || 0)
                            .sort({uploadDate: -1})
                            .toArray()
                            .then((images) => {
                                return {
                                    images: images.map((image) => {
                                        return Image.fromDatabase(image).serialiseToApi();
                                    }),
                                    count
                                };
                            });
                    });
            });
        });
    }

    static getThumbnail(imageIDHex) {
        return this.getImage(imageIDHex).then((image) => {
            return this.getFile(image.thumbnailID.toHexString(), Thumbnail.fromDatabase);
        });
    }

    static downloadThumbnail(imageIDHex) {
        return this.getImage(imageIDHex).then((image) => {
            return ImageCollection.downloadFile(image.thumbnailID.toHexString(), Thumbnail.fromDatabase);
        });
    }

    static setTags(imageIDHex, tags) {
        return DBConnectionService.getDB().then((db) => {
            const oid = ObjectID.createFromHexString(imageIDHex);
            return db.collection(appConfig.db.filesCollection).update({
                _id: oid
            }, {
                $set: {
                    'metadata.ta': tags
                }
            }).then((data) => {
                const result = data.result;
                if (result.nModified) {
                    logger.debug(`Tags updated for ${result.nModified} image${result.nModified > 1 ? 's' : ''}`);
                    return this.getImage(imageIDHex);
                } else {
                    logger.warn(`No image found with ID ${imageIDHex}`);
                    return null;
                }
            });
        });
    }
}
