import gulp from 'gulp';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import gutil from 'gulp-util';
import eslint from 'gulp-eslint';

import config from './config';
import webpackConfig from './webpack.config';

gulp.task('ui:dev', () => {
    const compiler = webpack(webpackConfig('production'));

    new WebpackDevServer(compiler, {}).listen(config.devServer.port, config.devServer.host, (err) => {
        if (err) {
            gutil.log(err.stack);
            process.exit(2);
        }

        gutil.log(`Webpack Dev Server listening at http://${config.devServer.host}:${config.devServer.port}`);
    });
});

gulp.task('ui:lint', () => {
    return gulp.src([`${config.app.path}/**/*.js`, `${config.app.path}/**/*.jsx`])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('ui:qa', ['ui:lint']);

export default gulp.tasks;
