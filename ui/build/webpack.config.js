import config from './config';
import rules from './rules';
import plugins from './plugins';

export default function(env) {
    const prod = env === 'production';

    return {
        context: config.app.path,
        entry  : [
            './index.tsx'
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
            extensions: ['.json', '.ts', '.tsx']
        },
        devtool: prod ? 'source-map' : 'inline-source-map'
    };
}
