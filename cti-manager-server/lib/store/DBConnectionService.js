'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _app = require('../config/app.config');

var _app2 = _interopRequireDefault(_app);

var _Hooks = require('../config/Hooks');

var _Hooks2 = _interopRequireDefault(_Hooks);

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MongoClient = _mongodb2.default.MongoClient,
    url = 'mongodb://' + _app2.default.db.host + ':' + _app2.default.db.port + '/' + _app2.default.db.name;

var DBConnectionService = function () {
    function DBConnectionService() {
        var _this = this;

        _classCallCheck(this, DBConnectionService);

        this.connectionPromise = MongoClient.connect(url).then(function (db) {
            _logger2.default.info('Database connection to ' + url + ' established');
            _this.db = db;
            return db;
        });
        _Hooks2.default.onExit(function () {
            _logger2.default.info('Closing database connection...');
            _this.db && _this.db.close();
        });
    }

    _createClass(DBConnectionService, [{
        key: 'getDB',
        value: function getDB() {
            return this.connectionPromise;
        }
    }]);

    return DBConnectionService;
}();

exports.default = new DBConnectionService();