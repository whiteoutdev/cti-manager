'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (passport) {
    _logger2.default.info('Configuring passport...');

    passport.serializeUser(function (user, done) {
        _logger2.default.debug('Serialize user: ' + JSON.stringify(user));
        done(null, user.username);
    });

    passport.deserializeUser(function (id, done) {
        _logger2.default.debug('Deserialized user ID ' + id);
        _UserCollection2.default.findUser(id).then(function (user) {
            done(null, user);
        });
    });

    passport.use('local-login', new _passportLocal.Strategy({
        usernameField: 'username',
        passwordField: 'password'
    }, function (username, password, done) {
        _logger2.default.debug('Authenticating...');
        _UserCollection2.default.findUser(username).then(function (user) {
            _logger2.default.debug('User found: ' + user.id);

            if (!user) {
                var message = 'User ' + username + ' not found';
                _logger2.default.debug(message);
                return done(null, false, { message: message });
            }

            if (!_CryptoService2.default.validatePassword(password, user.password)) {
                var _message = 'Invalid password for user ' + username;
                _logger2.default.debug(_message);
                return done(null, false, { message: _message });
            }

            return done(null, user);
        });
    }));
};

var _passportLocal = require('passport-local');

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

var _CryptoService = require('../util/CryptoService');

var _CryptoService2 = _interopRequireDefault(_CryptoService);

var _UserCollection = require('../store/UserCollection');

var _UserCollection2 = _interopRequireDefault(_UserCollection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }