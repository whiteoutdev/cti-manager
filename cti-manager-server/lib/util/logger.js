'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _app = require('../config/app.config');

var _app2 = _interopRequireDefault(_app);

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = _bunyan2.default.createLogger({
    name: 'cti-manager',
    level: _app2.default.dev ? 'debug' : 'info'
});

logger.info('CTI Manager version ' + _app2.default.version);
_app2.default.dev && logger.info('dev mode enabled');

exports.default = logger;