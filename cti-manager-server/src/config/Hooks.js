import logger from '../util/logger';

process.on('SIGINT', () => {
    logger.info('SIGINT received. Exiting...');
    process.exit(2);
});

export default class Hooks {
    static onExit(cb) {
        if (typeof cb === 'function') {
            process.on('exit', () => {
                cb();
            });
        }
    }

    static onUncaughtException(cb) {
        if (typeof cb === 'function') {
            process.on('uncaughtException', (e) => {
                cb(e);
            });
        }
    }
}
