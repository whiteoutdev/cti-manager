'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TagType = function () {
    function TagType(name, code) {
        _classCallCheck(this, TagType);

        this.name = name;
        this.code = code;
    }

    _createClass(TagType, null, [{
        key: 'fromCode',
        value: function fromCode(code) {
            return _lodash2.default.find(TagType, function (tagType) {
                return tagType.code === code;
            });
        }
    }]);

    return TagType;
}();

_lodash2.default.extend(TagType, {
    GENERAL: new TagType('general', 1),
    COPYRIGHT: new TagType('copyright', 2),
    CHARACTER: new TagType('character', 3),
    ARTIST: new TagType('artist', 4)
});

exports.default = TagType;