import {Passport} from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';

import User from '../model/user/User';
import UserCollection from '../store/UserCollection';
import CryptoService from '../util/CryptoService';
import logger from '../util/logger';

export default function(passport: Passport): void {
    logger.info('Configuring passport...');

    passport.serializeUser((user: User, done) => {
        logger.debug(`Serialize user: ${JSON.stringify(user)}`);
        done(null, user.getUsername());
    });

    passport.deserializeUser((id: string, done) => {
        logger.debug(`Deserialized user ID ${id}`);
        UserCollection.findUser(id)
            .then((user: User) => {
                done(null, user);
            });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, (username, password, done) => {
        logger.debug('Authenticating...');
        UserCollection.findUser(username)
            .then((user: User) => {
                logger.debug(`User found: ${user.getId()}`);

                if (!user) {
                    const message = `User ${username} not found`;
                    logger.debug(message);
                    return done(null, false, {message});
                }

                if (!CryptoService.validatePassword(password, user.getPassword())) {
                    const message = `Invalid password for user ${username}`;
                    logger.debug(message);
                    return done(null, false, {message});
                }

                return done(null, user);
            });
    }));
}