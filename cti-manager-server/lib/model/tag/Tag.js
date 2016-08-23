'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractModel2 = require('../AbstractModel');

var _AbstractModel3 = _interopRequireDefault(_AbstractModel2);

var _TagType = require('./TagType');

var _TagType2 = _interopRequireDefault(_TagType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tag = function (_AbstractModel) {
    _inherits(Tag, _AbstractModel);

    function Tag(name, type, derivedTags) {
        _classCallCheck(this, Tag);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Tag).call(this));

        _this.id = Tag.encode(name);
        _this.type = type || _TagType2.default.GENERAL;
        _this.derivedTags = (derivedTags || []).filter(function (tag) {
            return tag;
        });
        return _this;
    }

    _createClass(Tag, [{
        key: 'serialiseToDatabase',
        value: function serialiseToDatabase() {
            return {
                _id: this.id,
                t: this.type.code,
                d: this.derivedTags
            };
        }
    }, {
        key: 'serialiseToApi',
        value: function serialiseToApi() {
            return {
                id: this.id,
                type: this.type.name,
                derivedTags: this.derivedTags
            };
        }
    }], [{
        key: 'fromDatabase',
        value: function fromDatabase(doc) {
            return new Tag(doc._id, _TagType2.default.fromCode(doc.t), doc.d);
        }
    }, {
        key: 'fromApi',
        value: function fromApi(tagData) {
            return new Tag(tagData.id, _TagType2.default.fromName(tagData.type), tagData.derivedTags);
        }
    }, {
        key: 'encode',
        value: function encode(name) {
            return name.replace(/ /g, '_');
        }
    }]);

    return Tag;
}(_AbstractModel3.default);

exports.default = Tag;