import HtmlWebpackPlugin from 'html-webpack-plugin';

import config from './config';

const htmlPluginConfig = {
    inject  : 'body',
    template: config.app.indexEjs
};

const plugins = [
    new HtmlWebpackPlugin(htmlPluginConfig)
];

export default plugins;
