import * as del from 'del';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as jimp from 'jimp';
import * as _ from 'lodash';
import {Db, GridFSBucket, ObjectID} from 'mongodb';

import appConfig from '../config/app.config';
import CTIError from '../model/exception/CTIError';
import CTIWarning from '../model/exception/CTIWarning';
import ExceptionWrapper from '../model/exception/ExceptionWrapper';
import AbstractFile from '../model/gridfs/AbstractFile';
import FileStream from '../model/gridfs/FileStream';
import FileType from '../model/gridfs/FileType';
import Image from '../model/gridfs/Image';
import Media from '../model/gridfs/Media';
import MediaList from '../model/gridfs/MediaList';
import Thumbnail from '../model/gridfs/Thumbnail';
import Video from '../model/gridfs/Video';
import CryptoService from '../util/CryptoService';
import logger from '../util/logger';
import MimeService from '../util/MimeService';
import DBConnectionService from './DBConnectionService';
import TagCollection from './TagCollection';

const thumbnailSize = appConfig.thumbnailSize,
    imageMimeTypes = MimeService.getSupportedImageTypes(),
    videoMimeTypes = MimeService.getSupportedVideoTypes(),
    supportedMimeTypes = MimeService.getSupportedMimeTypes();

interface ThumbnailData {
    thumbnailID: string;
    width: number;
    height: number;
}

export default class MediaCollection {
    public static init(): Promise<any> {
        return DBConnectionService.getDB()
            .then(db => {
                return db.collection(appConfig.db.filesCollection).createIndex({'metadata.ta': 1});
            });
    }

