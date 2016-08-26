const express     = require('express'),
      compression = require('compression'),
      config      = require('./config').default,
      logger      = require('./logger');

const app  = express(),
      port = config.server.port;

app.use(compression());

app.use(express.static(config.dist.path));

app.listen(port, (err) => {
    if (err) {
        logger.error(err);
    }
    logger.info(`App listening on port ${port}`);
});
