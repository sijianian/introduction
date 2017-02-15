import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins'
import browserSync from 'browser-sync'

const $ = gulpLoadPlugins();
const reload = browserSync.reload;



gulp.task('clean', () => {
    return gulp.src(['dist', 'dist/*.js'])
        .pipe($.clean());
        .pipe($.case)
});
