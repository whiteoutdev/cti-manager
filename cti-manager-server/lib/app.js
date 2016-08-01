'use strict';

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _app = require('./config/app.config');

var _app2 = _interopRequireDefault(_app);

var _logger = require('./util/logger');

var _logger2 = _interopRequireDefault(_logger);

var _RestConfig = require('./rest/RestConfig');

var _RestConfig2 = _interopRequireDefault(_RestConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _del2.default)([_app2.default.tmpDir + '/**', '!' + _app2.default.tmpDir]).then(function (paths) {
    if (paths.length) {
        paths.forEach(function (path) {
            _logger2.default.debug('Removed temporary file: ' + path);
        });
        _logger2.default.info('Cleaned up ' + paths.length + ' temporary files');
    }
});

var app = (0, _express2.default)();

_RestConfig2.default.configure(app);

app.listen(_app2.default.api.port, function () {
    _logger2.default.info('CTI Manager API listening on port ' + _app2.default.api.port);
});