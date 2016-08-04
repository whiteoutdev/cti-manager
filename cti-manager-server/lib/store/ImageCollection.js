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

var _app = require('../config/app.config');

var _app2 = _interopRequireDefault(_app);

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

var _DBConnectionService = require('./DBConnectionService');

var _DBConnectionService2 = _interopRequireDefault(_DBConnectionService);

var _HashService = require('../util/HashService');

var _HashService2 = _interopRequireDefault(_HashService);

var _FileType = require('../model/gridfs/FileType');

var _FileType2 = _interopRequireDefault(_FileType);

var _Image = require('../model/gridfs/Image');

var _Image2 = _interopRequireDefault(_Image);

var _Thumbnail = require('../model/gridfs/Thumbnail');

var _Thumbnail2 = _interopRequireDefault(_Thumbnail);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ObjectID = _mongodb2.default.ObjectID,
    GridFSBucket = _mongodb2.default.GridFSBucket,
    thumbnailSize = _app2.default.thumbnailSize;

var ImageCollection = function () {
    function ImageCollection() {
        _classCallCheck(this, ImageCollection);
    }

    _createClass(ImageCollection, null, [{
        key: 'addImages',
        value: function addImages(files) {
            var _this = this;

            _logger2.default.info(files.length + ' images received for ingest');
            return _DBConnectionService2.default.getDB().then(function (db) {
                var promises = files.map(function (file) {
                    return new Promise(function (resolve, reject) {
                        _HashService2.default.getHash(file.path).then(function (hash) {
                            _this.createThumbnail(db, file, hash).then(function (info) {
                                var thumbnailID = info.thumbnailID,
                                    width = info.width,
                                    height = info.height,
                                    image = new _Image2.default(file, hash, thumbnailID, width, height);
                                _this.storeFile(db, image, file.path).then(function () {
                                    resolve();
                                });
                            });
                        });
                    });
                });

                Promise.all(promises).then(function () {
                    _logger2.default.info(promises.length + ' images written to database');
                    db.close();
                });
            });
        }
    }, {
        key: 'createThumbnail',
        value: function createThumbnail(db, file, hash) {
            var _this2 = this;

            var fileType = file.originalname.match(/\.((?:\w|\d)+)$/)[1],
                thumbnailName = hash + '-thumb.' + fileType,
                thumbnailModel = new _Thumbnail2.default(thumbnailName),
                thumbnailPath = _app2.default.tmpDir + '/' + thumbnailName;
            return new Promise(function (resolve, reject) {
                _lwip2.default.open(file.path, fileType, function (err, image) {
                    if (err) {
                        reject(err);
                    }
                    var originalWidth = image.width(),
                        originalHeight = image.height(),
                        scale = Math.min(thumbnailSize / originalWidth, thumbnailSize / originalHeight);
                    image.batch().scale(scale).writeFile(thumbnailPath, function (err) {
                        if (err) {
                            reject(err);
                        }
                        _this2.storeFile(db, thumbnailModel, thumbnailPath).then(function (thumbnailID) {
                            resolve({
                                thumbnailID: thumbnailID,
                                width: originalWidth,
                                height: originalHeight
                            });
                        });
                    });
                });
            });
        }
    }, {
        key: 'storeFile',
        value: function storeFile(db, file, path) {
            var options = {
                metadata: file
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
        key: 'downloadImage',
        value: function downloadImage(objectIDHex) {
            return _DBConnectionService2.default.getDB().then(function (db) {
                var oid = ObjectID.createFromHexString(objectIDHex),
                    bucket = new GridFSBucket(db);
                return bucket.find({ _id: oid }).toArray().then(function (arr) {
                    if (arr.length) {
                        return {
                            doc: arr[0],
                            stream: bucket.openDownloadStream(oid).on('finish', function () {
                                db.close();
                            })
                        };
                    } else {
                        db.close();
                    }
                });
            });
        }
    }, {
        key: 'getImage',
        value: function getImage(imageIDHex) {
            return _DBConnectionService2.default.getDB().then(function (db) {
                var oid = ObjectID.createFromHexString(imageIDHex),
                    bucket = new GridFSBucket(db);
                return bucket.find({ _id: oid }).toArray().then(function (arr) {
                    db.close();
                    if (arr.length) {
                        return arr[0];
                    }
                });
            });
        }
    }, {
        key: 'getImages',
        value: function getImages(tags, skip, limit) {
            return _DBConnectionService2.default.getDB().then(function (db) {
                var bucket = new GridFSBucket(db),
                    query = { 'metadata.fileType': _FileType2.default.IMAGE };
                if (tags && tags.length) {
                    query['metadata.tags'] = {
                        $all: tags
                    };
                }
                var cursor = bucket.find(query);
                return cursor.count().then(function (count) {
                    return cursor.skip(skip || 0).limit(limit || 0).sort({ uploadDate: -1 }).toArray().then(function (images) {
                        db.close();
                        return { images: images, count: count };
                    });
                });
            });
        }
    }, {
        key: 'getThumbnail',
        value: function getThumbnail(imageIDHex) {
            var _this3 = this;

            return this.getImage(imageIDHex).then(function (image) {
                return _this3.getImage(image.metadata.thumbnailID.toHexString());
            });
        }
    }, {
        key: 'downloadThumbnail',
        value: function downloadThumbnail(imageIDHex) {
            var _this4 = this;

            return this.getImage(imageIDHex).then(function (image) {
                return _this4.downloadImage(image.metadata.thumbnailID.toHexString());
            });
        }
    }, {
        key: 'setTags',
        value: function setTags(imageIDHex, tags) {
            return _DBConnectionService2.default.getDB().then(function (db) {
                var oid = ObjectID.createFromHexString(imageIDHex);
                return db.collection(_app2.default.gridfs.filesCollection).update({
                    _id: oid
                }, {
                    $set: {
                        'metadata.tags': tags
                    }
                }).then(function (data) {
                    db.close();
                    return data;
                });
            });
        }
    }, {
        key: 'findImages',
        value: function findImages(tags, limit) {
            var query = {};
            if (tags && tags.length) {
                query['metadata.tags'] = {
                    $all: tags
                };
            }
            return _DBConnectionService2.default.getDB().then(function (db) {
                var pipeline = [{ $match: query }];
                if (limit) {
                    pipeline.push({ $sample: { size: limit } });
                }
                var cursor = db.collection('fs.files').aggregate(pipeline, { cursor: { batchSize: 1 } });
                return cursor.toArray().then(function (documents) {
                    db.close();
                    return documents;
                });
            });
        }
    }]);

    return ImageCollection;
}();

exports.default = ImageCollection;