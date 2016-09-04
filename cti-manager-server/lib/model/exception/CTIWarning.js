'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _CTIException2 = require('./CTIException');

var _CTIException3 = _interopRequireDefault(_CTIException2);

var _CTIExceptionType = require('./CTIExceptionType');

var _CTIExceptionType2 = _interopRequireDefault(_CTIExceptionType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CTIWarning = function (_CTIException) {
    _inherits(CTIWarning, _CTIException);

    function CTIWarning(message, e) {
        _classCallCheck(this, CTIWarning);

        return _possibleConstructorReturn(this, (CTIWarning.__proto__ || Object.getPrototypeOf(CTIWarning)).call(this, _CTIExceptionType2.default.WARNING, message, e));
    }

    return CTIWarning;
}(_CTIException3.default);

exports.default = CTIWarning;