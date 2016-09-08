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

var _MediaCollection = require('../store/MediaCollection');

var _MediaCollection2 = _interopRequireDefault(_MediaCollection);

var _TagCollection = require('../store/TagCollection');

var _TagCollection2 = _interopRequireDefault(_TagCollection);

var _ExceptionWrapper = require('../model/exception/ExceptionWrapper');

var _ExceptionWrapper2 = _interopRequireDefault(_ExceptionWrapper);

var _CTIError = require('../model/exception/CTIError');

var _CTIError2 = _interopRequireDefault(_CTIError);

var _MimeService = require('../util/MimeService');

var _MimeService2 = _interopRequireDefault(_MimeService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MediaApi = function (_RestApi) {
    _inherits(MediaApi, _RestApi);

    function MediaApi() {
        _classCallCheck(this, MediaApi);

        return _possibleConstructorReturn(this, (MediaApi.__proto__ || Object.getPrototypeOf(MediaApi)).apply(this, arguments));
    }

    _createClass(MediaApi, [{
        key: 'configure',
        value: function configure(app) {
            app.post('/media', _upload2.default.array('media'), function (req, res) {
                _logger2.default.debug('Media upload request received for ' + req.files.length + ' files');
                _MediaCollection2.default.addMedia(req.files).then(function (exceptionWrapper) {
                    res.status(200).send(exceptionWrapper);
                });
            });

            app.get('/media', function (req, res) {
                _logger2.default.debug('Media metadata requested');
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
                _MediaCollection2.default.findMedia(tags, skip, limit).then(function (info) {
                    res.status(200).send(info);
                }).catch(function (err) {
                    _logger2.default.error(err);
                    res.status(500).send(err);
                });
            });

            app.get('/media/:mediaIDHex', function (req, res) {
                var mediaIDHex = req.params.mediaIDHex;
                _logger2.default.debug('Media metadata requested for media ID: ' + mediaIDHex);
                _MediaCollection2.default.getMedia(mediaIDHex).then(function (metadata) {
                    if (metadata) {
                        res.status(200).send(metadata);
                    } else {
                        res.sendStatus(404);
                    }
                }).catch(function (err) {
                    _logger2.default.error(err);
                    res.status(500).send(err);
                });
            });

            app.get('/media/:mediaIDHex/download', function (req, res) {
                var mediaIDHex = req.params.mediaIDHex;
                _logger2.default.debug('Media download requested for media ID: ' + mediaIDHex);
                _MediaCollection2.default.downloadMedia(mediaIDHex).then(function (data) {
                    MediaApi.downloadFromFileInfo(res, data);
                }).catch(function (err) {
                    _logger2.default.error(err);
                    res.status(500).send(err);
                });
            });

            app.get('/media/:mediaIDHex/thumbnail', function (req, res) {
                var mediaIDHex = req.params.mediaIDHex;
                _logger2.default.debug('Media thumbnail requested for media ID: ' + mediaIDHex);
                _MediaCollection2.default.getThumbnail(mediaIDHex).then(function (thumbnail) {
                    res.status(200).send(thumbnail);
                }).catch(function (err) {
                    _logger2.default.error(err);
                    res.status(500).send(err);
                });
            });

            app.get('/media/:mediaIDHex/thumbnail/download', function (req, res) {
                var mediaIDHex = req.params.mediaIDHex;
                _logger2.default.debug('Media thumbnail download requested for media ID: ' + mediaIDHex);
                _MediaCollection2.default.downloadThumbnail(mediaIDHex).then(function (data) {
                    MediaApi.downloadFromFileInfo(res, data);
                }).catch(function (err) {
                    _logger2.default.error(err);
                    res.status(500).send(err);
                });
            });

            app.post('/media/:mediaIDHex/tags', function (req, res) {
                var mediaIDHex = req.params.mediaIDHex,
                    tags = req.body.tags;
                _logger2.default.debug('Media tags update requested for media ID: ' + mediaIDHex);
                Promise.all([_MediaCollection2.default.setTags(mediaIDHex, tags), _TagCollection2.default.createTags(tags)]).then(function (results) {
                    var media = results[0];
                    if (media) {
                        res.status(200).send(media);
                    } else {
                        res.sendStatus(404);
                    }
                }).catch(function (err) {
                    _logger2.default.error(err);
                    res.status(500).send(err);
                });
            });

            app.get('/mediatypes', function (req, res) {
                res.status(200).send(_MimeService2.default.getSupportedMimeTypes());
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

    return MediaApi;
}(_RestApi3.default);

exports.default = MediaApi;