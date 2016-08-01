'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ImagesApi = require('./ImagesApi');

var _ImagesApi2 = _interopRequireDefault(_ImagesApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var apis = [new _ImagesApi2.default()];

var RestConfig = function () {
    function RestConfig() {
        _classCallCheck(this, RestConfig);
    }

    _createClass(RestConfig, null, [{
        key: 'configure',
        value: function configure(app) {
            apis.forEach(function (api) {
                api.configure(app);
            });
        }
    }]);

    return RestConfig;
}();

exports.default = RestConfig;
;