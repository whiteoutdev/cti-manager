import {Strategy as LocalStrategy} from 'passport-local';

import logger from '../util/logger';
import CryptoService from '../util/CryptoService';
import UserCollection from '../store/UserCollection';

export default function(passport) {
    logger.info('Configuring passport...');

    passport.serializeUser((user, done) => {
        logger.debug(`Serialize user: ${JSON.stringify(user)}`);
        done(null, user.username);
    });

    passport.deserializeUser((id, done) => {
        logger.debug(`Deserialized user ID ${id}`);
        UserCollection.findUser(id)
            .then((user) => {
                done(null, user);
            });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, (username, password, done) => {
        logger.debug('Authenticating...');
        UserCollection.findUser(username)
            .then((user) => {
                logger.debug(`User found: ${user.id}`);

                if (!user) {
                    const message = `User ${username} not found`;
                    logger.debug(message);
                    return done(null, false, {message});
                }

                if (!CryptoService.validatePassword(password, user.password)) {
                    const message = `Invalid password for user ${username}`;
                    logger.debug(message);
                    return done(null, false, {message});
                }

                return done(null, user);
            });
    }));
}
