import gulp from 'gulp';
import babel from 'gulp-babel';
import gulpif from 'gulp-if';
import del from 'del';
import nodemon from 'gulp-nodemon';

import config from './config';

const isJs = function(file) {
    return file.path.endsWith('.js');
};

gulp.task('db', ['build'], (cb) => {
    const rebuildDatabase = require('./scripts/rebuildDatabase').default;
    rebuildDatabase().then(cb);
});

gulp.task('dev', ['db'], () => {
    nodemon({
        script: `${config.root}/index.js`,
        tasks : 'build',
        ignore: config.lib
    });
});

gulp.task('clean', (cb) => {
    del([config.lib]).then(() => {
        cb();
    });
});

gulp.task('build', ['clean'], () => {
    return gulp.src(`${config.src}/**/*`)
        .pipe(gulpif(isJs, babel()))
        .pipe(gulp.dest(config.lib));
});
