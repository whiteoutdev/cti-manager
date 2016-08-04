import del from 'del';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import appConfig from './config/app.config';
import logger from './util/logger';
import RestConfig from './rest/RestConfig';

del([`${appConfig.tmpDir}/**`, `!${appConfig.tmpDir}`]).then((paths) => {
    if (paths.length) {
        paths.forEach((path) => {
            logger.debug(`Removed temporary file: ${path}`);
        });
        logger.info(`Cleaned up ${paths.length} temporary files`);
    }
});

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

RestConfig.configure(app);

app.listen(appConfig.api.port, () => {
    logger.info(`CTI Manager API listening on port ${appConfig.api.port}`);
});
