'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _lwip = require('lwip');

var _lwip2 = _interopRequireDefault(_lwip);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fluentFfmpeg = require('fluent-ffmpeg');

var _fluentFfmpeg2 = _interopRequireDefault(_fluentFfmpeg);

var _app = require('../config/app.config');

var _app2 = _interopRequireDefault(_app);

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

var _DBConnectionService = require('./DBConnectionService');

var _DBConnectionService2 = _interopRequireDefault(_DBConnectionService);

var _TagCollection = require('./TagCollection');

var _TagCollection2 = _interopRequireDefault(_TagCollection);

var _CryptoService = require('../util/CryptoService');

var _CryptoService2 = _interopRequireDefault(_CryptoService);

var _MimeService = require('../util/MimeService');

var _MimeService2 = _interopRequireDefault(_MimeService);

var _FileType = require('../model/gridfs/FileType');

var _FileType2 = _interopRequireDefault(_FileType);

var _Media = require('../model/gridfs/Media');

var _Media2 = _interopRequireDefault(_Media);

var _Image = require('../model/gridfs/Image');

var _Image2 = _interopRequireDefault(_Image);

var _Video = require('../model/gridfs/Video');

var _Video2 = _interopRequireDefault(_Video);

var _Thumbnail = require('../model/gridfs/Thumbnail');

var _Thumbnail2 = _interopRequireDefault(_Thumbnail);

var _ExceptionWrapper = require('../model/exception/ExceptionWrapper');

var _ExceptionWrapper2 = _interopRequireDefault(_ExceptionWrapper);

var _CTIWarning = require('../model/exception/CTIWarning');

var _CTIWarning2 = _interopRequireDefault(_CTIWarning);

var _CTIError = require('../model/exception/CTIError');

