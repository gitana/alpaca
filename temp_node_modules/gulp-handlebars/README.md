# gulp-handlebars [![NPM version][npm-image]][npm-url] [![Build status][travis-image]][travis-url]
> Handlebars plugin for gulp 3

## Usage

First, install `gulp-handlebars` and [`gulp-define-module`][gulp-define-module] as development dependencies:

```shell
npm install --save-dev gulp-handlebars gulp-define-module
```

## Template modules for Node.js

This example will make templates available for loading via [Node's require](http://nodejs.org/api/globals.html#globals_require):

```js
var handlebars = require('gulp-handlebars');
var defineModule = require('gulp-define-module');

gulp.task('templates', function(){
  gulp.src(['templates/*.hbs'])
    .pipe(handlebars())
    .pipe(defineModule('node'))
    .pipe(gulp.dest('build/templates/'));
});
```

Templates can then be used within Node as such:

```js
var appTemplate = require('./build/templates/App.Header.js');
var html = appTemplate(data);
```

## Namespaced templates for the browser

[`gulp-declare`][gulp-declare] can be used to safely declare template namespaces and make templates available for use in the browser:


```js
var handlebars = require('gulp-handlebars');
var defineModule = require('gulp-define-module');
var declare = require('gulp-declare');
var concat = require('gulp-concat');

gulp.task('templates', function(){
  gulp.src(['client/templates/*.hbs'])
    .pipe(handlebars())
    .pipe(defineModule('plain'))
    .pipe(declare({
      namespace: 'MyApp.templates'
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('build/js/'));
});
```

The templates path within the namespace is the base namespace combined with the template's filename. For a template named `App.Header.hbs` with a namespace of `MyApp.Templates`, the compiled template would be available as `MyApp.Templates.App.Header`.

The resulting `templates.js` would look like:

```js
this["MyApp"] = this["MyApp"] || {};
this["MyApp"]["templates"] = this["MyApp"]["templates"] || {};
this["MyApp"]["templates"]["App"] = this["MyApp"]["templates"]["App"] || {};
this["MyApp"]["templates"]["App"]["Header"] = Handlebars.template(function() { /* compiled template function */ });
```

[`gulp-define-module`][gulp-define-module] can also be used to assign templates as properties of an already declared namespace:

```js
var handlebars = require('gulp-handlebars');
var defineModule = require('gulp-define-module');
var concat = require('gulp-concat');

gulp.task('templates', function(){
  gulp.src(['client/templates/*.hbs'])
    .pipe(handlebars())
    .pipe(defineModule('plain', {
      // Assumes MyApp.Templates is already declared
      wrapper: 'MyApp.templates["<%= name %>"] = <%= handlebars %>'
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('build/js/'));
});
```

For a template named `App.Header.hbs`, the resulting `templates.js` would look like:

```js
MyApp.templates["App.Header"] = Handlebars.template(function() { /* compiled template function */ };
```

The [`gulp-define-module`][gulp-define-module] method above assumes the following:

 - `MyApp.templates` will be defined before the `templates.js` script is included for use in the browser
 - Templates with dots in their names will be assigned as `MyApp.Templates["App.Header"]`, not `MyApp.Templates.App.Header`
 - The template name does not contain double quotes

See the [`gulp-define-module` documentation][gulp-define-module documentation] for more details.


## Compiling to various module systems

See the [`gulp-define-module` documentation][gulp-define-module documentation] for details on how to define templates as AMD, Node, CommonJS, and hybrid modules.

`gulp-handlebars` makes the following available for use in `gulp-define-module`'s [`wrapper` template option](https://github.com/wbyoung/gulp-define-module#optionswrapper):

 - `<%= handlebars %>` - The Handlebars template, wrapped in a call to `Handlebars.template()`
 - `<%= contents %>` - The bare Handlebars template (not wrapped).

`gulp-handlebars` also sets a default [`require`](https://github.com/wbyoung/gulp-define-module#optionsrequire) of `{ Handlebars: 'handlebars' }` for [`gulp-define-module`][gulp-define-module] so Handlebars will be present in when defining AMD, Node, CommonJS, or hybrid modules.


## API

### handlebars(options)

#### options.compilerOptions
Type: `Object`

Compiler options to pass to `Handlebars.precompile()`.


[travis-url]: http://travis-ci.org/lazd/gulp-handlebars
[travis-image]: https://secure.travis-ci.org/lazd/gulp-handlebars.png?branch=master
[npm-url]: https://npmjs.org/package/gulp-handlebars
[npm-image]: https://badge.fury.io/js/gulp-handlebars.png

[gulp-define-module documentation]: https://github.com/wbyoung/gulp-define-module#definemoduletype-options
[gulp-define-module]: https://github.com/wbyoung/gulp-define-module
[gulp-handlebars]: https://github.com/lazd/gulp-handlebars
[gulp-declare]: https://github.com/lazd/gulp-declare
