import config from './config';
import rules from './rules';
import plugins from './plugins';

export default {
    context: config.app.path,
    entry  : [
        './index.jsx'
    ],
    output : {
        path    : config.dist.path,
        filename: 'cti-manager.js'
    },
    module : {
        rules
    },
    plugins,
    resolve: {
        extensions: [".js", ".jsx", ".json"]
    },
    devtool: 'inline-source-map'
};
