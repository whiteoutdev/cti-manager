'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mimeToExtensionMappings = {
    'image/jpeg': 'jpg',
    'image/pjpeg': 'jpg',
    'image/png': 'png',
    'image/bmp': 'bmp',
    'image/x-windows-bmp': 'bmp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'video/webm': 'webm',
    'video/mp4': 'mp4',
    'video/ogg': 'ogv'
},
    supportedImageMimeTypes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'],
    supportedVideoMimeTypes = ['video/webm', 'video/mp4', 'video/ogg'],
    supportedMimeTypes = _lodash2.default.concat(supportedImageMimeTypes, supportedVideoMimeTypes);

var MimeService = function () {
    function MimeService() {
        _classCallCheck(this, MimeService);
    }

    _createClass(MimeService, null, [{
        key: 'getFileExtension',
        value: function getFileExtension(mimeType) {
            return mimeToExtensionMappings[mimeType];
        }
    }, {
        key: 'getSupportedImageTypes',
        value: function getSupportedImageTypes() {
            return supportedImageMimeTypes.slice();
        }
    }, {
        key: 'getSupportedVideoTypes',
        value: function getSupportedVideoTypes() {
            return supportedVideoMimeTypes.slice();
        }
    }, {
        key: 'getSupportedMimeTypes',
        value: function getSupportedMimeTypes() {
            return supportedMimeTypes.slice();
        }
    }]);

    return MimeService;
}();

exports.default = MimeService;