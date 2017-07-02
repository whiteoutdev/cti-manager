import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as del from 'del';
import * as express from 'express';
import * as morgan from 'morgan';
import {Passport} from 'passport';
import * as path from 'path';

import appConfig from './config/app.config';
import Hooks from './config/Hooks';
import configurePassport from './config/passport.config';
import RestConfig from './rest/RestConfig';
import logger from './util/logger';

const passport = new Passport() as Passport;

configurePassport(passport);

del([
    `${appConfig.tmpDir}/**`, `!${appConfig.tmpDir}`
]).then(paths => {
    if (paths.length) {
        paths.forEach(path => {
            logger.debug(`Removed temporary file: ${path}`);
        });
        logger.info(`Cleaned up ${paths.length} temporary files`);
    }
});

const app       = express(),
      apiRouter = express.Router();

app.use(morgan(appConfig.dev ? 'dev' : 'combined'));

const corsOptions = {
    credentials: true,
    origin     : (origin: string, cb: (err: any, allowed: boolean) => any) => {
        cb(null, true);
    }
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(passport.initialize());

RestConfig.configure(apiRouter, passport.authenticate('jwt', {session: false}));
app.use('/api', apiRouter);

app.listen(appConfig.api.port, () => {
    logger.info(`CTI Manager API listening on port ${appConfig.api.port}`);
});

app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});

Hooks.onUncaughtException(err => {
    logger.error('Uncaught Exception:');
    logger.error(err.message);
    logger.error(err.stack);
});
