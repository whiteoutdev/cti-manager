import RestApi from './RestApi';

export default class UserApi extends RestApi {
    configure(app, passport) {
        app.post('/login', passport.authenticate('local-login'), (req, res) => {
            if (req.user) {
                res.sendStatus(200);
            } else {
                res.sendStatus(403);
            }
        });

        app.get('/foo', isLoggedIn, (req, res) => {
            res.status(200).send({
                foo: 'bar'
            });
        });
    }
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.sendStatus(403);
}
