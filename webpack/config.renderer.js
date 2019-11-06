const DefinePlugin         = require('webpack').DefinePlugin,
      HtmlWebpackPlugin    = require('html-webpack-plugin'),
      paths                = require('./paths'),
      commonRules          = require('./rules.common'),
      electronReloadPlugin = require('./electron-reload');

module.exports = function(env, argv) {
    const mode = argv.mode || 'development';

    return {
        mode,
        entry  : paths.renderer,
        module : {
            rules: commonRules.concat([
                {
                    test: /\.s?css$/,
                    use : ['style-loader', 'css-loader', 'sass-loader']
                }
            ])
        },
        output : {
            path    : paths.dist,
            filename: 'renderer.js'
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: paths.index
            }),
            new DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(mode)
            }),
            mode === 'development' && electronReloadPlugin
        ].filter(Boolean),
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
        },
        target : 'electron-renderer',
        watch  : !!argv.watch
    };
};
