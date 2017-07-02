import logger from '../util/logger';

process.on('SIGINT', () => {
    logger.info('SIGINT received. Exiting...');
    process.exit(2);
});

export default class Hooks {
    public static onExit(cb: () => void): void {
        if (typeof cb === 'function') {
            process.on('exit', cb);
        }
    }

    public static onUncaughtException(cb: (e: Error) => void): void {
        if (typeof cb === 'function') {
            process.on('uncaughtException', cb);
        }
    }
}
