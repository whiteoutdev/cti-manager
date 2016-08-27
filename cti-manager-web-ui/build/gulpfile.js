import gulp from 'gulp';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import gutil from 'gulp-util';

import config from './config';
import webpackConfig from './webpack.config';

gulp.task('ui:dev', () => {
    webpackConfig.entry.unshift(`webpack-dev-server/client?http://${config.devServer.host}:${config.devServer.port}/`);
    const compiler = webpack(webpackConfig);

    new WebpackDevServer(compiler, {}).listen(config.devServer.port, config.devServer.host, (err) => {
        if (err) {
            gutil.log(err.stack);
            process.exit(2);
        }

        gutil.log(`Webpack Dev Server listening at http://${config.devServer.host}:${config.devServer.port}`);
    });
});
