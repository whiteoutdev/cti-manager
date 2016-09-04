'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

var _RestApi2 = require('./RestApi');

var _RestApi3 = _interopRequireDefault(_RestApi2);

var _upload = require('./upload');

var _upload2 = _interopRequireDefault(_upload);

var _ImageCollection = require('../store/ImageCollection');

var _ImageCollection2 = _interopRequireDefault(_ImageCollection);

var _TagCollection = require('../store/TagCollection');

var _TagCollection2 = _interopRequireDefault(_TagCollection);

var _ExceptionWrapper = require('../model/exception/ExceptionWrapper');

var _ExceptionWrapper2 = _interopRequireDefault(_ExceptionWrapper);

var _CTIError = require('../model/exception/CTIError');

var _CTIError2 = _interopRequireDefault(_CTIError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ImagesApi = function (_RestApi) {
    _inherits(ImagesApi, _RestApi);

    function ImagesApi() {
        _classCallCheck(this, ImagesApi);

        return _possibleConstructorReturn(this, (ImagesApi.__proto__ || Object.getPrototypeOf(ImagesApi)).apply(this, arguments));
    }

    _createClass(ImagesApi, [{
        key: 'configure',
        value: function configure(app) {
            app.post('/images', _upload2.default.array('images'), function (req, res, next) {
                _logger2.default.debug('Image upload request received for ' + req.files.length + ' images');
                _ImageCollection2.default.addImages(req.files).then(function (exceptionWrapper) {
                    res.status(200).send(exceptionWrapper);
                });
            });

            app.get('/images', function (req, res) {
                _logger2.default.debug('Image metadata requested');
                var query = req.query,
                    skip = Number(query.skip),
                    limit = Number(query.limit);
                var tags = null;
                if (query.tags) {
                    var tagsString = req.url.match(/tags=([^&]+)/)[1];
                    tags = tagsString.split(',').map(function (encodedTag) {
                        return decodeURIComponent(encodedTag);
                    });
                }
                _ImageCollection2.default.getImages(tags, skip, limit).then(function (info) {
                    res.status(200).send(info);
                }).catch(function (err) {
                    _logger2.default.error(err);
                    res.status(500).send(err);
                });
            });

            app.get('/images/:imageIDHex', function (req, res) {
                var imageIDHex = req.params.imageIDHex;
                _logger2.default.debug('Image metadata requested for image ID: ' + imageIDHex);
                _ImageCollection2.default.getImage(imageIDHex).then(function (imageMetadata) {
                    if (imageMetadata) {
                        res.status(200).send(imageMetadata);
                    } else {
                        res.sendStatus(404);
                    }
                }).catch(function (err) {
                    _logger2.default.error(err);
                    res.status(500).send(err);
                });
            });

            app.get('/images/:imageIDHex/download', function (req, res) {
                var imageIDHex = req.params.imageIDHex;
                _logger2.default.debug('Image download requested for image ID: ' + imageIDHex);
                _ImageCollection2.default.downloadImage(imageIDHex).then(function (data) {
                    ImagesApi.downloadFromFileInfo(res, data);
                }).catch(function (err) {
                    _logger2.default.error(err);
                    res.status(500).send(err);
                });
            });

            app.get('/images/:imageIDHex/thumbnail', function (req, res) {
                var imageIDHex = req.params.imageIDHex;
                _logger2.default.debug('Image thumbnail requested for image ID: ' + imageIDHex);
                _ImageCollection2.default.getThumbnail(imageIDHex).then(function (thumbnail) {
                    res.status(200).send(thumbnail);
                }).catch(function (err) {
                    _logger2.default.error(err);
                    res.status(500).send(err);
                });
            });

            app.get('/images/:imageIDHex/thumbnail/download', function (req, res) {
                var imageIDHex = req.params.imageIDHex;
                _logger2.default.debug('Image thumbnail download requested for image ID: ' + imageIDHex);
                _ImageCollection2.default.downloadThumbnail(imageIDHex).then(function (data) {
                    ImagesApi.downloadFromFileInfo(res, data);
                }).catch(function (err) {
                    _logger2.default.error(err);
                    res.status(500).send(err);
                });
            });

            app.post('/images/:imageIDHex/tags', function (req, res) {
                var imageIDHex = req.params.imageIDHex,
                    tags = req.body.tags;
                _logger2.default.debug('Image tags update requested for image ID: ' + imageIDHex);
                Promise.all([_ImageCollection2.default.setTags(imageIDHex, tags), _TagCollection2.default.createTags(tags)]).then(function (results) {
                    var image = results[0];
                    if (image) {
                        res.status(200).send(image);
                    } else {
                        res.sendStatus(404);
                    }
                }).catch(function (err) {
                    _logger2.default.error(err);
                    res.status(500).send(err);
                });
            });
        }
    }], [{
        key: 'downloadFromFileInfo',
        value: function downloadFromFileInfo(res, data) {
            var mimeType = data.doc.mimeType;
            res.set({
                'Content-Type': mimeType
            });

            var downloadStream = data.stream;
            downloadStream.on('error', function (err) {
                var exception = new _CTIError2.default('Download failed', err),
                    exceptionWrapper = new _ExceptionWrapper2.default(undefined, undefined, [exception]);
                res.status(500).send(exceptionWrapper);
            });
            data.stream.pipe(res);
        }
    }]);

    return ImagesApi;
}(_RestApi3.default);

exports.default = ImagesApi;