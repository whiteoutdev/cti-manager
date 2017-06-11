import {NextFunction, Request, Response, Router} from 'express';
import {Passport} from 'passport';
import RestApi from './RestApi';

export default class UserApi implements RestApi {
    public configure(router: Router, passport: Passport): void {
        router.post('/login', passport.authenticate('local-login'), (req, res) => {
            if (req.user) {
                res.sendStatus(200);
            } else {
                res.sendStatus(403);
            }
        });

        router.get('/foo', isLoggedIn, (req, res) => {
            res.status(200).send({
                foo: 'bar'
            });
        });
    }
}

function isLoggedIn(req: Request, res: Response, next: NextFunction): void {
    if (req.isAuthenticated()) {
        return next();
    }

    res.sendStatus(403);
}
