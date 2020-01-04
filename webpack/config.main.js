const paths                = require('./paths'),
      commonRules          = require('./rules.common'),
      electronReloadPlugin = require('./electron-reload');

module.exports = function(env, argv) {
    const mode = argv.mode || 'development';

    return {
        mode,
        entry  : paths.main,
        module : {
            rules: commonRules
        },
        node   : {
            __dirname: false
        },
        output : {
            path    : paths.dist,
            filename: 'main.js'
        },
        plugins: [
            mode === 'development' && electronReloadPlugin
        ].filter(Boolean),
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
        },
        target : 'electron-main'
    };
};
