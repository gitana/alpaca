var fs   = require("fs");
var gulp = require("gulp");
var _    = require("lodash");

var es   = require("event-stream");
var exec = require("child_process").exec;

var pkg  = require("./package.json");

var concat      = require("gulp-concat");
var uglify      = require("gulp-uglify");
var handlebars  = require("gulp-handlebars");
var jshint      = require("gulp-jshint");
var minifyCss   = require("gulp-minify-css");
var rename      = require("gulp-rename");
var clean       = require("gulp-clean");
var declare     = require("gulp-declare");
var notify      = require("gulp-notify");
var runSequence = require("run-sequence");
var nodemon     = require("gulp-nodemon");

var wrap = require("gulp-wrap-umd");

// custom builder_helper stripper to remove builder helper functions
var stripper = require("./gulp/gulp-stripper");

var paths = {
    scripts: {
        core: [
            "lib/base.js",
            //"lib/json3/lib/json3.js",
            //"lib/validate/index.js",
            "lib/equiv_and_hoozit/index.js",
            "lib/jquery-maskedinput/dist/jquery.maskedinput.min.js",

            "src/js/Alpaca.js",
            "src/js/ObservableUtils.js",
            "src/js/Observables.js",
            "src/js/Observable.js",
            "src/js/ScopedObservables.js",
            "src/js/TemplateEngineRegistry.js",
            "src/js/AbstractTemplateEngine.js",
            "src/js/HandlebarsTemplateEngine.js",
            "src/js/NormalizedView.js",
            "src/js/RuntimeView.js",
            "src/js/Field.js",
            "src/js/ControlField.js",
            "src/js/ContainerField.js",
            "src/js/Connector.js",
            "src/js/Form.js",

            // fields
            "src/js/fields/basic/TextField.js",
            "src/js/fields/basic/TextAreaField.js",
            "src/js/fields/basic/CheckBoxField.js",
            "src/js/fields/basic/FileField.js",
            "src/js/fields/basic/ListField.js",
            "src/js/fields/basic/RadioField.js",
            "src/js/fields/basic/SelectField.js",
            "src/js/fields/basic/NumberField.js",
            "src/js/fields/basic/ArrayField.js",
            "src/js/fields/basic/ObjectField.js",
            "src/js/fields/basic/AnyField.js",
            "src/js/fields/basic/HiddenField.js",

            "src/js/fields/advanced/AddressField.js",
            "src/js/fields/advanced/DateField.js",
            "src/js/fields/advanced/DatetimeField.js",
            "src/js/fields/advanced/EditorField.js",
            "src/js/fields/advanced/EmailField.js",
            "src/js/fields/advanced/IntegerField.js",
            "src/js/fields/advanced/IPv4Field.js",
            "src/js/fields/advanced/JSONField.js",
            "src/js/fields/advanced/IntegerField.js",
            "src/js/fields/advanced/LowerCaseField.js",
            "src/js/fields/advanced/MapField.js",
            "src/js/fields/advanced/PasswordField.js",
            "src/js/fields/advanced/PersonalNameField.js",
            "src/js/fields/advanced/PhoneField.js",
            "src/js/fields/advanced/TagField.js",
            "src/js/fields/advanced/TimeField.js",
            "src/js/fields/advanced/UpperCaseField.js",
            "src/js/fields/advanced/CKEditorField.js",
            "src/js/fields/advanced/StateField.js",
            "src/js/fields/advanced/CountryField.js",
            "src/js/fields/advanced/ZipcodeField.js",
            "src/js/fields/advanced/URLField.js",
            "src/js/fields/advanced/UploadField.js",
            "src/js/fields/advanced/TableField.js",
            "src/js/fields/advanced/GridField.js",
            "src/js/fields/advanced/CurrencyField.js",

            // base view
            "src/js/views/base.js",

            // i18n
            "src/js/messages/i18n/de_AT.js",
            "src/js/messages/i18n/es_ES.js",
            "src/js/messages/i18n/fr_FR.js",
            "src/js/messages/i18n/pl_PL.js",
            "src/js/messages/i18n/pt_BR.js",
            "src/js/messages/i18n/zh_CN.js"
        ],
        all_views: [
            "src/js/views/web.js",
            "src/js/views/jqueryui.js",
            "src/js/views/jquerymobile.js",
            "src/js/views/bootstrap.js"
        ],
        web: [
            "build/tmp/templates-web.js",
            "build/tmp/scripts-core.js",
            "src/js/views/web.js"
        ],
        jqueryui: [
            "build/tmp/templates-jqueryui.js",
            "build/tmp/scripts-core.js",
            "src/js/views/web.js",
            "src/js/views/jqueryui.js"
        ],
        jquerymobile: [
            "build/tmp/templates-jquerymobile.js",
            "build/tmp/scripts-core.js",
            "src/js/views/web.js",
            "src/js/views/jquerymobile.js"
        ],
        bootstrap: [
            "build/tmp/templates-bootstrap.js",
            "build/tmp/scripts-core.js",
            "src/js/views/web.js",
            "src/js/views/bootstrap.js"
        ]
    },
    templates: {
        web: [
            "src/templates/web-display/**/*.html",
            "src/templates/web-edit/**/*.html",
            "src/templates/web-create/**/*.html"
        ],
        jqueryui: [
            "src/templates/web-display/**/*.html",
            "src/templates/web-edit/**/*.html",
            "src/templates/web-create/**/*.html",
            "src/templates/jqueryui-display/**/*.html",
            "src/templates/jqueryui-edit/**/*.html",
            "src/templates/jqueryui-create/**/*.html"
        ],
        jquerymobile: [
            "src/templates/web-display/**/*.html",
            "src/templates/web-edit/**/*.html",
            "src/templates/web-create/**/*.html",
            "src/templates/jquerymobile-display/**/*.html",
            "src/templates/jquerymobile-edit/**/*.html",
            "src/templates/jquerymobile-create/**/*.html"
        ],
        bootstrap: [
            "src/templates/web-display/**/*.html",
            "src/templates/web-edit/**/*.html",
            "src/templates/web-create/**/*.html",
            "src/templates/bootstrap-display/**/*.html",
            "src/templates/bootstrap-edit/**/*.html",
            "src/templates/bootstrap-create/**/*.html"
        ],
        all: [
            "src/templates/**/*.html"
        ]
    },
    styles: {
        all: [
            "src/css/**/*.css"
        ],
        web: [
            "src/css/alpaca-core.css",
            "src/css/alpaca-fields.css",
            "src/css/alpaca-web.css"
        ],
        bootstrap: [
            "src/css/alpaca-core.css",
            "src/css/alpaca-fields.css",
            "src/css/alpaca-bootstrap.css"
        ],
        jquerymobile: [
            "src/css/alpaca-core.css",
            "src/css/alpaca-fields.css",
            "src/css/alpaca-jquerymobile.css"
        ],
        jqueryui: [
            "src/css/alpaca-core.css",
            "src/css/alpaca-fields.css",
            "src/css/alpaca-jqueryui.css"
        ]
    }
};

