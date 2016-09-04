'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var hashAlgorithm = 'sha256';

var HashService = function () {
    function HashService() {
        _classCallCheck(this, HashService);
    }

    _createClass(HashService, null, [{
        key: 'getHash',
        value: function getHash(filePath) {
            return new Promise(function (resolve) {
                var hash = _crypto2.default.createHash(hashAlgorithm),
                    stream = _fs2.default.createReadStream(filePath);
                stream.on('data', function (chunk) {
                    hash.update(chunk, 'utf8');
                });
                stream.on('end', function () {
                    resolve(hash.digest('hex'));
                });
            });
        }
    }]);

    return HashService;
}();

exports.default = HashService;