var _CTIError2 = _interopRequireDefault(_CTIError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ObjectID = _mongodb2.default.ObjectID,
    GridFSBucket = _mongodb2.default.GridFSBucket,
    thumbnailSize = _app2.default.thumbnailSize,
    imageMimeTypes = _MimeService2.default.getSupportedImageTypes(),
    videoMimeTypes = _MimeService2.default.getSupportedVideoTypes(),
    supportedMimeTypes = _MimeService2.default.getSupportedMimeTypes();

var MediaCollection = function () {
    function MediaCollection() {
        _classCallCheck(this, MediaCollection);
    }

    _createClass(MediaCollection, null, [{
        key: 'init',
        value: function init() {
            return _DBConnectionService2.default.getDB().then(function (db) {
                return db.collection(_app2.default.db.filesCollection).createIndex({ 'metadata.ta': 1 });
            });
        }
    }, {
        key: 'addMedia',
        value: function addMedia(files) {
            var _this = this;

            _logger2.default.info(files.length + ' files received for ingest');

            var exceptionWrapper = new _ExceptionWrapper2.default();

            return _DBConnectionService2.default.getDB().then(function (db) {
                var promises = files.filter(function (file) {
                    if (!~supportedMimeTypes.indexOf(file.mimetype)) {
                        var message = 'MIME type ' + file.mimetype + ' not supported';
                        exceptionWrapper.addException(new _CTIWarning2.default(message));
                        _logger2.default.warn(message);
                        return false;
                    }
                    return true;
                }).map(function (file) {
                    var isVideo = !!~videoMimeTypes.indexOf(file.mimetype);

                    return new Promise(function (resolve) {
                        _CryptoService2.default.getHash(file.path).then(function (hash) {
                            MediaCollection.createThumbnail(db, file, hash).then(function (info) {
                                var thumbnailID = info.thumbnailID,
                                    width = info.width,
                                    height = info.height,
                                    media = isVideo ? new _Video2.default(file.mimetype, hash, thumbnailID, width, height) : new _Image2.default(file.mimetype, hash, thumbnailID, width, height);

                                _this.storeFile(db, media, file.path).then(function () {
                                    resolve();
                                });
                            }).catch(function (exception) {
                                exceptionWrapper.addException(exception);
                                resolve();
                            });
                        });
                    });
                });

                return Promise.all(promises).then(function () {
                    _logger2.default.info(promises.length + ' files written to database');
                    return exceptionWrapper;
                });
            });
        }
    }, {
        key: 'createImageThumbnail',
        value: function createImageThumbnail(db, file, hash) {
            var _this2 = this;

            var fileType = _MimeService2.default.getFileExtension(file.mimetype),
                thumbnailExtension = fileType === 'gif' ? 'jpg' : fileType,
                thumbnailName = hash + '-thumb.' + thumbnailExtension,
                thumbnailModel = new _Thumbnail2.default(thumbnailName, file.mimetype),
                thumbnailPath = _app2.default.tmpDir + '/' + thumbnailName;
            return new Promise(function (resolve, reject) {
                _lwip2.default.open(file.path, fileType, function (err, image) {
                    if (err) {
                        var message = 'Failed to create thumbnail for file ' + file.originalname;
                        _logger2.default.warn(message);
                        reject(new _CTIWarning2.default(message, err));
                    }
                    var originalWidth = image.width(),
                        originalHeight = image.height(),
                        scale = Math.min(thumbnailSize / originalWidth, thumbnailSize / originalHeight);
                    image.batch().scale(scale).writeFile(thumbnailPath, function (err) {
                        if (err) {
                            var _message = 'Failed to create thumbnail for file ' + file.originalname;
                            _logger2.default.warn(_message);
                            reject(new _CTIWarning2.default(_message, err));
                        }
                        _this2.storeFile(db, thumbnailModel, thumbnailPath).then(function (thumbnailID) {
                            resolve({
                                thumbnailID: thumbnailID,
                                width: originalWidth,
                                height: originalHeight
                            });
                        }).catch(function (err) {
                            var message = 'Failed to store thumbnail for file ' + file.originalname;
                            _logger2.default.warn(message);
                            reject(new _CTIWarning2.default(message, err));
                        });
                    });
                });
            });
        }
    }, {
        key: 'createVideoThumbnail',
        value: function createVideoThumbnail(db, file, hash) {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                var thumbnailName = null;
                (0, _fluentFfmpeg2.default)(file.path).on('filenames', function (filenames) {
                    if (filenames.length) {
                        thumbnailName = filenames[0];
                    } else {
                        var message = 'Failed to create thumbnail for file ' + file.originalname;
                        _logger2.default.warn(message);
                        reject(new _CTIWarning2.default(message));
                    }
                }).on('end', function () {
                    var newFileData = {
                        originalname: file.originalname,
                        mimetype: 'image/png',
                        filename: thumbnailName,
                        path: _app2.default.tmpDir + '/' + thumbnailName
                    };
                    resolve(_this3.createImageThumbnail(db, newFileData, hash));
                }).on('error', function (err) {
                    var message = 'Failed to create thumbnail for file ' + file.originalname;
                    _logger2.default.warn(message);
                    reject(new _CTIWarning2.default(message, err));
                }).screenshots({
                    count: 1,
                    timemarks: ['1']
                }, _app2.default.tmpDir);
            });
        }
    }, {
        key: 'createThumbnail',
        value: function createThumbnail(db, file, hash) {
            var mimeType = file.mimetype;

            if (~imageMimeTypes.indexOf(mimeType)) {
                return this.createImageThumbnail(db, file, hash);
            } else if (~videoMimeTypes.indexOf(mimeType)) {
                return this.createVideoThumbnail(db, file, hash);
            }

            var error = new _CTIError2.default('Failed to create thumbnail for file ' + file.originalname + ' - unsupported MIME type ' + mimeType);
            return Promise.reject(error);
        }
    }, {
        key: 'storeFile',
        value: function storeFile(db, file, path) {
            var options = {
                metadata: file.serialiseToDatabase()
            },
                bucket = new GridFSBucket(db);

            return new Promise(function (resolve, reject) {
                var uploadStream = bucket.openUploadStream(file.name, options);
                _fs2.default.createReadStream(path).pipe(uploadStream).on('error', function (err) {
                    reject(err);
                }).on('finish', function () {
                    _logger2.default.debug(path + ' stored to database as ' + file.name);
                    (0, _del2.default)([path]).then(function () {
                        _logger2.default.debug('Temporary file deleted: ' + path);
                        resolve(uploadStream.id);
                    });
                });
            });
        }
    }, {
        key: 'downloadFile',
        value: function downloadFile(fileIDHex, deserialise) {
            return _DBConnectionService2.default.getDB().then(function (db) {
                var oid = ObjectID.createFromHexString(fileIDHex),
                    bucket = new GridFSBucket(db);
                return bucket.find({ _id: oid }).toArray().then(function (arr) {
                    if (arr.length) {
                        return {
                            doc: deserialise(arr[0]).serialiseToApi(),
                            stream: bucket.openDownloadStream(oid)
                        };
                    }
                });
            });
        }
    }, {
        key: 'downloadMedia',
        value: function downloadMedia(objectIDHex) {
            return MediaCollection.downloadFile(objectIDHex, _Media2.default.fromDatabase);
        }
    }, {
        key: 'getFile',
        value: function getFile(fileIDHex, deserialize) {
            return _DBConnectionService2.default.getDB().then(function (db) {
                var oid = ObjectID.createFromHexString(fileIDHex),
                    bucket = new GridFSBucket(db);
                return bucket.find({ _id: oid }).toArray().then(function (arr) {
                    if (arr.length) {
                        return deserialize(arr[0]).serialiseToApi();
                    }
                });
            });
        }
    }, {
        key: 'getMedia',
        value: function getMedia(mediaIDHex) {
            return MediaCollection.getFile(mediaIDHex, _Media2.default.fromDatabase);
        }
    }, {
        key: 'findMedia',
        value: function findMedia(tags, skip, limit) {
            return _DBConnectionService2.default.getDB().then(function (db) {
                var bucket = new GridFSBucket(db);
                var baseQuery = {
                    $or: [{ 'metadata.t': _FileType2.default.IMAGE.code }, { 'metadata.t': _FileType2.default.VIDEO.code }]
                },
                    queryPromise = null;

                if (tags && tags.length) {
                    var queryPromises = tags.map(function (tag) {
                        return _TagCollection2.default.getDerivingTags(tag).then(function (derivingTags) {
                            var tagIds = derivingTags.map(function (derivingTag) {
                                return derivingTag.id;
                            });
                            tagIds.unshift(tag);
                            return {
                                $or: tagIds.map(function (tagId) {
                                    return { 'metadata.ta': tagId };
                                })
                            };
                        });
                    });

                    queryPromise = Promise.all(queryPromises).then(function (queries) {
                        return _lodash2.default.extend(baseQuery, { $and: queries });
                    });
                } else {
                    queryPromise = Promise.resolve(baseQuery);
                }

                return queryPromise.then(function (query) {
                    var cursor = bucket.find(query);
                    return cursor.count().then(function (count) {
                        return cursor.skip(skip || 0).limit(limit || 0).sort({ uploadDate: -1 }).toArray().then(function (media) {
                            return {
                                media: media.map(function (media) {
                                    return _Media2.default.fromDatabase(media).serialiseToApi();
                                }),
                                count: count
                            };
                        });
                    });
                });
            });
        }
    }, {
        key: 'getThumbnail',
        value: function getThumbnail(mediaIDHex) {
            var _this4 = this;

            return this.getMedia(mediaIDHex).then(function (media) {
                return _this4.getFile(media.thumbnailID.toHexString(), _Thumbnail2.default.fromDatabase);
            });
        }
    }, {
        key: 'downloadThumbnail',
        value: function downloadThumbnail(mediaIDHex) {
            return this.getMedia(mediaIDHex).then(function (media) {
                return MediaCollection.downloadFile(media.thumbnailID.toHexString(), _Thumbnail2.default.fromDatabase);
            });
        }
    }, {
        key: 'setTags',
        value: function setTags(mediaIDHex, tags) {
            var _this5 = this;

            return _DBConnectionService2.default.getDB().then(function (db) {
                var oid = ObjectID.createFromHexString(mediaIDHex);
                return db.collection(_app2.default.db.filesCollection).update({
                    _id: oid
                }, {
                    $set: {
                        'metadata.ta': tags
                    }
                }).then(function (data) {
                    var result = data.result;
                    if (result.nModified) {
                        _logger2.default.debug('Tags updated for ' + result.nModified + ' file' + (result.nModified > 1 ? 's' : ''));
                        return _this5.getMedia(mediaIDHex);
                    } else {
                        _logger2.default.warn('No media found with ID ' + mediaIDHex);
                        return null;
                    }
                });
            });
        }
    }]);

    return MediaCollection;
}();

exports.default = MediaCollection;