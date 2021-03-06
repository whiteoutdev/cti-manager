import * as bunyan from 'bunyan';
import appConfig from '../config/app.config';

const logger = bunyan.createLogger({
    name : 'cti-manager',
    level: appConfig.dev ? 'debug' : 'info'
});

logger.info(`CTI Manager version ${appConfig.version}`);
appConfig.dev && logger.info('Application running in development mode');

export default logger;
