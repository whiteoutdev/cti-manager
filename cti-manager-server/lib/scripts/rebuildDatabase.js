'use strict';

require('babel-polyfill');

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

var _DBConnectionService = require('../store/DBConnectionService');

var _DBConnectionService2 = _interopRequireDefault(_DBConnectionService);

var _ImageCollection = require('../store/ImageCollection');

var _ImageCollection2 = _interopRequireDefault(_ImageCollection);

var _TagCollection = require('../store/TagCollection');

var _TagCollection2 = _interopRequireDefault(_TagCollection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_DBConnectionService2.default.getDB().then(function (db) {
    db.listCollections({}).toArray().then(function (collections) {
        var dropPromises = collections.map(function (collection) {
            return db.collection(collection.name).drop().then(function () {
                _logger2.default.info('Dropped collection: ' + collection.name);
            });
        });

        Promise.all(dropPromises).then(function () {
            var createPromises = [_ImageCollection2.default.init(), _TagCollection2.default.init()];
            Promise.all(createPromises).then(function () {
                _logger2.default.info('Database rebuilt');
                db.close();
            });
        });
    });
});