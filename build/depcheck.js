import  depcheck     from 'depcheck';
import DependencyChecker from './DependencyChecker';
import config  from './config';

const depcheckDetectors = Object.keys(depcheck.detector).map(key => depcheck.detector[key]);

check();

function check() {
    const options = {
        ignoreDirs: [
            'node_modules',
            'cti-manager-server',
            'cti-manager-web-ui',
            'tmp'
        ],
        detectors : depcheckDetectors,
        parsers   : {
            '*.js': depcheck.parser.es6
        },
        specials  : [
            depcheck.special.bin,
            depcheck.special.babel,
            ignoreSpecial
        ]
    };

    new DependencyChecker(config.root, options).check();
}

function ignoreSpecial() {
    return [
        'bunyan'
    ];
}
