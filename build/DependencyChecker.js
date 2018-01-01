import chalk   from 'chalk';
import depcheck from 'depcheck';

export default class DependencyChecker {
    constructor(root, options) {
        this.root = root;
        this.options = options;
    }

    check() {
        try {
            depcheck(this.root, this.options, handleResults);
        } catch (err) {
            console.error(err);
        }
    }
}

function handleResults(unused) {
    let err = false;

    if (unused.dependencies.length) {
        err = true;
        console.log(chalk.red('Unused dependencies:'));
        listDependencies(unused.dependencies);
    }

    if (unused.devDependencies.length) {
        console.log('Unused');
        err = true;
        console.log(chalk.red('Unused dev dependencies:'));
        listDependencies(unused.devDependencies);
    }

    if (Object.keys(unused.missing).length) {
        err = true;
        console.log(chalk.red('Missing dependencies:'));
        listDependencies(Object.keys(unused.missing));
    }

    if (err) {
        process.exit(1);
    }
}

function listDependencies(deps) {
    deps.forEach(dep => {
        console.log(`    - ${dep}`);
    });
}
