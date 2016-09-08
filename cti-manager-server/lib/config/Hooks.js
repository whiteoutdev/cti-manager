'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

process.on('SIGINT', function () {
    _logger2.default.info('SIGINT received. Exiting...');
    process.exit(2);
});

var Hooks = function () {
    function Hooks() {
        _classCallCheck(this, Hooks);
    }

    _createClass(Hooks, null, [{
        key: 'onExit',
        value: function onExit(cb) {
            if (typeof cb === 'function') {
                process.on('exit', function () {
                    cb();
                });
            }
        }
    }, {
        key: 'onUncaughtException',
        value: function onUncaughtException(cb) {
            if (typeof cb === 'function') {
                process.on('uncaughtException', function (e) {
                    cb(e);
                });
            }
        }
    }]);

    return Hooks;
}();

exports.default = Hooks;