gulp.task('clean', function() {
    gulp.src('build', {read: false})
        .pipe(clean());
});

gulp.task('styles', function() {

    return es.concat(

        // web
        gulp.src(paths.styles.web)
            .pipe(concat('alpaca.css'))
            .pipe(gulp.dest('build/alpaca/web'))
            .pipe(rename({suffix: ".min"}))
            .pipe(minifyCss())
            .pipe(gulp.dest('build/alpaca/web')),
        gulp.src("src/css/images/**")
            .pipe(gulp.dest('./build/alpaca/web/images')),

        // bootstrap (includes web)
        gulp.src(paths.styles.bootstrap)
            .pipe(concat('alpaca.css'))
            .pipe(gulp.dest('build/alpaca/bootstrap'))
            .pipe(rename({suffix: ".min"}))
            .pipe(minifyCss())
            .pipe(gulp.dest('build/alpaca/bootstrap')),
        gulp.src("src/css/images/**")
            .pipe(gulp.dest('./build/alpaca/bootstrap/images')),

        // jqueryui
        gulp.src(paths.styles.jqueryui)
            .pipe(concat('alpaca.css'))
            .pipe(gulp.dest('build/alpaca/jqueryui'))
            .pipe(rename({suffix: ".min"}))
            .pipe(minifyCss())
            .pipe(gulp.dest('build/alpaca/jqueryui')),
        gulp.src("src/css/images/**")
            .pipe(gulp.dest('./build/alpaca/jqueryui/images')),

        // jquerymobile
        gulp.src(paths.styles.jquerymobile)
            .pipe(concat('alpaca.css'))
            .pipe(gulp.dest('build/alpaca/jquerymobile'))
            .pipe(rename({suffix: ".min"}))
            .pipe(minifyCss())
            .pipe(gulp.dest('build/alpaca/jquerymobile')),
        gulp.src("src/css/images/**")
            .pipe(gulp.dest('./build/alpaca/jquerymobile/images'))

    ).pipe(es.wait()).pipe(notify({message: "Built Alpaca CSS"}));
});

