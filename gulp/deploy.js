'use strict';

var build = require('./build');
var gulp = require('gulp');
var conf = require('./conf');

var userHome = require('user-home');
var clean = require('gulp-clean');

var replace = require('gulp-replace-task');

var servicesPath = 'src/app/common/services/';

gulp.task('change-url', function(cb) {
  gulp.src([servicesPath + 'apilaData.service.js', servicesPath + 'authentication.service.js'])
  .pipe(replace({
    patterns: [
      {
        match: /http:\/\/localhost:3300/g,
        replacement: function () {
          return '';
        }
      }
    ]
  }))
  .pipe(gulp.dest(servicesPath));

  cb();
});


gulp.task('run-build', ['change-url','build'], function(cb) {
  cb();
});


gulp.task('copy-client', function() {
  gulp.src([conf.paths.dist + '/**/*'])
      .pipe(gulp.dest(userHome + '/deploy/app_client'));
});

gulp.task('copy-api', function() {
  gulp.src(['!apila.js', '../api/**/*'])
      .pipe(gulp.dest(userHome + '/deploy/app_api'));
});


// gulp.task('deploy-clean', function(cb) {
//   gulp.src([userHome + '/deploy/app_client/scripts/', userHome + '/deploy/app_client/maps/'])
// 		.pipe(clean({force: true}));
// });

gulp.task('deploy', ['run-build'], function(cb) {
  gulp.src([conf.paths.dist + '/**/*'])
      .pipe(gulp.dest(userHome + '/deploy/app_client'));

  gulp.src(['!apila.js', '../api/**/*'])
      .pipe(gulp.dest(userHome + '/deploy/app_api'));

  gulp.src([servicesPath + 'apilaData.service.js', servicesPath + 'authentication.service.js'])
      .pipe(replace({
        patterns: [
          {
            match: /apiUrl=\"/g,
            replacement: function () {
              return 'apiUrl="http://localhost:3300';
            }
          }
        ]
      }))
      .pipe(gulp.dest(servicesPath));


});