    public static addMedia(files: Express.Multer.File[]): Promise<ExceptionWrapper> {
        logger.info(`${files.length} files received for ingest`);

        const exceptionWrapper = new ExceptionWrapper();

        return DBConnectionService.getDB().then(db => {
            const promises = files.filter(file => {
                if (!~supportedMimeTypes.indexOf(file.mimetype)) {
                    const message = `MIME type ${file.mimetype} not supported`;
                    exceptionWrapper.addException(new CTIWarning(message));
                    logger.warn(message);
                    return false;
                }
                return true;
            }).map(file => {
                const isVideo = !!~videoMimeTypes.indexOf(file.mimetype);

                return new Promise(resolve => {
                    CryptoService.getHash(file.path)
                        .then(hash => {
                            return MediaCollection.createThumbnail(db, file, hash)
                                .then(thumbnailData => {
                                    const thumbnailID = thumbnailData.thumbnailID,
                                        width = thumbnailData.width,
                                        height = thumbnailData.height,
                                        media = isVideo
                                            ? new Video(file.mimetype, hash, thumbnailID, width, height)
                                            : new Image(file.mimetype, hash, thumbnailID, width, height);

                                    this.storeFile(db, media, file.path).then(() => resolve());
                                })
                                .catch(exception => {
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

    public static downloadMedia(objectIDHex: string): Promise<FileStream<Media>> {
        return MediaCollection.downloadFile(objectIDHex, Media.fromDatabase);
    }

    public static getMedia(mediaIDHex: string): Promise<any> {
        return MediaCollection.getFile(mediaIDHex, Media.fromDatabase);
    }

    public static findMedia(tags: string[], skip: number, limit: number): Promise<MediaList> {
        return DBConnectionService.getDB().then(db => {
            const bucket = new GridFSBucket(db);
            const baseQuery = {
                $or: [
                    {'metadata.t': FileType.IMAGE.getCode()},
                    {'metadata.t': FileType.VIDEO.getCode()}
                ]
            };
            let queryPromise = null;

            if (tags && tags.length) {
                const queryPromises = tags.map(tag => {
                    return TagCollection.getDerivingTags(tag)
                        .then(derivingTags => {
                            const tagIds = derivingTags.map(derivingTag => derivingTag.id);
                            tagIds.unshift(tag);
                            return {
                                $or: tagIds.map(tagId => {
                                    return {'metadata.ta': tagId};
                                })
                            };
                        });
                });

                queryPromise = Promise.all(queryPromises)
                    .then(queries => {
                        return _.extend(baseQuery, {$and: queries});
                    });
            } else {
                queryPromise = Promise.resolve(baseQuery);
            }

            return queryPromise.then(query => {
                const cursor = bucket.find(query);
                return cursor.count(false)
                    .then((count: number) => {
                        return cursor.skip(skip || 0)
                            .limit(limit || 0)
                            .sort({uploadDate: -1})
                            .toArray()
                            .then(mediaList => {
                                return {
                                    media: mediaList.map(media => {
                                        return Media.fromDatabase(media).serialiseToApi();
                                    }),
                                    count
                                };
                            });
                    });
            });
        });
    }

    public static getThumbnail(mediaIDHex: string): Promise<any> {
        return this.getMedia(mediaIDHex)
            .then(media => {
                return this.getFile(media.thumbnailID, Thumbnail.fromDatabase);
            });
    }

    public static downloadThumbnail(mediaIDHex: string): Promise<FileStream<Thumbnail>> {
        return this.getMedia(mediaIDHex)
            .then(media => {
                return MediaCollection.downloadFile(media.thumbnailID, Thumbnail.fromDatabase);
            });
    }

    public static setTags(mediaIDHex: string, tags: string[]): Promise<any> {
        return DBConnectionService.getDB().then(db => {
            const oid = ObjectID.createFromHexString(mediaIDHex);
            return db.collection(appConfig.db.filesCollection)
                .update({
                    _id: oid
                }, {
                    $set: {
                        'metadata.ta': tags
                    }
                })
                .then(data => {
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

    private static createImageThumbnail(db: Db, file: Express.Multer.File, hash: string): Promise<ThumbnailData> {
        const fileType = MimeService.getFileExtension(file.mimetype),
            thumbnailExtension = fileType === 'gif' ? 'jpg' : fileType,
            thumbnailName = `${hash}-thumb.${thumbnailExtension}`,
            thumbnailModel = new Thumbnail(thumbnailName, file.mimetype),
            thumbnailPath = `${appConfig.tmpDir}/${thumbnailName}`;

        return new Promise((resolve, reject) => {
            jimp.read(file.path, (readErr, image) => {
                if (readErr) {
                    const message = `Failed to create thumbnail for file ${file.originalname}`;
                    logger.warn(message);
                    reject(new CTIWarning(message, readErr));
                }

                const originalWidth = image.bitmap.width,
                    originalHeight = image.bitmap.height,
                    scale = Math.min(thumbnailSize / originalWidth, thumbnailSize / originalHeight);

                image.scale(scale)
                    .write(thumbnailPath, writeErr => {
                        if (writeErr) {
                            const message = `Failed to create thumbnail for file ${file.originalname}`;
                            logger.warn(message);
                            reject(new CTIWarning(message, writeErr));
                        }

                        this.storeFile(db, thumbnailModel, thumbnailPath)
                            .then(thumbnailID => {
                                resolve({
                                    thumbnailID,
                                    width: originalWidth,
                                    height: originalHeight
                                });
                            })
                            .catch(err2 => {
                                const message = `Failed to store thumbnail for file ${file.originalname}`;
                                logger.warn(message);
                                reject(new CTIWarning(message, err2));
                            });
                    });
            });
        });
    }

    private static createVideoThumbnail(db: Db, file: Express.Multer.File, hash: string): Promise<ThumbnailData> {
        return new Promise((resolve, reject) => {
            let thumbnailName: string = null;
            ffmpeg(file.path)
                .on('filenames', (filenames: string[]) => {
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
                        fieldname: '',
                        encoding: 'utf-8',
                        size: 0,
                        destination: '',
                        buffer: null as Buffer,
                        originalname: file.originalname,
                        mimetype: 'image/png',
                        filename: thumbnailName,
                        path: `${appConfig.tmpDir}/${thumbnailName}`
                    };
                    resolve(this.createImageThumbnail(db, newFileData, hash));
                })
                .on('error', (err: Error) => {
                    const message = `Failed to create thumbnail for file ${file.originalname}`;
                    logger.warn(message);
                    reject(new CTIWarning(message, err));
                })
                .screenshots({
                    count: 1,
                    timemarks: ['1']
                }, appConfig.tmpDir);
        });
    }

    private static createThumbnail(db: Db, file: Express.Multer.File, hash: string): Promise<ThumbnailData> {
        const mimeType = file.mimetype;

        if (~imageMimeTypes.indexOf(mimeType)) {
            return this.createImageThumbnail(db, file, hash);
        } else if (~videoMimeTypes.indexOf(mimeType)) {
            return this.createVideoThumbnail(db, file, hash);
        }

        const error = new CTIError(
            `Failed to create thumbnail for file ${file.originalname} - unsupported MIME type ${mimeType}`);
        return Promise.reject(error);
    }

    private static storeFile(db: Db, file: AbstractFile, path: string): Promise<string> {
        const options = {
                metadata: file.serialiseToDatabase()
            },
            bucket = new GridFSBucket(db);

        return new Promise((resolve, reject) => {
            const thumbnailID = new ObjectID();
            const uploadStream = bucket.openUploadStreamWithId(thumbnailID, file.getName(), options);
            fs.createReadStream(path)
                .pipe(uploadStream)
                .on('error', err => {
                    reject(err);
                })
                .on('finish', () => {
                    logger.debug(`${path} stored to database as ${file.getName()}`);
                    del([path]).then(() => {
                        logger.debug(`Temporary file deleted: ${path}`);
                        resolve(thumbnailID);
                    });
                });
        });
    }

    private static downloadFile<F extends AbstractFile>(fileIDHex: string,
                                                        deserialise: (doc: any) => F): Promise<FileStream<F>> {
        return DBConnectionService.getDB().then(db => {
            const oid = ObjectID.createFromHexString(fileIDHex),
                bucket = new GridFSBucket(db);
            return bucket.find({_id: oid})
                .toArray()
                .then(arr => {
                    if (arr.length) {
                        return {
                            doc: deserialise(arr[0]).serialiseToApi(),
                            stream: bucket.openDownloadStream(oid)
                        };
                    }
                });
        });
    }

    private static getFile(fileIDHex: string, deserialize: (doc: any) => any): Promise<any> {
        return DBConnectionService.getDB().then(db => {
            const oid = ObjectID.createFromHexString(fileIDHex),
                bucket = new GridFSBucket(db);
            return bucket.find({_id: oid})
                .toArray()
                .then(arr => {
                    if (arr.length) {
                        return deserialize(arr[0]).serialiseToApi();
                    }
                });
        });
    }
}
