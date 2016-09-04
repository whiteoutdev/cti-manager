import gulp from 'gulp';
import _ from 'lodash';

import serverTasks from './cti-manager-server/build/gulpfile';
import uiTasks from './cti-manager-web-ui/build/gulpfile';

gulp.tasks = _.extend({}, serverTasks, uiTasks);

gulp.task('dev', ['server:dev', 'ui:dev']);

gulp.task('qa', ['server:qa', 'ui:qa']);
