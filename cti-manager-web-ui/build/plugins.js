import HtmlWebpackPlugin from 'html-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';

import config from './config';

export default function(prod) {
    const htmlPluginConfig = {
        inject  : 'body',
        template: config.app.indexEjs
    };

    const plugins = [
        new HtmlWebpackPlugin(htmlPluginConfig)
    ];

    if (prod) {
        Array.prototype.push.apply(plugins, [
            new CompressionPlugin({
                threshold: 1024
            })
        ]);
    }

    return plugins;

}
