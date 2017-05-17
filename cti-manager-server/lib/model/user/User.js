'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractModel2 = require('../AbstractModel');

var _AbstractModel3 = _interopRequireDefault(_AbstractModel2);

var _logger = require('../../util/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var User = function (_AbstractModel) {
    _inherits(User, _AbstractModel);

    function User(username, password) {
        _classCallCheck(this, User);

        var _this = _possibleConstructorReturn(this, (User.__proto__ || Object.getPrototypeOf(User)).call(this));

        _this.username = username;
        _this.password = password;
        return _this;
    }

    _createClass(User, [{
        key: 'serialiseToDatabase',
        value: function serialiseToDatabase() {
            return {
                _id: this.username,
                p: this.password
            };
        }
    }, {
        key: 'serialiseToApi',
        value: function serialiseToApi() {
            return {
                username: this.username
            };
        }
    }], [{
        key: 'fromDatabase',
        value: function fromDatabase(doc) {
            _logger2.default.debug(doc._id, doc.p);
            return new User(doc._id, doc.p);
        }
    }]);

    return User;
}(_AbstractModel3.default);

exports.default = User;