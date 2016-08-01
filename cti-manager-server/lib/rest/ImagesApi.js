'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

var _RestApi2 = require('./RestApi');

var _RestApi3 = _interopRequireDefault(_RestApi2);

var _upload = require('./upload');

var _upload2 = _interopRequireDefault(_upload);

var _ImageCollection = require('../store/ImageCollection');

var _ImageCollection2 = _interopRequireDefault(_ImageCollection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ImagesApi = function (_RestApi) {
    _inherits(ImagesApi, _RestApi);

    function ImagesApi() {
        _classCallCheck(this, ImagesApi);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ImagesApi).apply(this, arguments));
    }

    _createClass(ImagesApi, [{
        key: 'configure',
        value: function configure(app) {
            app.post('/images', _upload2.default.array('images'), function (req, res, next) {
                _logger2.default.debug('Image upload request received for ' + req.files.length + ' images');
                _ImageCollection2.default.addImages(req.files).then(function () {
                    res.status(200).end();
                });
            });

            app.get('/images', function (req, res) {
                var query = req.query;
                var tags = query.tags,
                    limit = query.limit;
                if (tags) {
                    tags = tags.split(',');
                }
                if (limit) {
                    limit = Number(limit);
                }
                _ImageCollection2.default.findImages(tags, limit).then(function (docs) {
                    res.status(200).send(docs);
                });
            });

            app.get('/images/:imageIDHex', function (req, res) {
                var imageIDHex = req.params.imageIDHex;
                _logger2.default.debug('Image Download requested for image ID: ' + imageIDHex);
                _ImageCollection2.default.downloadImage(imageIDHex).then(function (imageInfo) {
                    res.sendFile(imageInfo.path, {
                        root: _path2.default.resolve(__dirname, '../..')
                    }, function (err) {
                        if (err) {
                            res.sendStatus(500);
                        }
                        (0, _del2.default)([imageInfo.path]).then(function () {
                            _logger2.default.debug('Deleted temporary file: ' + imageInfo.path);
                        });
                    });
                });
            });
        }
    }]);

    return ImagesApi;
}(_RestApi3.default);

exports.default = ImagesApi;