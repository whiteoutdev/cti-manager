import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';

import config from './config';

const htmlPluginConfig = {
    inject: 'body',
    template: config.app.indexEjs
};

const plugins = [
    new HtmlWebpackPlugin(htmlPluginConfig)
];

if (config.prod) {
    Array.prototype.push.apply(plugins, [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new CompressionPlugin({
            threshold: 1024
        })
    ]);
}

export default plugins;
