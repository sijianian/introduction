import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins'
import browserSync from 'browser-sync'
import rev from 'gulp-rev-append'
import sass from 'gulp-sass'


const $ = gulpLoadPlugins();
const reload = browserSync.reload;


/*清除dist文件夹*/
gulp.task('clean', () => {
    return gulp.src(['dist'])
        .pipe($.clean())
});


/*预编译Sass*/
gulp.task('styles', () => {
    return gulp.src('app/styles/*.scss')
        .pipe($.sourcemaps.init()) //压缩环境出错能找到未压缩的错误来源
        .pipe(sass.sync({
            outputStyle: 'expanded', //css编译后的方式
            precision: 10, //保留小数点后几位
            includePaths: ['.']
        }).on('error', sass.logError))
        .pipe($.sourcemaps.write('.')) //map 文件名
        .pipe(gulp.dest('dist/styles')) //指定输出路径
        .pipe(browserSync.stream());
});

/*转化es6的js*/
gulp.task('scripts', () => {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(browserSync.stream());
});

/*html流*/
gulp.task('html', () => {
    return gulp.src('app/*.html')
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.stream());
});

/*压缩图片*/
gulp.task('images', () => {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({ //使用cache只压缩改变的图片
            optimizationLevel: 3, //压缩级别
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.stream());
});

/*引用字体文件*/
gulp.task('fonts', () => {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
        .pipe(browserSync.stream());
});

/*css合并压缩，js合并压缩，html压缩*/
gulp.task('build', ['styles', 'scripts', 'images', 'fonts'], () => {
    let options = {
        removeComments: false, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: false, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: false, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: false, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: false, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面里的JS
        minifyCSS: true //压缩页面里的CSS
    }
    return gulp.src('dist/**/*')
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.cssnano()))
        //.pipe(rev()) //为引用添加版本号4
        .pipe($.if('*.html', $.htmlmin(options)))
        .pipe(gulp.dest('dist'))
});

/*本地建站和自动刷新*/
gulp.task('serve', ['styles', 'scripts', 'html', 'images', 'fonts'], () => {
    browserSync({
        notify: false,
        port: 9000, //端口号
        server: {
            baseDir: ['dist'], //确定根目录
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    });
    gulp.watch([ //监测文件变化 实行重新加载
        'dist/*.html',
    ]).on('change', reload);

    gulp.watch('app/styles/**/*.scss', ['styles']); //监测变化 执行styles任务
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/fonts/**/*', ['fonts']);
    gulp.watch('app/images/**/*', ['images']);
    gulp.watch('app/*.html', ['html']);
});
