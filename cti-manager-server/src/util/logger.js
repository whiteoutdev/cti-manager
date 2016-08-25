import bunyan from 'bunyan';

const logger = bunyan.createLogger({name: 'cti-manager'});

export default logger;
