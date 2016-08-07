'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _TagType = require('./TagType');

var _TagType2 = _interopRequireDefault(_TagType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tag = function () {
    function Tag(name, type) {
        _classCallCheck(this, Tag);

        this._id = Tag.encode(name);
        this.type = type || _TagType2.default.GENERAL;
        this.derivedTags = [];
    }

    _createClass(Tag, null, [{
        key: 'encode',
        value: function encode(name) {
            return name.replace(/ /g, '_');
        }
    }]);

    return Tag;
}();

exports.default = Tag;