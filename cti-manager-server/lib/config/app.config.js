'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var argv = _yargs2.default.argv,
    dev = !!argv.dev;

_logger2.default.info('CTI Manager version ' + _package2.default.version);
if (dev) {
    _logger2.default.info('dev mode enabled');
}

exports.default = {
    dev: dev,
    version: _package2.default.version,
    api: {
        port: 3333
    },
    db: {
        host: 'localhost',
        port: 27017,
        name: dev ? 'cti-dev' : 'cti',
        filesCollection: 'fs.files',
        tagsCollection: 'tags'
    },
    tmpDir: 'tmp',
    thumbnailSize: 180
};