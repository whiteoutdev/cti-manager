import {Passport} from 'passport';
import {ExtractJwt, Strategy as JwtStrategy} from 'passport-jwt';
import UserCollection from '../store/UserCollection';
import logger from '../util/logger';
import SecretService from '../util/SecretService';

export default function(passport: Passport): void {
    logger.info('Configuring passport...');

    SecretService.getJwtSecret()
        .then((secret) => {
            passport.use(new JwtStrategy({
                secretOrKey   : secret,
                jwtFromRequest: ExtractJwt.fromAuthHeader()
            }, (payload, done) => {
                if (!payload || !payload.id) {
                    return done(null, false);
                }

                logger.debug(`User ID ${payload.id} authenticated via JWT`);

                UserCollection.findById(payload.id)
                    .then((user) => {
                        if (!user) {
                            return done(null, false);
                        }

                        return done(null, user);
                    });
            }));
        });
}
