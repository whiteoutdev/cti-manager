'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MimeService = require('../util/MimeService');

var _MimeService2 = _interopRequireDefault(_MimeService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Image = function () {
    function Image(file, hash) {
        _classCallCheck(this, Image);

        this.createFromUpload(file, hash);
    }

    _createClass(Image, [{
        key: 'createFromUpload',
        value: function createFromUpload(file, hash) {
            this.mimeType = file.mimetype;
            this.hash = hash;

            this.name = this.hash;
            var extension = _MimeService2.default.getFileExtension(this.mimeType);
            if (extension) {
                this.name += '.' + extension;
            }

            this.tags = ['tagme'];
        }
    }, {
        key: 'createFromDBObject',
        value: function createFromDBObject() {}
    }]);

    return Image;
}();

exports.default = Image;
;