import path from 'path';
import gulp from 'gulp';
import gulpif from 'gulp-if';
import del from 'del';
import nodemon from 'gulp-nodemon';
import ts from 'gulp-typescript';
import tslint from 'gulp-tslint';

import config from './config';

const isTs = function(file) {
    return file.path.endsWith('.ts');
};

gulp.task('server:db', ['server:build'], (cb) => {
    const rebuildDatabase = require('../lib/scripts/rebuildDatabase').default;
    rebuildDatabase().then(cb);
});

gulp.task('server:dev', ['server:db'], () => {
    nodemon({
        script: `${config.root}/index.js`,
        args  : ['--dev'],
        tasks : 'server:build',
        watch : [config.src],
        ignore: config.lib
    });
});

gulp.task('server:clean', (cb) => {
    del([config.lib]).then(() => {
        cb();
    });
});

gulp.task('server:build', ['server:clean'], () => {
    const tsProject = ts.createProject(path.resolve(__dirname, '..', 'tsconfig.json'));

    return gulp.src(`${config.src}/**/*`)
        .pipe(gulpif(isTs, tsProject()))
        .pipe(gulp.dest(config.lib));
});

gulp.task('server:lint', () => {
    return gulp.src([`${config.src}/**/*.ts`])
        .pipe(tslint({
            configuration: `${config.root}/tslint.json`,
            fix          : true,
            formatter    : 'stylish',
        }))
        .pipe(tslint.report({
            emitError             : true,
            summarizeFailureOutput: true
        }));
});

gulp.task('server:qa', ['server:lint']);

export default gulp.tasks;
