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

var _app = require('../config/app.config');

var _app2 = _interopRequireDefault(_app);

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

var _DBConnectionService = require('./DBConnectionService');

var _DBConnectionService2 = _interopRequireDefault(_DBConnectionService);

var _TagCollection = require('./TagCollection');

var _TagCollection2 = _interopRequireDefault(_TagCollection);

var _HashService = require('../util/HashService');

var _HashService2 = _interopRequireDefault(_HashService);

var _MimeService = require('../util/MimeService');

var _MimeService2 = _interopRequireDefault(_MimeService);

var _FileType = require('../model/gridfs/FileType');

var _FileType2 = _interopRequireDefault(_FileType);

var _Image = require('../model/gridfs/Image');

var _Image2 = _interopRequireDefault(_Image);

var _Thumbnail = require('../model/gridfs/Thumbnail');

var _Thumbnail2 = _interopRequireDefault(_Thumbnail);

var _ExceptionWrapper = require('../model/exception/ExceptionWrapper');

var _ExceptionWrapper2 = _interopRequireDefault(_ExceptionWrapper);

var _CTIWarning = require('../model/exception/CTIWarning');

var _CTIWarning2 = _interopRequireDefault(_CTIWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ObjectID = _mongodb2.default.ObjectID,
    GridFSBucket = _mongodb2.default.GridFSBucket,
    thumbnailSize = _app2.default.thumbnailSize,
    supportedMimeTypes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'];

var ImageCollection = function () {
    function ImageCollection() {
        _classCallCheck(this, ImageCollection);
    }

    _createClass(ImageCollection, null, [{
        key: 'init',
        value: function init() {
            return _DBConnectionService2.default.getDB().then(function (db) {
                return db.collection(_app2.default.db.filesCollection).createIndex({ 'metadata.ta': 1 });
            });
        }
    }, {
        key: 'addImages',
        value: function addImages(files) {
            var _this = this;

            _logger2.default.info(files.length + ' images received for ingest');

            var exceptionWrapper = new _ExceptionWrapper2.default();

            return _DBConnectionService2.default.getDB().then(function (db) {
                var promises = files.filter(function (file) {
                    if (!~supportedMimeTypes.indexOf(file.mimetype)) {
                        var message = 'MIME type ' + file.mimetype + ' not supported';
                        exceptionWrapper.addException(new _CTIWarning2.default(message));
                        _logger2.default.debug(message);
                        return false;
                    }
                    return true;
                }).map(function (file) {
                    return new Promise(function (resolve) {
                        _HashService2.default.getHash(file.path).then(function (hash) {
                            _this.createThumbnail(db, file, hash).then(function (info) {
                                var thumbnailID = info.thumbnailID,
                                    width = info.width,
                                    height = info.height,
                                    image = new _Image2.default(file.mimetype, hash, thumbnailID, width, height);
                                _this.storeFile(db, image, file.path).then(function () {
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
                    _logger2.default.info(promises.length + ' images written to database');
                    return exceptionWrapper;
                });
            });
        }
    }, {
        key: 'createThumbnail',
        value: function createThumbnail(db, file, hash) {
            var _this2 = this;

            console.log(file);
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
        key: 'downloadImage',
        value: function downloadImage(objectIDHex) {
            return ImageCollection.downloadFile(objectIDHex, _Image2.default.fromDatabase);
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
        key: 'getImage',
        value: function getImage(imageIDHex) {
            return ImageCollection.getFile(imageIDHex, _Image2.default.fromDatabase);
        }
    }, {
        key: 'getImages',
        value: function getImages(tags, skip, limit) {
            return _DBConnectionService2.default.getDB().then(function (db) {
                var bucket = new GridFSBucket(db);
                var baseQuery = { 'metadata.t': _FileType2.default.IMAGE.code },
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
                        return cursor.skip(skip || 0).limit(limit || 0).sort({ uploadDate: -1 }).toArray().then(function (images) {
                            return {
                                images: images.map(function (image) {
                                    return _Image2.default.fromDatabase(image).serialiseToApi();
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
        value: function getThumbnail(imageIDHex) {
            var _this3 = this;

            return this.getImage(imageIDHex).then(function (image) {
                return _this3.getFile(image.thumbnailID.toHexString(), _Thumbnail2.default.fromDatabase);
            });
        }
    }, {
        key: 'downloadThumbnail',
        value: function downloadThumbnail(imageIDHex) {
            return this.getImage(imageIDHex).then(function (image) {
                return ImageCollection.downloadFile(image.thumbnailID.toHexString(), _Thumbnail2.default.fromDatabase);
            });
        }
    }, {
        key: 'setTags',
        value: function setTags(imageIDHex, tags) {
            var _this4 = this;

            return _DBConnectionService2.default.getDB().then(function (db) {
                var oid = ObjectID.createFromHexString(imageIDHex);
                return db.collection(_app2.default.db.filesCollection).update({
                    _id: oid
                }, {
                    $set: {
                        'metadata.ta': tags
                    }
                }).then(function (data) {
                    var result = data.result;
                    if (result.nModified) {
                        _logger2.default.debug('Tags updated for ' + result.nModified + ' image' + (result.nModified > 1 ? 's' : ''));
                        return _this4.getImage(imageIDHex);
                    } else {
                        _logger2.default.warn('No image found with ID ' + imageIDHex);
                        return null;
                    }
                });
            });
        }
    }]);

    return ImageCollection;
}();

exports.default = ImageCollection;