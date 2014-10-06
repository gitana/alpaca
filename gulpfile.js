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
var watch       = require("gulp-watch");

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

gulp.task("clean", function() {
    return gulp.src("build", {read: false})
        .pipe(clean());
});

gulp.task("build-templates", function(cb)
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

    //console.log("build-templates start");
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
    exec("jekyll build -s ./site -d ./build/site --trace", function(err, stdout, stderr) {

        console.log("jekyll completed");
        if (err)
        {
            console.log(stderr);
            cb(err);
            return;
        }

        /*
        // now run post-processors over all of the HTML to insert builder code
        applyBuilder("./build/site", function() {
            console.log("build-site completed");
        });
        */
        cb();
    });

});

gulp.task("update-site-full", function(cb) {

    //console.log("update-site-full start");
    return es.concat(

        // copy site into web
        gulp.src("build/site/**").pipe(gulp.dest("./build/web")),

        // copy lib/ into web
        gulp.src("lib/**")
            .pipe(gulp.dest('./build/web/lib')),

        // copy alpaca into web
        gulp.src("build/alpaca/**")
            .pipe(gulp.dest('./build/web/lib/alpaca'))

    ).pipe(es.wait(function() {
        //console.log("update-site-full completed");
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
            cb();
        });
    });
    watch(paths.scripts.all_views, function(files, cb) {
        runSequence("build-scripts", "update-site-alpaca", function() {
            cb();
        });
    });

    // templates
    watch(paths.templates.all, function(files, cb) {
        runSequence("build-templates", "build-scripts", "update-site-alpaca", function() {
            cb();
        });
    });

    // styles
    watch(paths.styles.all, function(files, cb) {
        runSequence("build-styles", "update-site-alpaca", function() {
            cb();
        });
    });

    // web
    watch(["site/*/**", "site/*", "site/*.*"], function(files, cb) {
        runSequence("build-site", "update-site-full", function() {
            cb();
        });
    });
});

gulp.task("server", ["watch"], function() {

    nodemon({
        script: "server/webserver.js",
        ignore: [
            "*/**",
            "*",
            "*.*"
        ]
    });

});

gulp.task("package", function(cb) {

    //console.log("package start");
    fs.writeFileSync("./build/version.properties", "version=" + pkg.version);

    var jQueryJson = require("./alpaca.jquery.json");
    jQueryJson.version = pkg.version;
    fs.writeFileSync("./alpaca.jquery.json", JSON.stringify(jQueryJson, null, "  "));

    //console.log("package completed");
    cb();
});

gulp.task("default", function(cb) {
    runSequence(
        "build-templates",
        ["build-scripts", "build-styles", "package"],
        "build-site",
        "update-site-full",
        function() {
            cb();
        }
    );
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

var _applyBuilder = function(text, token, method)
{
    var c1 = text.indexOf("<!-- " + token + ":");
    if (c1 > -1)
    {
        var c2 = text.indexOf("-->", c1 + 28);
        if (c2 > -1)
        {
            var type = text.substring(c1 + 28, c2);

            var instance = Alpaca.fieldClassRegistry[type]();

            var schema = instance[method]();
            var schemaSchema = instance.getSchemaOfSchema();
            var schemaOptions = instance.getOptionsForSchema();
            var optionsSchema = instance.getSchemaOfOptions();
            var optionsOptions = instance.getOptionsForOptions();
            var title = instance.getTitle();
            var description = instance.getDescription();
            var type = instance.getType();
            var fieldType = instance.getFieldType();

            var table = "";

            table += "<table class='table table-hover'>";

            table += "<thead>";
            table += "<tr>";
            table += "<th>Property</th>";
            table += "<th>Description</th>";
            table += "<th>Type</th>";
            table += "<th>Default</th>";
            table += "</tr>";
            table += "</thead>";

            table += "<tbody>";
            for (var name in schemaSchema.properties)
            {
                var property = schemaSchema.properties[name];

                table += "<tr>";
                table += "<td>" + name + "</td>";
                table += "<td>" + property.description ? property.description : "" + "</td>";
                table += "<td>" + property.type ? property.type : "" + "</td>";
                table += "<td>" + property.default ? property.default : "" + "</td>";
                table += "</tr>";
            }
            table += "</tbody>";

            table += "</table>";

            text = text.substring(0, c1) + table + text.substring(c2 + 3);

            fs.writeFileSync(filePath, text);
        }
    }
};

var generateTable = function(schema)
{
    var table = "";

    table += "<table class='table table-hover'>";

    table += "<thead>";
    table += "<tr>";
    table += "<th>Property</th>";
    table += "<th>Description</th>";
    table += "<th>Type</th>";
    table += "<th>Default</th>";
    table += "</tr>";
    table += "</thead>";

    table += "<tbody>";
    for (var name in schema.properties)
    {
        var property = schema.properties[name];

        table += "<tr>";
        table += "<td>" + name + "</td>";
        table += "<td>" + property.description ? property.description : "" + "</td>";
        table += "<td>" + property.type ? property.type : "" + "</td>";
        table += "<td>" + property.default ? property.default : "" + "</td>";
        table += "</tr>";
    }
    table += "</tbody>";

    table += "</table>";

    return table;
};

var applyBuilderToFile = function(filePath, Alpaca)
{
    var text = "" + fs.readFileSync(filePath);

    var c1 = text.indexOf("<!-- INCLUDE_API_DOCS:");
    if (c1 > -1)
    {
        var c2 = text.indexOf("-->", c1 + 28);
        if (c2 > -1)
        {
            var type = text.substring(c1 + 28, c2);

            var instance = Alpaca.fieldClassRegistry[type]();

            var schemaSchema = instance.getSchemaOfSchema();
            //var schemaOptions = instance.getOptionsForSchema();
            var optionsSchema = instance.getSchemaOfOptions();
            //var optionsOptions = instance.getOptionsForOptions();
            var title = instance.getTitle();
            var description = instance.getDescription();
            var type = instance.getType();
            var fieldType = instance.getFieldType();

            var gen = "";
            gen += "<h3>" + fieldType + "</h3>";
            gen += "<h4>" + type + "</h4>";
            gen += "<h5>" + title + "</h5>";
            gen += "<h5>" + description + "</h5>";
            gen += "<h3>Schema</h3>";
            gen += generateTable(schemaSchema);
            gen += "<h3>Options</h3>";
            gen += generateTable(optionsSchema);

            text = text.substring(0, c1) + gen + text.substring(c2 + 3);

            fs.writeFileSync(filePath, text);
        }
    }
};

var applyBuilder = function(basePath)
{
    var Alpaca = require("./build/alpaca/web/alpaca");

    var all = wrench.readdirSyncRecursive(basePath);

    var files = [];
    for (var i = 0; i < all.length; i++)
    {
        if (all[i].indexOf(".html") > -1)
        {
            files.push(all[i]);
        }
    }

    for (var i = 0; i < files.length; i++)
    {
        console.log("Apply: " + files[i] + " (" + i + "/" + files.length + ")");

        applyBuilderToFile(files[i], Alpaca);
    }
};
