'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TagType = function TagType(name, code) {
    _classCallCheck(this, TagType);

    this.name = name;
    this.code = code;
};

exports.default = {
    GENERAL: new TagType('general', 1),
    COPYRIGHT: new TagType('copyright', 2),
    CHARACTER: new TagType('character', 3),
    ARTIST: new TagType('artist', 4),

    fromCode: function fromCode(code) {
        return _lodash2.default.find(this, function (tagType) {
            return tagType.code === code;
        });
    }
};