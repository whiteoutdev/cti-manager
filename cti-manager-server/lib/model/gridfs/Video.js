'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Media2 = require('./Media');

var _Media3 = _interopRequireDefault(_Media2);

var _FileType = require('./FileType');

var _FileType2 = _interopRequireDefault(_FileType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Video = function (_Media) {
    _inherits(Video, _Media);

    function Video(mimeType, hash, thumbnailID, width, height, tags, id) {
        _classCallCheck(this, Video);

        return _possibleConstructorReturn(this, (Video.__proto__ || Object.getPrototypeOf(Video)).call(this, _FileType2.default.VIDEO, mimeType, hash, thumbnailID, width, height, tags, id));
    }

    return Video;
}(_Media3.default);

exports.default = Video;