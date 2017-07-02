import depcheck from 'depcheck';
import DependencyChecker from '../../../build/DependencyChecker';
import config from '../config';
import webpackSpecial from './webpackSpecial';
import eslintSpecial from './eslintSpecial';

const depcheckDetectors = Object.keys(depcheck.detector).map(key => depcheck.detector[key]);

check();

function check() {
    const options = {
        ignoreDirs: [
            'node_modules',
            'dist'
        ],
        detectors : depcheckDetectors,
        parsers   : {
            '*.js' : depcheck.parser.es6,
            '*.jsx': depcheck.parser.jsx
        },
        specials  : [
            depcheck.special.bin,
            depcheck.special.babel,
            eslintSpecial,
            webpackSpecial,
            ignoreSpecial
        ]
    };

    new DependencyChecker(config.root, options).check();
}

function ignoreSpecial() {
    return [
        'webpack-dev-server'
    ];
}
