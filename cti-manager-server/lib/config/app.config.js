'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var argv = _yargs2.default.argv,
    dev = !!argv.dev;

if (dev) {
    _logger2.default.info('dev mode enabled');
}

exports.default = {
    dev: dev,
    api: {
        port: 3333
    },
    db: {
        host: 'localhost',
        port: 27017,
        name: dev ? 'cti-dev' : 'cti'
    },
    tmpDir: 'tmp'
};