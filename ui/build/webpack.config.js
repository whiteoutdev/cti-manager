import config from './config';
import rules from './rules';
import plugins from './plugins';

export default function(env) {
    const prod       = env === 'production',
          preset     = env.preset || 'std',
          presetData = require(`./preset.${preset}.json`);

    return {
        mode   : prod ? 'production' : 'development',
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
        plugins: plugins(prod, presetData),
        resolve: {
            extensions: ['.json', '.ts', '.tsx', '.js']
        },
        devtool: prod ? 'source-map' : 'inline-source-map'
    };
}
