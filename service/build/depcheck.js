import packageJson       from '../package.json';
import DependencyChecker from '../../build/DependencyChecker';
import config            from './config';
import depcheck          from 'depcheck';

const depcheckDetectors   = Object.keys(depcheck.detector).map(key => depcheck.detector[key]),
      packageDependencies = (Object.keys(packageJson.dependencies) || [])
          .concat(Object.keys(packageJson.devDependencies || []));

check();

function check() {
    const options = {
        ignoreDirs: [
            'node_modules',
            'lib',
            'public'
        ],
        detectors : depcheckDetectors.concat([typesDetector]),
        parsers   : {
            '*.js'  : depcheck.parser.es6,
            '*.ts'  : depcheck.parser.typescript,
            '*.scss': depcheck.parser.sass
        },
        specials  : [
            depcheck.special.bin,
            ignoreSpecial
        ]
    };

    new DependencyChecker(config.root, options).check();
}

function typesDetector(node, deps) {
    let dependencies = [];
    depcheckDetectors.forEach(detector => {
        dependencies = dependencies.concat(detector(node, deps));
    });

    const additionalDeps = [];

    dependencies.forEach(dep => {
        if (packageDependencies.indexOf(`@types/${dep}`) !== -1) {
            additionalDeps.push(`@types/${dep}`);
        }
    });

    return dependencies.concat(additionalDeps);
}

function ignoreSpecial() {
    return [
        '@types/passport-strategy'
    ];
}
