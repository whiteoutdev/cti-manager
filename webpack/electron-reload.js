const createElectronReloadWebpackPlugin = require('electron-reload-webpack-plugin'),
      paths                             = require('./paths');

module.exports = createElectronReloadWebpackPlugin({
    path: paths.distFile('main.js')
})();