gulp.task('scripts', function(cb) {

    // alpaca umd
    var wrapper = "" + fs.readFileSync("./config/umd-wrapper.txt");

    var web_wrap = {
        deps: [{
            "name": "jquery",
            "globalName": "jQuery",
            "paramName": "$"
        }, {
            "name": "handlebars",
            "globalName": "Handlebars",
            "paramName": "Handlebars"
        }],
        namespace: "Alpaca",
        exports: "Alpaca",
        template: wrapper
    };
    var bootstrap_wrap = {
        deps: [{
            "name": "jquery",
            "globalName": "jQuery",
            "paramName": "$"
        }, {
            "name": "handlebars",
            "globalName": "Handlebars",
            "paramName": "Handlebars"
        }, {
            "name": "bootstrap",
            "globalName": "Bootstrap",
            "paramName": "Bootstrap"
        }],
        namespace: "Alpaca",
        exports: "Alpaca",
        template: wrapper,
        defaultView: 'bootstrap'
    };
    var jqueryui_warp = {
        deps: [{
            "name": "jquery",
            "globalName": "jQuery",
            "paramName": "$"
        }, {
            "name": "handlebars",
            "globalName": "Handlebars",
            "paramName": "Handlebars"
        }, {
            "name": "jquery-ui",
            "globalName": "jQueryUI",
            "paramName": "jQueryUI"
        }],
        namespace: "Alpaca",
        exports: "Alpaca",
        template: wrapper,
        defaultView: 'jqueryui'
    };
    var jquerymobile_wrap = {
        deps: [{
            "name": "jquery",
            "globalName": "jQuery",
            "paramName": "$"
        }, {
            "name": "handlebars",
            "globalName": "Handlebars",
            "paramName": "Handlebars"
        }, {
            "name": "jquery-mobile",
            "globalName": "jQM",
            "paramName": "jQM"
        }],
        namespace: "Alpaca",
        exports: "Alpaca",
        template: wrapper,
        defaultView: 'jquerymobile'
    };

    // core
    var first = gulp.src(paths.scripts.core)
                    .pipe(concat('scripts-core.js'))
                    .pipe(gulp.dest('build/tmp'));

    first.on("end", function() {

        es.concat(

            // web
            gulp.src(paths.scripts.web)
                .pipe(concat('alpaca.js'))
                .pipe(wrap(web_wrap))
                .pipe(gulp.dest('build/alpaca/web'))
                .pipe(concat('alpaca.min.js'))
                .pipe(uglify())
                .pipe(gulp.dest('build/alpaca/web')),
            /*
            gulp.src(paths.scripts.web)
                .pipe(concat('alpaca-nobuilder.js'))
                .pipe(wrap(web_wrap))
                .pipe(stripper())
                .pipe(gulp.dest('build/alpaca/web')),
            */

            // bootstrap
            gulp.src(paths.scripts.bootstrap)
                .pipe(concat('alpaca.js'))
                .pipe(wrap(bootstrap_wrap))
                .pipe(gulp.dest('build/alpaca/bootstrap'))
                .pipe(concat('alpaca.min.js'))
                .pipe(uglify())
                .pipe(gulp.dest('build/alpaca/bootstrap')),

            // jqueryui
            gulp.src(paths.scripts.jqueryui)
                .pipe(concat('alpaca.js'))
                .pipe(wrap(jqueryui_warp))
                .pipe(gulp.dest('build/alpaca/jqueryui'))
                .pipe(concat('alpaca.min.js'))
                .pipe(uglify())
                .pipe(gulp.dest('build/alpaca/jqueryui')),

            // jquerymobile
            gulp.src(paths.scripts.jquerymobile)
                .pipe(concat('alpaca.js'))
                .pipe(wrap(jquerymobile_wrap))
                .pipe(gulp.dest('build/alpaca/jquerymobile'))
                .pipe(concat('alpaca.min.js'))
                .pipe(uglify())
                .pipe(gulp.dest('build/alpaca/jquerymobile'))

        ).pipe(es.wait(function() {

            cb();

        })).pipe(notify({message: "Built Alpaca JS"}));
    });
});

