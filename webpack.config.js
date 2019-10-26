const mainConfig     = require('./webpack/config.main'),
      rendererConfig = require('./webpack/config.renderer');

module.exports = [mainConfig, rendererConfig];
