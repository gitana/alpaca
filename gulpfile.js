var fs   = require("fs");
var gulp = require("gulp");
var _    = require("lodash");

var es   = require("event-stream");
var exec = require("child_process").exec;

var pkg  = require("./package.json");

var path = require("path");

var concat      = require("gulp-concat");
var uglify      = require('gulp-uglify-es').default;
var handlebars  = require("gulp-handlebars");
var jshint      = require("gulp-jshint");
var minifyCss   = require("gulp-minify-css");
var rename      = require("gulp-rename");
var clean       = require("gulp-clean");
var declare     = require("gulp-declare");
var notify      = require("gulp-notify");
var runSequence = require("run-sequence");
var nodemon     = require("gulp-nodemon");
var watch       = require("gulp-watch");
var wrap        = require('gulp-wrap');
var bump        = require('gulp-bump');
var wrapUmd     = require("gulp-wrap-umd");
var awspublish  = require('gulp-awspublish');
var gulpTemplate = require('gulp-template');

// custom builder_helper stripper to remove builder helper functions
var stripper = require("./gulp/gulp-stripper");

var VERSIONABLE_FILES = [
    "package.json",
    "alpaca.jquery.json",
    "bower.json"
];

var paths = {
    scripts: {
        core: [
            "thirdparty/base/Base.js",

            "src/js/Alpaca.js",
            "src/js/Alpaca-async.js",
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
            "src/js/Form.js",

            // cache implementations
            "src/js/cache/memory.js",
            "src/js/cache/null.js",

            // connectors
            "src/js/connectors/default.js",
            "src/js/connectors/cloudcms.js",

            // fields
            "src/js/fields/basic/TextField.js",
            "src/js/fields/basic/TextAreaField.js",
            "src/js/fields/basic/FileField.js",
            "src/js/fields/basic/NumberField.js",
            "src/js/fields/basic/ArrayField.js",
            "src/js/fields/basic/ObjectField.js",
            "src/js/fields/basic/AnyField.js",
            "src/js/fields/basic/HiddenField.js",

            "src/js/fields/list/ListField.js",
            "src/js/fields/list/CheckBoxField.js",
            "src/js/fields/list/RadioField.js",
            "src/js/fields/list/SelectField.js",
            "src/js/fields/list/ChooserField.js",

            "src/js/fields/advanced/AddressField.js",
            "src/js/fields/advanced/CKEditorField.js",
            "src/js/fields/advanced/ColorField.js",
            "src/js/fields/advanced/ColorPickerField.js",
            "src/js/fields/advanced/CountryField.js",
            "src/js/fields/advanced/CountryCallingCodeField.js",
            "src/js/fields/advanced/CurrencyField.js",
            "src/js/fields/advanced/DateField.js",
            "src/js/fields/advanced/DatetimeField.js",
            "src/js/fields/advanced/EditorField.js",
            "src/js/fields/advanced/EmailField.js",
            "src/js/fields/advanced/GridField.js",
            "src/js/fields/advanced/ImageField.js",
            "src/js/fields/advanced/IntegerField.js",
            "src/js/fields/advanced/IPv4Field.js",
            "src/js/fields/advanced/JSONField.js",
            "src/js/fields/advanced/IntegerField.js",
            "src/js/fields/advanced/LowerCaseField.js",
            "src/js/fields/advanced/MapField.js",
            "src/js/fields/advanced/MarkdownField.js",
            "src/js/fields/advanced/OptionTree.js",
            "src/js/fields/advanced/PasswordField.js",
            "src/js/fields/advanced/PersonalNameField.js",
            "src/js/fields/advanced/PhoneField.js",
            "src/js/fields/advanced/PickAColorField.js",
            "src/js/fields/advanced/SearchField.js",
            "src/js/fields/advanced/StateField.js",
            "src/js/fields/advanced/SummernoteField.js",
            "src/js/fields/advanced/TableField.js",
            "src/js/fields/advanced/TableRowField.js",
            "src/js/fields/advanced/TagField.js",
            "src/js/fields/advanced/TimeField.js",
            "src/js/fields/advanced/TinyMCEField.js",
            "src/js/fields/advanced/TokenField.js",
            "src/js/fields/advanced/UploadField.js",
            "src/js/fields/advanced/UpperCaseField.js",
            "src/js/fields/advanced/URLField.js",
            "src/js/fields/advanced/ZipcodeField.js",

            // base view
            "src/js/views/base.js",

            // i18n
            "src/js/messages/i18n/cs_CZ.js",
            "src/js/messages/i18n/de_AT.js",
            "src/js/messages/i18n/de_DE.js",
            "src/js/messages/i18n/el_GR.js",
            "src/js/messages/i18n/es_ES.js",
            "src/js/messages/i18n/fi_FI.js",
            "src/js/messages/i18n/fr_FR.js",
            "src/js/messages/i18n/hr_HR.js",
            "src/js/messages/i18n/it_IT.js",
            "src/js/messages/i18n/ja_JP.js",
            "src/js/messages/i18n/nb_NO.js",
            "src/js/messages/i18n/nl_BE.js",
            "src/js/messages/i18n/pl_PL.js",
            "src/js/messages/i18n/pt_BR.js",
            "src/js/messages/i18n/sv_SE.js",
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

gulp.task("clean", function() {
    return gulp.src(["build", "dist"], {read: false})
        .pipe(clean());
});

gulp.task("build-templates", function(cb)
{
    // Mozilla
    var escapeRegExp = function(string){
            return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };

    var processName = function(filepath)
    {
        // strip .js from end
        var i = filepath.indexOf(".js");
        if (i > -1)
        {
            filepath = filepath.substring(0, i);
        }

        // find "src/templates/" and index up
        var z = filepath.indexOf(path.join('src','templates',path.sep));
        filepath = filepath.substring(z + 14);

        // replace any "/" with .
        filepath = filepath.replace(new RegExp(escapeRegExp(path.sep), 'g'), ".");

        return filepath;
    };

    //console.log("build-templates start");
    return es.concat(

        // web
        gulp.src(paths.templates["web"])
            .pipe(handlebars({ handlebars: require('handlebars') }))
            .pipe(wrap('Handlebars.template(<%= contents %>)'))
            .pipe(declare({
                namespace: 'HandlebarsPrecompiled',
                processName: processName,
                noRedeclare: true
            }))
            .pipe(concat('templates-web.js'))
            .pipe(gulp.dest('build/tmp/')),

        // bootstrap
        gulp.src(paths.templates["bootstrap"])
            .pipe(handlebars({ handlebars: require('handlebars') }))
            .pipe(wrap('Handlebars.template(<%= contents %>)'))
            .pipe(declare({
                namespace: 'HandlebarsPrecompiled',
                processName: processName,
                noRedeclare: true
            }))
            .pipe(concat('templates-bootstrap.js'))
            .pipe(gulp.dest('build/tmp/')),

        // jqueryui
        gulp.src(paths.templates["jqueryui"])
            .pipe(handlebars({ handlebars: require('handlebars') }))
            .pipe(wrap('Handlebars.template(<%= contents %>)'))
            .pipe(declare({
                namespace: 'HandlebarsPrecompiled',
                processName: processName,
                noRedeclare: true
            }))
            .pipe(concat('templates-jqueryui.js'))
            .pipe(gulp.dest('build/tmp/')),

        // jquerymobile
        gulp.src(paths.templates["jquerymobile"])
            .pipe(handlebars({ handlebars: require('handlebars') }))
            .pipe(wrap('Handlebars.template(<%= contents %>)'))
            .pipe(declare({
                namespace: 'HandlebarsPrecompiled',
                processName: processName,
                noRedeclare: true
            }))
            .pipe(concat('templates-jquerymobile.js'))
            .pipe(gulp.dest('build/tmp/'))

    ).pipe(es.wait(function() {
        //console.log("build-templates complete");
        //cb();
    })).pipe(notify({message: "Built Alpaca Templates"}));
});

gulp.task("build-scripts", function(cb) {

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

    //console.log("build-scripts start");
    // core
    var first = gulp.src(paths.scripts.core)
                    .pipe(concat('scripts-core.js'))
                    .pipe(gulp.dest('build/tmp'));

    first.on("end", function() {

        es.concat(

            // web
            gulp.src(paths.scripts.web)
                .pipe(concat('alpaca.js'))
                .pipe(wrapUmd(web_wrap))
                .pipe(gulp.dest('build/alpaca/web'))
                .pipe(concat('alpaca.min.js'))
                .pipe(uglify())
                .pipe(gulp.dest('build/alpaca/web')),

            // bootstrap
            gulp.src(paths.scripts.bootstrap)
                .pipe(concat('alpaca.js'))
                .pipe(wrapUmd(bootstrap_wrap))
                .pipe(gulp.dest('build/alpaca/bootstrap'))
                .pipe(concat('alpaca.min.js'))
                .pipe(uglify())
                .pipe(gulp.dest('build/alpaca/bootstrap')),

            // jqueryui
            gulp.src(paths.scripts.jqueryui)
                .pipe(concat('alpaca.js'))
                .pipe(wrapUmd(jqueryui_warp))
                .pipe(gulp.dest('build/alpaca/jqueryui'))
                .pipe(concat('alpaca.min.js'))
                .pipe(uglify())
                .pipe(gulp.dest('build/alpaca/jqueryui')),

            // jquerymobile
            gulp.src(paths.scripts.jquerymobile)
                .pipe(concat('alpaca.js'))
                .pipe(wrapUmd(jquerymobile_wrap))
                .pipe(gulp.dest('build/alpaca/jquerymobile'))
                .pipe(concat('alpaca.min.js'))
                .pipe(uglify())
                .pipe(gulp.dest('build/alpaca/jquerymobile'))

        ).pipe(es.wait(function() {

            //console.log("build-scripts completed");
            cb();

        })).pipe(notify({message: "Built Alpaca JS"}));
    });
});

gulp.task("build-styles", function(cb) {

    //console.log("build-styles start");
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

            // bootstrap
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

        ).pipe(es.wait(function() {

            //console.log("build-styles completed");
            //cb();

        })).pipe(notify({message: "Built Alpaca CSS"}));
});

gulp.task("build-site", function(cb)
{
    console.log("build-site start");

    var now = new Date();
    var datetime = "";
    datetime += (now.getMonth()+1) + "/" + now.getDate() + "/" + now.getFullYear();
    //datetime += " ";
    //datetime += now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();

    // write temp file
    fs.writeFileSync("./_custom_config.yml", "alpaca_version: " + pkg.version + "\r\nalpaca_date: " + datetime);

    var cmd = "jekyll build --config ./site/_config.yml,./_custom_config.yml -s ./site -d ./build/site --trace";
    exec(cmd, function(err, stdout, stderr) {

        console.log("jekyll completed");

        // clean up temp file
        fs.unlinkSync("./_custom_config.yml");

        if (err)
        {
            console.log(stderr);
            cb(err);
            return;
        }

        // fix up alpaca-standalone-sample.html
        console.log("Apply HTML Variables");
        applyHtmlVariables("./build/site", function() {

            // now run post-processors over all of the HTML to insert builder code
            console.log("Annotating Field-Level Documentation");
            applyFieldAnnotations("./build/site", function() {
                console.log("Annotations Completed");
                cb();
            });

        });
    });

});

gulp.task("update-site-full", function(cb) {

    //console.log("update-site-full start");
    es.concat(

        // copy site into web
        gulp.src("build/site/**").pipe(gulp.dest("./build/web")),

        // copy lib/ into web
        gulp.src("lib/**")
            .pipe(gulp.dest('./build/web/lib')),

        // copy alpaca into web
        gulp.src("build/alpaca/**")
            .pipe(gulp.dest('./build/web/lib/alpaca'))

    ).pipe(es.wait(function() {
        console.log("update-site-full completed");
        cb();
    })).pipe(notify({message: "Built Alpaca Web Site"}));
});

gulp.task("update-site-alpaca", function(cb) {

    //console.log("update-site-alpaca start");
    return es.concat(

        // copy alpaca into web
        gulp.src("build/alpaca/**")
            .pipe(gulp.dest('./build/web/lib/alpaca'))

    ).pipe(es.wait(function() {
        //console.log("update-site-alpaca completed");
    })).pipe(notify({message: "Updated Alpaca into Web Site"}));
});

// Rerun the task when a file changes
gulp.task('watch', function() {

    // scripts
    watch(paths.scripts.core, function(files, cb) {
        runSequence("build-scripts", "update-site-alpaca", function() {
            if (cb) {
                cb();
            }
        });
    });
    watch(paths.scripts.all_views, function(files, cb) {
        runSequence("build-scripts", "update-site-alpaca", function() {
            if (cb) {
                cb();
            }
        });
    });

    // templates
    watch(paths.templates.all, function(files, cb) {
        runSequence("build-templates", "build-scripts", "update-site-alpaca", function() {
            if (cb) {
                cb();
            }
        });
    });

    // styles
    watch(paths.styles.all, function(files, cb) {
        runSequence("build-styles", "update-site-alpaca", function() {
            if (cb) {
                cb();
            }
        });
    });

    // web
    watch(["site/*/**", "site/*", "site/*.*"], function(files, cb) {
        runSequence("build-site", "update-site-full", function() {
            if (cb) {
                cb();
            }
        });
    });
});

gulp.task("package", function(cb) {

    //console.log("package start");
    fs.writeFileSync("./build/version.properties", "version=" + pkg.version);

    /*
    var jQueryJson = require("./alpaca.jquery.json");
    jQueryJson.version = pkg.version;
    fs.writeFileSync("./alpaca.jquery.json", JSON.stringify(jQueryJson, null, "  "));
    */

    //console.log("package completed");
    cb();
});

gulp.task("default", function(cb) {
    runSequence(
        "update-release-txt",
        "build-templates",
        ["build-scripts", "build-styles", "package"],
        function() {
            if (cb) {
                cb();
            }
        }
    );
});

gulp.task("site", function(cb) {
    runSequence(
        "build-site",
        "update-site-full",
        function() {
            if (cb) {
                cb();
            }
        }
    );
});

gulp.task("server", ["watch"], function() {

    // NOTE: aaaaa is just a dummy folder to avoid nodemon from setting up a proper watch
    // we control the watch separately
    nodemon({
        script: "server/webserver.js",
        ignore: [
            "./**",
            "*/**",
            "*",
            "*.*"
        ],
        watch: "aaaaa/**"
    });

});

gulp.task("web", function(cb) {
    runSequence(
        "default",
        "site",
        "server",
        function() {
            if (cb) {
                cb();
            }
        }
    );
});

gulp.task("dist", function() {

    return es.concat(

        gulp.src("build/alpaca/**/*")
            .pipe(gulp.dest("dist/alpaca"))//,

        //gulp.src("lib/**/*")
        //    .pipe(gulp.dest("dist/lib"))

    ).pipe(es.wait(function() {
        // all done
    }));
});

gulp.task("bump", function(){
    gulp.src(VERSIONABLE_FILES).pipe(bump()).pipe(gulp.dest("./"));
});

gulp.task("bumpMinor", function(){
    gulp.src(VERSIONABLE_FILES).pipe(bump({type:"minor"})).pipe(gulp.dest("./"));
});

gulp.task("bumpMajor", function(){
    gulp.src(VERSIONABLE_FILES).pipe(bump({type:"major"})).pipe(gulp.dest("./"));
});

gulp.task("cdn", function(){

    var aws = JSON.parse(fs.readFileSync("./_s3.json"));

    // create a new publisher
    var publisher = awspublish.create(aws);
    gulp
        .src("./build/alpaca/**/*")
        .pipe(rename(function(x) {
            x.dirname = path.join("alpaca", pkg.version, x.dirname);
        }))
        .pipe(publisher.publish())
        //.pipe(publisher.sync())
        .pipe(awspublish.reporter());
});


//
// TESTING
//

gulp.task("testsite", ["watch"], function() {

    nodemon({
        script: "server/test-webserver.js"
    });

});

gulp.task("lint", function() {
  gulp.src(_.flatten([paths.scripts.core, "!lib/**/*"]))
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"));
});

gulp.task("watch:lint", ["lint"], function() {
  gulp.watch(paths.scripts.core, ["lint"]);
});

gulp.task("cucumber", function(cb) {
    require("child_process").exec("./node_modules/.bin/cucumber.js -r features", function(err, stdout, stderr) {
        if (err) {
            console.log("Error: " + err);
        } else {
            console.log(stdout);
            console.error(stderr);
        }
    });
});

var generateTable = function(schema)
{
    var table = "";

    table += "<table class='table table-bordered table-responsive table-hover table-condensed'>";

    table += "<thead>";
    table += "<tr>";
    table += "<th>Property</th>";
    table += "<th>Type</th>";
    table += "<th>Default</th>";
    table += "<th>Description</th>";
    table += "</tr>";
    table += "</thead>";

    table += "<tbody>";
    for (var name in schema.properties)
    {
        var property = schema.properties[name];

        table += "<tr>";
        table += "<td>" + name + "</td>";
        table += "<td>" + (property.type ? property.type : "") + "</td>";
        table += "<td>" + (property.default ? property.default : "") + "</td>";
        table += "<td>" + (property.description ? property.description : "") + "</td>";
        table += "</tr>";
    }
    table += "</tbody>";

    table += "</table>";

    return table;
};

var applyFieldAnnotationsToFile = function(filePath, Alpaca)
{
    var text = "" + fs.readFileSync(filePath);

    var c1 = text.indexOf("<!-- INCLUDE_API_DOCS:");
    if (c1 > -1)
    {
        var c2 = text.indexOf("-->", c1 + 1);
        if (c2 > -1)
        {
            var type = text.substring(c1 + 22, c2);
            type = type.trim();

            console.log(" -> Annotating type: " + type + " in file: " + filePath);

            var constructor = Alpaca.fieldClassRegistry[type];
            if (constructor)
            {
                var instance = new constructor();
                //domEl, data, options, schema, viewId, connector, errorCallback

                // schema and options
                var schemaSchema = instance.getSchemaOfSchema();
                //var schemaOptions = instance.getOptionsForSchema();
                var optionsSchema = instance.getSchemaOfOptions();
                //var optionsOptions = instance.getOptionsForOptions();

                // sort the schema and options
                var leSort = function(properties)
                {
                    var newProperties = {};

                    var keys = [];
                    for (var key in properties) {
                        keys.push(key);
                    }

                    keys.sort();

                    for (var i = 0; i < keys.length; i++)
                    {
                        newProperties[keys[i]] = properties[keys[i]];
                    }

                    return newProperties;
                };
                schemaSchema.properties = leSort(schemaSchema.properties);
                optionsSchema.properties = leSort(optionsSchema.properties);


                // general
                var stampFunction = function(name, value, link)
                {
                    var x = "";
                    x += "<tr>";
                    x += "<td>" + name + "</td>";
                    x += "<td>";
                    if (link)
                    {
                        x += "<a href='" + link + "'>";
                    }
                    x += value;
                    if (link)
                    {
                        x += "</a>";
                    }
                    x += "</td>";
                    x += "</tr>";

                    return x;
                };
                var title = instance.getTitle();
                var description = instance.getDescription();
                var schemaType = instance.getType();
                var fieldType = instance.getFieldType();
                var baseFieldType = instance.getBaseFieldType();

                var gen = "";
                gen += "<h3>Properties</h3>";

                gen += "<table class='table table-bordered table-responsive table-hover table-condensed'>";
                gen += "<tbody>";
                gen += stampFunction("Title", title);
                gen += stampFunction("Description", description);
                if (schemaType) {
                    gen += stampFunction("JSON Schema Type(s)", schemaType);
                }
                gen += stampFunction("Field Type", fieldType, "/docs/fields/" + fieldType + ".html");
                if (baseFieldType)
                {
                    gen += stampFunction("Base Field Type", baseFieldType, "/docs/fields/" + baseFieldType + ".html");
                }
                else
                {
                    gen += stampFunction("Base Field Type", "None");
                }
                gen += "</tbody>";
                gen += "</table>";

                gen += "<h3>Schema</h3>";
                gen += generateTable(schemaSchema);
                gen += "<h3>Options</h3>";
                gen += generateTable(optionsSchema);

                text = text.substring(0, c1) + gen + text.substring(c2 + 3);

                fs.writeFileSync(filePath, text);
            }
            else
            {
                console.log(" -> Could not find field type: " + type);
            }
        }
    }
};

var applyFieldAnnotations = function(basePath, callback)
{
    var jsdom = require("jsdom");
    var html = '<html><body><div id="form"></div></html>';

    var jQuerySrc = fs.readFileSync("./lib/jquery/dist/jquery.js", "utf-8");
    var alpacaSrc = fs.readFileSync("./build/alpaca/web/alpaca.js", "utf-8");
    var handlebarsSrc = fs.readFileSync("./lib/handlebars/handlebars.js", "utf-8");

    var wrench = require("wrench");

    var virtualConsole = jsdom.createVirtualConsole().sendTo(console);

    // first argument can be html string, filename, or url
    jsdom.env(html, {
        src: [jQuerySrc, handlebarsSrc, alpacaSrc],
        virtualConsole: virtualConsole
    }, function (errors, window) {

        global.$ = window.$;
        global.Alpaca = window.Alpaca;
        global.jQuery = window.$;
        global.Base = window.Base;
        global.Handlebars = window.Handlebars;

        $("#form").alpaca({
            "data": "",
            "view": "web-edit",
            "postRender": function(control)
            {
                var all = wrench.readdirSyncRecursive(basePath);

                var files = [];
                for (var i = 0; i < all.length; i++)
                {
                    if (all[i].indexOf(".html") > -1)
                    {
                        files.push(path.join(basePath, all[i]));
                    }
                }

                for (var i = 0; i < files.length; i++)
                {
                    applyFieldAnnotationsToFile(files[i], Alpaca);
                }

                callback();
            }
        });

    });
};

var applyHtmlVariables = function(basePath, callback)
{
    var wrench = require("wrench");
    var all = wrench.readdirSyncRecursive(basePath);

    var files = [];
    for (var i = 0; i < all.length; i++)
    {
        if (all[i].indexOf(".html") > -1)
        {
            files.push(path.join(basePath, all[i]));
        }
    }

    for (var i = 0; i < files.length; i++)
    {
        applyHtmlVariablesToFile(files[i]);
    }

    callback();
};

var applyHtmlVariablesToFile = function(filePath)
{
    var text = "" + fs.readFileSync(filePath);

    text = doReplace(text, "$ALPACA_VERSION", pkg.version);

    fs.writeFileSync(filePath, text);
};

var doReplace = function(text, token, value)
{
    var i = -1;
    do
    {
        i = text.indexOf(token);
        if (i > -1)
        {
            text = text.replace(token, value);
        }
    }
    while (i > -1);

    return text;
};

gulp.task("update-release-txt", function() {

    if (fs.existsSync("license.txt"))
    {
        fs.unlinkSync("license.txt");
    }

    return gulp.src("license.txt.template", {
        "cwd": "./config"
    })
        .pipe(gulpTemplate({
            version: pkg.version
        }))
        .pipe(rename("license.txt"))
        .pipe(gulp.dest("."));

});

gulp.task("website", function(cb) {
    runSequence("default", "site", "server", function () {
        cb();
    });
});

gulp.task("npmpackage", function(cb) {

    var npmPkg = JSON.parse(JSON.stringify(pkg));
    delete npmPkg.scripts.postinstall;
    delete npmPkg.scripts.postupdate;

    fs.writeFileSync("./package.json.npm", JSON.stringify(npmPkg, null, "  "));

    cb();
});

gulp.task("_deploy", function(cb) {
    runSequence("default", "site", "dist", "npmpackage", function () {
        cb();
    });
});
