import {RequestHandler, Response, Router} from 'express';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import appConfig from '../config/app.config';
import CTIError from '../model/exception/CTIError';
import User from '../model/user/User';
import UserCollection from '../store/UserCollection';
import CryptoService from '../util/CryptoService';
import logger from '../util/logger';
import SecretService from '../util/SecretService';
import RestApi from './RestApi';

const authenticationFailureMessage = 'Username or password incorrect';

export default class UserApi implements RestApi {
    public configure(router: Router, authenticate: RequestHandler): Promise<any> {
        router.post('/login', (req, res) => {
            const username = req.body.username,
                  password = req.body.password;

            if (!username || !password) {
                const err = new CTIError('Username or password not supplied to login');
                return res.status(400).send(err);
            }

            logger.debug(`Authenticating user ${username}`);

            const promises: Array<Promise<any>> = [
                SecretService.getJwtSecret(),
                UserCollection.findByUsername(username)
            ];

            Promise.all(promises)
                .then((result: any[]) => {
                    const secret = result[0] as Buffer,
                          user   = result[1] as User;

                    if (!user) {
                        logger.debug(`User ${username} not found`);
                        return sendAuthenticationError(res);
                    }

                    logger.debug(`User ${username} found`);

                    if (!CryptoService.validatePassword(password, user.getPassword())) {
                        logger.debug(`Invalid password for user ${username}`);
                        return sendAuthenticationError(res);
                    }

                    logger.debug(`User ${username} authenticated successfully`);

                    const payload = {
                              id : user.getId(),
                              exp: moment().add(12, 'hours').unix()
                          },
                          token   = jwt.sign(payload, secret);

                    res.cookie(appConfig.authCookieName, token)
                        .status(200)
                        .end();
                });
        });

        router.get('/user', authenticate, (req, res) => {
            if (!req.user) {
                return res.status(500).end();
            }

            res.status(200).send(req.user.serialiseToApi());
        });

        return Promise.resolve();
    }
}

function sendAuthenticationError(res: Response): void {
    const err = new CTIError(authenticationFailureMessage);
    res.status(401).send(err);
}
