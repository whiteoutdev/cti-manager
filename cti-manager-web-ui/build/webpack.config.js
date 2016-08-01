import config from './config';
import loaders from './loaders';
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
        loaders
    },
    plugins
};
