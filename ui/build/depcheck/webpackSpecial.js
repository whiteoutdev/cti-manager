import path from 'path';
import _ from 'lodash';

import 'babel-register';

const webpackConfigRegex = /webpack(\..+)?\.config(\..+)?\.js/,
      loaderTemplates    = ['*-webpack-loader', '*-web-loader', '*-loader', '*'];

function extractLoadersFromUse(use) {
    use = use instanceof Array ? use : [use];

    return use.map(useEntry => {
        return typeof useEntry === 'string' ? useEntry : useEntry.loader || '';
    });
}

function extractLoadersFromRule(rule) {
    if (rule.loader) {
        return rule.loader.split('!');
    } else if (rule.loaders || rule.use) {
        return extractLoadersFromUse(rule.loaders || rule.use);
    }

    return [];
}

function stripQueryParameter(loader) {
    const index = loader.indexOf('?');
    return index === -1 ? loader : loader.substring(0, index);
}

function normalizeLoader(deps, loader) {
    return _(loaderTemplates)
        .map(template => template.replace('*', loader))
        .intersection(deps)
        .first();
}

function getLoaders(deps, rules) {
    rules = rules || [];
    return _(rules).map(extractLoadersFromRule)
        .flatten()
        .map(stripQueryParameter)
        .map(loader => normalizeLoader(deps, loader))
        .filter(Boolean)
        .uniq()
        .value();
}

export default function parseWebpack(content, filepath, deps) {
    const filename = path.basename(filepath);
    if (webpackConfigRegex.test(filename)) {
        try {
            let webpackConfig = require(filepath) || {};

            if (webpackConfig.default) {
                webpackConfig = webpackConfig.default;
            }

            if (typeof webpackConfig === 'function') {
                webpackConfig = webpackConfig();
            }

            const module = webpackConfig.module,
                  rules  = module.rules || {};

            return getLoaders(deps, rules);
        } catch (err) {
            console.error(err);
        }
    }

    return [];
}
