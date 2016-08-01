'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mimeToExtensionMappings = {
    'image/jpeg': 'jpg',
    'image/pjpeg': 'jpg',
    'image/png': 'png',
    'image/bmp': 'bmp',
    'image/x-windows-bmp': 'bmp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg'
};

var MimeService = function () {
    function MimeService() {
        _classCallCheck(this, MimeService);
    }

    _createClass(MimeService, null, [{
        key: 'getFileExtension',
        value: function getFileExtension(mimeType) {
            return mimeToExtensionMappings[mimeType];
        }
    }]);

    return MimeService;
}();

exports.default = MimeService;