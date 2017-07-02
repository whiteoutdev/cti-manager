import config from './config';
import rules from './rules';
import plugins from './plugins';

export default function(env) {
    const prod = env === 'production';

    return {
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
        plugins: plugins(prod),
        resolve: {
            extensions: ['.js', '.jsx', '.json']
        },
        devtool: prod ? 'source-map' : 'inline-source-map'
    };
}
