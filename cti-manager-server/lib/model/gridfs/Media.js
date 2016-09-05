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

var _MimeService = require('../../util/MimeService');

var _MimeService2 = _interopRequireDefault(_MimeService);

var _FileType = require('./FileType');

var _FileType2 = _interopRequireDefault(_FileType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Media = function (_AbstractFile) {
    _inherits(Media, _AbstractFile);

    function Media(fileType, mimeType, hash, thumbnailID, width, height, tags, id) {
        _classCallCheck(this, Media);

        var _this = _possibleConstructorReturn(this, (Media.__proto__ || Object.getPrototypeOf(Media)).call(this, fileType, hash, mimeType, id));

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

    _createClass(Media, [{
        key: 'serialiseToDatabase',
        value: function serialiseToDatabase() {
            var serialised = _get(Media.prototype.__proto__ || Object.getPrototypeOf(Media.prototype), 'serialiseToDatabase', this).call(this);
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
            var serialised = _get(Media.prototype.__proto__ || Object.getPrototypeOf(Media.prototype), 'serialiseToApi', this).call(this);
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
            return new Media(_FileType2.default.fromCode(md.t), md.m, md.h, md.ti, md.w, md.he, md.ta, doc._id);
        }
    }]);

    return Media;
}(_AbstractFile3.default);

exports.default = Media;