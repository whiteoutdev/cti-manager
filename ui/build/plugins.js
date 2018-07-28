import {DefinePlugin} from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';

import config from './config';

export default function(prod, presetData) {
    const htmlPluginConfig = {
        inject  : 'body',
        template: config.app.indexEjs
    };

    const plugins = [
        new HtmlWebpackPlugin(htmlPluginConfig),
        new DefinePlugin({
            presetData: JSON.stringify(presetData)
        })
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
