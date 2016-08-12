'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _AbstractFile2 = require('./AbstractFile');

var _AbstractFile3 = _interopRequireDefault(_AbstractFile2);

var _FileType = require('./FileType');

var _FileType2 = _interopRequireDefault(_FileType);

var _MimeService = require('../../util/MimeService');

var _MimeService2 = _interopRequireDefault(_MimeService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Image = function (_AbstractFile) {
    _inherits(Image, _AbstractFile);

    function Image(mimeType, hash, thumbnailID, width, height, tags, id) {
        _classCallCheck(this, Image);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Image).call(this, _FileType2.default.IMAGE, hash, mimeType, id));

        _this.hash = hash;
        _this.thumbnailID = thumbnailID;
        _this.width = width;
        _this.height = height;
        _this.tags = tags || ['tagme'];

        var extension = _MimeService2.default.getFileExtension(_this.mimeType);
        if (extension) {
            _this.name += '.' + extension;
        }
        return _this;
    }

    _createClass(Image, [{
        key: 'serialiseToDatabase',
        value: function serialiseToDatabase() {
            var serialised = _get(Object.getPrototypeOf(Image.prototype), 'serialiseToDatabase', this).call(this);
            return _lodash2.default.extend(serialised, {
                h: this.hash,
                ti: this.thumbnailID,
                w: this.width,
                he: this.height,
                ta: this.tags
            });
        }
    }, {
        key: 'serialiseToApi',
        value: function serialiseToApi() {
            var serialised = _get(Object.getPrototypeOf(Image.prototype), 'serialiseToApi', this).call(this);
            return _lodash2.default.extend(serialised, {
                hash: this.hash,
                thumbnailID: this.thumbnailID,
                width: this.width,
                height: this.height,
                tags: this.tags
            });
        }
    }], [{
        key: 'fromDatabase',
        value: function fromDatabase(doc) {
            var md = doc.metadata;
            return new Image(md.m, md.h, md.ti, md.w, md.he, md.ta, doc._id);
        }
    }]);

    return Image;
}(_AbstractFile3.default);

exports.default = Image;
;