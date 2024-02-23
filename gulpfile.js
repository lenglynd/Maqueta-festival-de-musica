
const { src, dest, watch, parallel } = require("gulp");

//dependencias de CSS
const sass = require("gulp-sass")(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps  = require('gulp-sourcemaps');


//dependencias de imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

//Javascripts
const terser = require('gulp-terser-js');

function css(done) {
    
    src('src/scss/**/*.scss') //identificar el archivo sass
        .pipe(plumber())
        .pipe(sass())  //compilar
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest("build/css")); //guardar

    

    done(); //callback que indica el fin de la funcion principal
}

function imagenes(done) {
    const opciones = {
        optimizationLevel: 3
    };
    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'));

    done()
}

function versionWebp(done) {
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'));


    done();
}
function versionAvif(done) {
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'));


    done();
}

function javascript(done) {
    src('src/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));
    
    done();
}

function dev(done) {
    watch('src/scss/**/*.scss', css)
    watch('src/js/*.js', javascript)


    done();
}
exports.css = css;
exports.imagenes = imagenes;
exports.versionAvif = versionAvif;
exports.versionWebp = versionWebp;
exports.javascript = javascript;
exports.dev = parallel(javascript,versionAvif,imagenes, versionWebp, dev);