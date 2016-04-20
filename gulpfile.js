// =============================================================================
//  This file contains gulp tasks for automating the building process.
//  By the moment, there are only tasks for the front-end
// =============================================================================

var gulp    = require('gulp');
var inject  = require('gulp-inject');

// Inject all css and js client files into index.html
gulp.task('frontend:build', [], function(){
    var sources = gulp.src([
      './public/**/*.js',
      './common/**/*.js',
      './public/**/*.css'
    ], {read: false});
    gulp.src('./public/index.html')
        .pipe(inject(sources, { relative: true, removeTags: false }))
        .pipe(gulp.dest('./public/'));
});

gulp.task('default', ['frontend:build'], function(){});
