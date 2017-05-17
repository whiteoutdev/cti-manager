'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RestApi2 = require('./RestApi');

var _RestApi3 = _interopRequireDefault(_RestApi2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UserApi = function (_RestApi) {
    _inherits(UserApi, _RestApi);

    function UserApi() {
        _classCallCheck(this, UserApi);

        return _possibleConstructorReturn(this, (UserApi.__proto__ || Object.getPrototypeOf(UserApi)).apply(this, arguments));
    }

    _createClass(UserApi, [{
        key: 'configure',
        value: function configure(app, passport) {
            app.post('/login', passport.authenticate('local-login'), function (req, res) {
                if (req.user) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(403);
                }
            });

            app.get('/foo', isLoggedIn, function (req, res) {
                res.status(200).send({
                    foo: 'bar'
                });
            });
        }
    }]);

    return UserApi;
}(_RestApi3.default);

exports.default = UserApi;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.sendStatus(403);
}