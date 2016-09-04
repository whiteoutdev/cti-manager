'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractModel2 = require('../AbstractModel');

var _AbstractModel3 = _interopRequireDefault(_AbstractModel2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TagMetadata = function (_AbstractModel) {
    _inherits(TagMetadata, _AbstractModel);

    function TagMetadata(urls, pixivId) {
        _classCallCheck(this, TagMetadata);

        var _this = _possibleConstructorReturn(this, (TagMetadata.__proto__ || Object.getPrototypeOf(TagMetadata)).call(this));

        _this.urls = urls || [];
        _this.pixivId = pixivId || null;
        return _this;
    }

    _createClass(TagMetadata, [{
        key: 'serialiseToDatabase',
        value: function serialiseToDatabase() {
            return {
                u: this.urls,
                p: this.pixivId
            };
        }
    }, {
        key: 'serialiseToApi',
        value: function serialiseToApi() {
            var metadata = {
                urls: this.urls
            };
            this.pixivId && (metadata.pixivId = this.pixivId);
            return metadata;
        }
    }], [{
        key: 'fromDatabase',
        value: function fromDatabase(doc) {
            return new TagMetadata(doc.u, doc.p);
        }
    }, {
        key: 'fromApi',
        value: function fromApi(metadata) {
            return new TagMetadata(metadata.urls, metadata.pixivId);
        }
    }]);

    return TagMetadata;
}(_AbstractModel3.default);

exports.default = TagMetadata;