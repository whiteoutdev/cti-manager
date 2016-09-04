import gulp from 'gulp';
import babel from 'gulp-babel';
import gulpif from 'gulp-if';
import del from 'del';
import nodemon from 'gulp-nodemon';
import eslint from 'gulp-eslint';

import config from './config';

const isJs = function(file) {
    return file.path.endsWith('.js');
};

gulp.task('server:db', ['server:build'], (cb) => {
    const rebuildDatabase = require('./scripts/rebuildDatabase').default;
    rebuildDatabase().then(cb);
});

gulp.task('server:dev', ['server:db'], () => {
    nodemon({
        script: `${config.root}/index.js`,
        args  : ['--dev'],
        tasks : 'server:build',
        ignore: config.lib
    });
});

gulp.task('server:clean', (cb) => {
    del([config.lib]).then(() => {
        cb();
    });
});

gulp.task('server:build', ['server:clean'], () => {
    return gulp.src(`${config.src}/**/*`)
        .pipe(gulpif(isJs, babel()))
        .pipe(gulp.dest(config.lib));
});

gulp.task('server:lint', () => {
    return gulp.src([`${config.src}/**/*.js`, `${config.src}/**/*.jsx`])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('server:qa', ['server:lint']);

export default gulp.tasks;
