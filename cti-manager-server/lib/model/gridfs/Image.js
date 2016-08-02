'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

    function Image(file, hash, thumbnailID) {
        _classCallCheck(this, Image);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Image).call(this, _FileType2.default.IMAGE, hash));

        _this.createFromUpload(file, hash, thumbnailID);
        return _this;
    }

    _createClass(Image, [{
        key: 'createFromUpload',
        value: function createFromUpload(file, hash, thumbnailID) {
            this.mimeType = file.mimetype;
            this.hash = hash;
            this.thumbnailID = thumbnailID;
            var extension = _MimeService2.default.getFileExtension(this.mimeType);
            if (extension) {
                this.name += '.' + extension;
            }

            this.tags = ['tagme'];
        }
    }]);

    return Image;
}(_AbstractFile3.default);

exports.default = Image;
;