import fs from 'fs';
import MongoDB from 'mongodb';
import del from 'del';
import lwip from 'lwip';
import _ from 'lodash';
import ffmpeg from 'fluent-ffmpeg';

import appConfig from '../config/app.config';
import logger from '../util/logger';
import DBConnectionService from './DBConnectionService';
import TagCollection from './TagCollection';
import HashService from '../util/HashService';
import MimeService from '../util/MimeService';
import FileType from '../model/gridfs/FileType';
import Media from '../model/gridfs/Media';
import Image from '../model/gridfs/Image';
import Video from '../model/gridfs/Video';
import Thumbnail from '../model/gridfs/Thumbnail';
import ExceptionWrapper from '../model/exception/ExceptionWrapper';
import CTIWarning from '../model/exception/CTIWarning';
import CTIError from '../model/exception/CTIError';

const ObjectID           = MongoDB.ObjectID,
      GridFSBucket       = MongoDB.GridFSBucket,
      thumbnailSize      = appConfig.thumbnailSize,
      imageMimeTypes     = MimeService.getSupportedImageTypes(),
      videoMimeTypes     = MimeService.getSupportedVideoTypes(),
      supportedMimeTypes = MimeService.getSupportedMimeTypes();

export default class MediaCollection {
    static init() {
        return DBConnectionService.getDB().then((db) => {
            return db.collection(appConfig.db.filesCollection).createIndex({'metadata.ta': 1});
        });
    }

    static addMedia(files) {
        logger.info(`${files.length} files received for ingest`);

        const exceptionWrapper = new ExceptionWrapper();

        return DBConnectionService.getDB().then((db) => {
            const promises = files.filter((file) => {
                if (!~supportedMimeTypes.indexOf(file.mimetype)) {
                    const message = `MIME type ${file.mimetype} not supported`;
                    exceptionWrapper.addException(new CTIWarning(message));
                    logger.warn(message);
                    return false;
                }
                return true;
            }).map((file) => {
                const isVideo = !!~videoMimeTypes.indexOf(file.mimetype);

                return new Promise((resolve) => {
                    HashService.getHash(file.path).then((hash) => {
                        MediaCollection.createThumbnail(db, file, hash).then((info) => {
                            const thumbnailID = info.thumbnailID,
                                  width       = info.width,
                                  height      = info.height,
                                  media       = isVideo
                                      ? new Video(file.mimetype, hash, thumbnailID, width, height)
                                      : new Image(file.mimetype, hash, thumbnailID, width, height);

                            this.storeFile(db, media, file.path).then(() => {
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
                logger.info(`${promises.length} files written to database`);
                return exceptionWrapper;
            });
        });
    }

    static createImageThumbnail(db, file, hash) {
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

    static createVideoThumbnail(db, file, hash) {
        return new Promise((resolve, reject) => {
            let thumbnailName = null;
            ffmpeg(file.path)
                .on('filenames', (filenames) => {
                    if (filenames.length) {
                        thumbnailName = filenames[0];
                    } else {
                        const message = `Failed to create thumbnail for file ${file.originalname}`;
                        logger.warn(message);
                        reject(new CTIWarning(message));
                    }
                })
                .on('end', () => {
                    const newFileData = {
                        originalname: file.originalname,
                        mimetype    : 'image/png',
                        filename    : thumbnailName,
                        path        : `${appConfig.tmpDir}/${thumbnailName}`
                    };
                    resolve(this.createImageThumbnail(db, newFileData, hash));
                })
                .on('error', (err) => {
                    const message = `Failed to create thumbnail for file ${file.originalname}`;
                    logger.warn(message);
                    reject(new CTIWarning(message, err));
                })
                .screenshots({
                    count    : 1,
                    timemarks: ['1']
                }, appConfig.tmpDir);
        });
    }

    static createThumbnail(db, file, hash) {
        const mimeType = file.mimetype;

        if (~imageMimeTypes.indexOf(mimeType)) {
            return this.createImageThumbnail(db, file, hash);
        } else if (~videoMimeTypes.indexOf(mimeType)) {
            return this.createVideoThumbnail(db, file, hash);
        }

        const error = new CTIError(`Failed to create thumbnail for file ${file.originalname} - unsupported MIME type ${mimeType}`);
        return Promise.reject(error);
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

    static downloadMedia(objectIDHex) {
        return MediaCollection.downloadFile(objectIDHex, Media.fromDatabase);
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

    static getMedia(mediaIDHex) {
        return MediaCollection.getFile(mediaIDHex, Media.fromDatabase);
    }

    static findMedia(tags, skip, limit) {
        return DBConnectionService.getDB().then((db) => {
            const bucket = new GridFSBucket(db);
            let baseQuery    = {
                    $or: [
                        {'metadata.t': FileType.IMAGE.code},
                        {'metadata.t': FileType.VIDEO.code}
                    ]
                },
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
                            .then((media) => {
                                return {
                                    media: media.map((media) => {
                                        return Media.fromDatabase(media).serialiseToApi();
                                    }),
                                    count
                                };
                            });
                    });
            });
        });
    }

    static getThumbnail(mediaIDHex) {
        return this.getMedia(mediaIDHex).then((media) => {
            return this.getFile(media.thumbnailID.toHexString(), Thumbnail.fromDatabase);
        });
    }

    static downloadThumbnail(mediaIDHex) {
        return this.getMedia(mediaIDHex).then((media) => {
            return MediaCollection.downloadFile(media.thumbnailID.toHexString(), Thumbnail.fromDatabase);
        });
    }

    static setTags(mediaIDHex, tags) {
        return DBConnectionService.getDB().then((db) => {
            const oid = ObjectID.createFromHexString(mediaIDHex);
            return db.collection(appConfig.db.filesCollection).update({
                _id: oid
            }, {
                $set: {
                    'metadata.ta': tags
                }
            }).then((data) => {
                const result = data.result;
                if (result.nModified) {
                    logger.debug(`Tags updated for ${result.nModified} file${result.nModified > 1 ? 's' : ''}`);
                    return this.getMedia(mediaIDHex);
                } else {
                    logger.warn(`No media found with ID ${mediaIDHex}`);
                    return null;
                }
            });
        });
    }
}
