import appConfig from '../config/app.config';
import * as bunyan from 'bunyan';

const logger = bunyan.createLogger({
    name : 'cti-manager',
    level: appConfig.dev ? 'debug' : 'info'
});

logger.info(`CTI Manager version ${appConfig.version}`);
appConfig.dev && logger.info('dev mode enabled');

export default logger;