gulp.task('templates', function()
{
    var processName = function(filepath)
    {
        // strip .js from end
        var i = filepath.indexOf(".js");
        if (i > -1)
        {
            filepath = filepath.substring(0, i);
        }

        // find "src/templates/" and index up
        var z = filepath.indexOf("src/templates/");
        filepath = filepath.substring(z + 14);

        // replace any "/" with .
        filepath = filepath.replace(new RegExp("/", 'g'), ".");

        return filepath;
    };

    return es.concat(

        // web
        gulp.src(paths.templates["web"])
            .pipe(handlebars())
            .pipe(declare({
                namespace: 'HandlebarsPrecompiled',
                processName: processName
            }))
            .pipe(concat('templates-web.js'))
            .pipe(gulp.dest('build/tmp/')),

        // bootstrap
        gulp.src(paths.templates["bootstrap"])
            .pipe(handlebars())
            .pipe(declare({
                namespace: 'HandlebarsPrecompiled',
                processName: processName
            }))
            .pipe(concat('templates-bootstrap.js'))
            .pipe(gulp.dest('build/tmp/')),

        // jqueryui
        gulp.src(paths.templates["jqueryui"])
            .pipe(handlebars())
            .pipe(declare({
                namespace: 'HandlebarsPrecompiled',
                processName: processName
            }))
            .pipe(concat('templates-jqueryui.js'))
            .pipe(gulp.dest('build/tmp/')),

        // jquerymobile
        gulp.src(paths.templates["jquerymobile"])
            .pipe(handlebars())
            .pipe(declare({
                namespace: 'HandlebarsPrecompiled',
                processName: processName
            }))
            .pipe(concat('templates-jquerymobile.js'))
            .pipe(gulp.dest('build/tmp/'))

    ).pipe(es.wait()).pipe(notify({message: "Built Alpaca Templates"}));

});

gulp.task('jekyll', function(cb)
{
    exec('jekyll build -s ./site -d ./build/site --trace', function(err, stdout, stderr) {

        if (err)
        {
            console.log(stderr);
        }

        cb(err);
    });

});

gulp.task('update-web', function() {

    return es.concat(

        // copy site into web
        gulp.src("build/site/**").pipe(gulp.dest("./build/web")),

        // copy lib/ into web
        gulp.src("lib/**")
            .pipe(gulp.dest('./build/web/lib')),

        // copy alpaca into web
        gulp.src("build/alpaca/**")
            .pipe(gulp.dest('./build/web/lib/alpaca'))

    ).pipe(es.wait()).pipe(notify({message: "Built Alpaca Web Site"}));

});

gulp.task('stamp-version', function() {

    fs.writeFileSync("./build/version.properties", "version=" + pkg.version);
});

var refreshWeb = function()
{
    runSequence('jekyll', 'update-web', 'stamp-version');
};

gulp.task('refreshWeb', function()
{
    refreshWeb();
});

// Rerun the task when a file changes
gulp.task('watch', ['scripts', 'templates', 'styles'], function() {

    // scripts
    gulp.watch(paths.scripts.core, function() {
        return runSequence('scripts', refreshWeb);
    });
    gulp.watch(paths.scripts.all_views, function() {
        return runSequence('scripts', refreshWeb);
    });

    // templates
    gulp.watch(paths.templates.all, function() {
        return runSequence('templates', 'scripts', refreshWeb);
    });

    // styles
    gulp.watch(paths.styles.all, function() {
        return runSequence('styles', refreshWeb);
    });

    // web
    gulp.watch(["site/*/**"], function() {
        refreshWeb();
    });

});

gulp.task('server', ['default', 'watch'], function() {

    nodemon({
        script: 'server/webserver.js',
        ignore: [
            '*/**',
            '*'
        ]
    });

});

gulp.task('testsite', ['watch'], function() {

    nodemon({
        script: 'server/test-webserver.js'
    });

});

gulp.task('lint', function() {
  gulp.src(_.flatten([paths.scripts.core, '!lib/**/*']))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch:lint', ['lint'], function() {
  gulp.watch(paths.scripts.core, ['lint']);
});

gulp.task('package', function(callback) {
    var jQueryJson = require("./alpaca.jquery.json");
    jQueryJson.version = pkg.version;
    fs.writeFileSync("./alpaca.jquery.json", JSON.stringify(jQueryJson, null, "  "));

    callback();
});

gulp.task('default', function(callback) {
    return runSequence(['templates', 'scripts'], 'styles', 'package', 'refreshWeb', callback);
});

gulp.task('cucumber', function(cb) {
    require('child_process').exec('./node_modules/.bin/cucumber.js -r features', function(err, stdout, stderr) {
        if (err) {
            console.log('Error: ' + err);
        } else {
            console.log(stdout);
            console.error(stderr);
        }
    });
});

gulp.task('metadata', function(callback) {


    var jQueryJson = require("./alpaca.jquery.json");
    jQueryJson.version = pkg.version;
    fs.writeFileSync("./alpaca.jquery.json", JSON.stringify(jQueryJson, null, "  "));

    callback();
});
