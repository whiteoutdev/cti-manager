import RestApi from './RestApi';
import {Express, NextFunction, Request, Response} from 'express';
import {Passport} from 'passport';

export default class UserApi implements RestApi {
    public configure(app: Express, passport: Passport) {
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

function isLoggedIn(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.sendStatus(403);
}
