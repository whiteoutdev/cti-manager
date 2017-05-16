'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _app = require('../config/app.config');

var _app2 = _interopRequireDefault(_app);

var _DBConnectionService = require('./DBConnectionService');

var _DBConnectionService2 = _interopRequireDefault(_DBConnectionService);

var _User = require('../model/user/User');

var _User2 = _interopRequireDefault(_User);

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

var _CryptoService = require('../util/CryptoService');

var _CryptoService2 = _interopRequireDefault(_CryptoService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserCollection = function () {
    function UserCollection() {
        _classCallCheck(this, UserCollection);
    }

    _createClass(UserCollection, null, [{
        key: 'init',
        value: function init() {
            // TODO: Don't hardcode this
            return UserCollection.createUser({
                username: 'dev',
                password: 'password'
            });
        }
    }, {
        key: 'createUser',
        value: function createUser(userData) {
            var username = userData.username,
                password = _CryptoService2.default.hashPassword(userData.password),
                user = new _User2.default(username, password);

            _logger2.default.info('User creation requested: ${username}');

            return _DBConnectionService2.default.getDB().then(function (db) {
                return db.collection(_app2.default.db.userCollection).insertOne(user.serialiseToDatabase());
            });
        }
    }, {
        key: 'findUser',
        value: function findUser(username) {
            return _DBConnectionService2.default.getDB().then(function (db) {
                return db.collection(_app2.default.db.userCollection).findOne({ _id: username }).then(function (doc) {
                    return doc ? _User2.default.fromDatabase(doc) : null;
                });
            });
        }
    }]);

    return UserCollection;
}();

exports.default = UserCollection;