import del from 'del';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import morgan from 'morgan';

import appConfig from './config/app.config';
import configurePassport from './config/passport.config';
import logger from './util/logger';
import RestConfig from './rest/RestConfig';
import Hooks from './config/Hooks';

configurePassport(passport);

del([`${appConfig.tmpDir}/**`, `!${appConfig.tmpDir}`]).then((paths) => {
    if (paths.length) {
        paths.forEach((path) => {
            logger.debug(`Removed temporary file: ${path}`);
        });
        logger.info(`Cleaned up ${paths.length} temporary files`);
    }
});

const app = express();

app.use(morgan('dev'));
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(session({
    secret:            'dev mode secret',
    resave:            false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

RestConfig.configure(app, passport);

app.listen(appConfig.api.port, () => {
    logger.info(`CTI Manager API listening on port ${appConfig.api.port}`);
});

Hooks.onUncaughtException((e) => {
    logger.error('Uncaught Exception:');
    logger.error(e.message);
    logger.error(e.stack);
});
