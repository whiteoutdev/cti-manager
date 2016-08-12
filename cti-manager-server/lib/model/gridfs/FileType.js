'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileType = function FileType(name, code) {
    _classCallCheck(this, FileType);

    this.name = name;
    this.code = code;
};

exports.default = {
    IMAGE: new FileType('image', 1),
    THUMBNAIL: new FileType('thumbnail', 2),

    fromCode: function fromCode(code) {
        return _lodash2.default.find(this, function (fileType) {
            return fileType.code === code;
        });
    }
};