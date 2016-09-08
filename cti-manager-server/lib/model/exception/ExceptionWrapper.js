'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CTIExceptionType = require('./CTIExceptionType');

var _CTIExceptionType2 = _interopRequireDefault(_CTIExceptionType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExceptionWrapper = function () {
    function ExceptionWrapper(data, warnings, errors) {
        _classCallCheck(this, ExceptionWrapper);

        this.data = data;
        this.warnings = warnings ? warnings.slice() : [];
        this.errors = errors ? errors.slice() : [];
    }

    _createClass(ExceptionWrapper, [{
        key: 'addException',
        value: function addException(exception) {
            switch (exception.type) {
                case _CTIExceptionType2.default.WARNING:
                    this.warnings.push(exception);
                    break;
                case _CTIExceptionType2.default.ERROR:
                default:
                    this.errors.push(exception);
                    break;
            }
        }
    }]);

    return ExceptionWrapper;
}();

exports.default = ExceptionWrapper;