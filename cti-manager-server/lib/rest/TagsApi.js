'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

var _RestApi2 = require('./RestApi');

var _RestApi3 = _interopRequireDefault(_RestApi2);

var _TagCollection = require('../store/TagCollection');

var _TagCollection2 = _interopRequireDefault(_TagCollection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TagsApi = function (_RestApi) {
    _inherits(TagsApi, _RestApi);

    function TagsApi() {
        _classCallCheck(this, TagsApi);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(TagsApi).apply(this, arguments));
    }

    _createClass(TagsApi, [{
        key: 'configure',
        value: function configure(app) {
            app.get('/tags', function (req, res) {
                var query = req.query,
                    search = query.query,
                    skip = Number(query.skip),
                    limit = Number(query.limit);
                _TagCollection2.default.getTags(search, skip, limit).then(function (tags) {
                    res.status(200).send(tags);
                });
            });

            app.get('/tags/:tag', function (req, res) {
                _logger2.default.debug('Tags requested');
                var tag = decodeURIComponent(req.params.tag);
                _TagCollection2.default.getTag(tag).then(function (tag) {
                    if (tag) {
                        res.status(200).send(tag);
                    } else {
                        res.sendStatus(404);
                    }
                });
            });

            app.post('/tags', function (req, res) {
                _logger2.default.debug('Tag creation requested');
                var tags = req.body.tags.map(function (tag) {
                    return decodeURIComponent(tag);
                });
                _TagCollection2.default.createTags(tags).then(function (tagsCreated) {
                    if (tagsCreated) {
                        res.status(201).send(tagsCreated);
                    } else {
                        res.sendStatus(200);
                    }
                });
            });

            app.get('/tagtypes', function (req, res) {
                _logger2.default.debug('Tag types requested');
                res.status(200).send(_TagCollection2.default.getTagTypeNames());
            });
        }
    }]);

    return TagsApi;
}(_RestApi3.default);

exports.default = TagsApi;