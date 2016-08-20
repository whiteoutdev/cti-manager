'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _app = require('../config/app.config');

var _app2 = _interopRequireDefault(_app);

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

var _DBConnectionService = require('./DBConnectionService');

var _DBConnectionService2 = _interopRequireDefault(_DBConnectionService);

var _Tag = require('../model/tag/Tag');

var _Tag2 = _interopRequireDefault(_Tag);

var _TagType = require('../model/tag/TagType');

var _TagType2 = _interopRequireDefault(_TagType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TagCollection = function () {
    function TagCollection() {
        _classCallCheck(this, TagCollection);
    }

    _createClass(TagCollection, null, [{
        key: 'init',
        value: function init() {
            return TagCollection.createTags(['tagme']);
        }
    }, {
        key: 'getTags',
        value: function getTags(query, skip, limit) {
            var dbQuery = {};
            if (query) {
                dbQuery._id = {
                    $regex: new RegExp(query)
                };
            }

            return _DBConnectionService2.default.getDB().then(function (db) {
                return db.collection(_app2.default.db.tagsCollection).find(dbQuery).skip(skip || 0).limit(limit || 0).toArray().then(function (tags) {
                    return tags.map(function (tag) {
                        return _Tag2.default.fromDatabase(tag).serialiseToApi();
                    });
                });
            });
        }
    }, {
        key: 'getTag',
        value: function getTag(tag) {
            tag = _Tag2.default.encode(tag);
            return _DBConnectionService2.default.getDB().then(function (db) {
                return db.collection(_app2.default.db.tagsCollection).findOne({
                    _id: tag
                }).then(function (doc) {
                    return _Tag2.default.fromDatabase(doc).serialiseToApi();
                });
            });
        }
    }, {
        key: 'getTagTypeNames',
        value: function getTagTypeNames() {
            return _lodash2.default.filter(_TagType2.default, function (type) {
                return type instanceof _TagType2.default;
            }).map(function (type) {
                return type.name;
            });
        }
    }, {
        key: 'createTags',
        value: function createTags(tags) {
            tags = tags.map(function (tag) {
                return _Tag2.default.encode(tag).toLowerCase();
            });
            var query = {
                _id: {
                    $in: tags
                }
            };
            return _DBConnectionService2.default.getDB().then(function (db) {
                return db.collection(_app2.default.db.tagsCollection).find(query).toArray().then(function (docs) {
                    var tagsToInsert = tags.filter(function (tag) {
                        return !docs.find(function (doc) {
                            return doc._id === tag;
                        });
                    }).map(function (tag) {
                        return new _Tag2.default(tag).serialiseToDatabase();
                    });
                    if (tagsToInsert.length) {
                        return db.collection(_app2.default.db.tagsCollection).insertMany(tagsToInsert).then(function (result) {
                            if (result.result.n) {
                                _logger2.default.debug(result.result.n + ' tags created');
                            }
                            return tagsToInsert;
                        });
                    }
                    return null;
                });
            });
        }
    }, {
        key: 'updateTag',
        value: function updateTag(tagData) {
            var tag = _Tag2.default.fromApi(tagData),
                query = { _id: tag.id },
                doc = tag.serialiseToDatabase();

            return _DBConnectionService2.default.getDB().then(function (db) {
                return db.collection(_app2.default.db.tagsCollection).updateOne(query, doc).then(function (writeResult) {
                    return writeResult.result;
                });
            });
        }
    }]);

    return TagCollection;
}();

exports.default = TagCollection;