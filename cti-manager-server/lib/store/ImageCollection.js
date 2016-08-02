'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _app = require('../config/app.config');

var _app2 = _interopRequireDefault(_app);

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

var _DBConnectionService = require('./DBConnectionService');

var _DBConnectionService2 = _interopRequireDefault(_DBConnectionService);

var _HashService = require('../util/HashService');

var _HashService2 = _interopRequireDefault(_HashService);

var _Image = require('../model/Image');

var _Image2 = _interopRequireDefault(_Image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ObjectID = _mongodb2.default.ObjectID;
var GridFSBucket = _mongodb2.default.GridFSBucket;

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
                            var image = new _Image2.default(file, hash);
                            _this.createGridStore(db, file, image).then(function () {
                                resolve();
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
        key: 'createGridStore',
        value: function createGridStore(db, file, image) {
            var options = {
                metadata: image
            },
                bucket = new GridFSBucket(db);

            return new Promise(function (resolve, reject) {
                _fs2.default.createReadStream(file.path).pipe(bucket.openUploadStream(image.name, options)).on('error', function (error) {
                    reject(error);
                }).on('finish', function () {
                    _logger2.default.debug(file.path + ' stored to database as ' + image.name);
                    (0, _del2.default)([file.path]).then(function () {
                        _logger2.default.debug('Temporary file deleted: ' + file.path);
                        resolve();
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
                        var _ret = function () {
                            var doc = arr[0],
                                tmpLocation = _app2.default.tmpDir + '/' + doc.metadata.name;
                            return {
                                v: new Promise(function (resolve, reject) {
                                    bucket.openDownloadStream(oid).pipe(_fs2.default.createWriteStream(tmpLocation)).on('error', function (err) {
                                        reject(err);
                                    }).on('finish', function () {
                                        resolve({ path: tmpLocation, fileData: doc });
                                    });
                                })
                            };
                        }();

                        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
                    }
                });
            });
        }
    }, {
        key: 'getImage',
        value: function getImage(objectIDHex) {
            return _DBConnectionService2.default.getDB().then(function (db) {
                var oid = ObjectID.createFromHexString(objectIDHex),
                    bucket = new GridFSBucket(db);
                return bucket.find({ _id: oid }).toArray().then(function (arr) {
                    if (arr.length) {
                        return arr[0];
                    }
                });
            });
        }
    }, {
        key: 'getImages',
        value: function getImages(skip, limit) {
            return _DBConnectionService2.default.getDB().then(function (db) {
                var bucket = new GridFSBucket(db);
                return bucket.find({}).skip(skip || 0).limit(limit || 0).sort({ uploadDate: -1 }).toArray().then(function (docs) {
                    return docs;
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