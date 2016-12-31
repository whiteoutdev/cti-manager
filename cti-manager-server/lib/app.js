'use strict';

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _app = require('./config/app.config');

var _app2 = _interopRequireDefault(_app);

var _passport3 = require('./config/passport.config');

var _passport4 = _interopRequireDefault(_passport3);

var _logger = require('./util/logger');

var _logger2 = _interopRequireDefault(_logger);

var _RestConfig = require('./rest/RestConfig');

var _RestConfig2 = _interopRequireDefault(_RestConfig);

var _Hooks = require('./config/Hooks');

var _Hooks2 = _interopRequireDefault(_Hooks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _passport4.default)(_passport2.default);

(0, _del2.default)([_app2.default.tmpDir + '/**', '!' + _app2.default.tmpDir]).then(function (paths) {
    if (paths.length) {
        paths.forEach(function (path) {
            _logger2.default.debug('Removed temporary file: ' + path);
        });
        _logger2.default.info('Cleaned up ' + paths.length + ' temporary files');
    }
});

var app = (0, _express2.default)();

app.use((0, _morgan2.default)('dev'));
app.use((0, _cors2.default)());

app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());

app.use((0, _cookieParser2.default)());

app.use((0, _expressSession2.default)({
    secret: 'dev mode secret',
    resave: false,
    saveUninitialized: false
}));
app.use(_passport2.default.initialize());
app.use(_passport2.default.session());

_RestConfig2.default.configure(app, _passport2.default);

app.listen(_app2.default.api.port, function () {
    _logger2.default.info('CTI Manager API listening on port ' + _app2.default.api.port);
});

_Hooks2.default.onUncaughtException(function (e) {
    _logger2.default.error('Uncaught Exception:');
    _logger2.default.error(e.message);
    _logger2.default.error(e.stack);
});