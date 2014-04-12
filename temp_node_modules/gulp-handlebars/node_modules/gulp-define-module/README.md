# gulp-define-module [![NPM version][npm-image]][npm-url] [![Build status][travis-image]][travis-url]

The gulp define module plugin produces modules from a simple function input. It allows
[other plugins](https://github.com/wbyoung/gulp-ember-emblem) to offload module definition
to a separate plugin. For consistency, the input function should not include a trailing semicolon.

An example input file:

```javascript
function() {
  // this is a module definition file that includes this single module.
  this.property = "some property";
}
```

Transformed to **Node** (`defineModule('node')`):

```javascript
module.exports = function() {
  // this is a module definition file that includes this single module.
  this.property = "some property";
};
```

Transformed to **AMD** (`defineModule('amd')`):

```javascript
define([], function() {
  return function() {
    // this is a module definition file that includes this single module.
    this.property = "some property";
  };
});
```

Transformed to **CommonJS** (`defineModule('commonjs')`):

```javascript
module.exports = function() {
  // this is a module definition file that includes this single module.
  this.property = "some property";
};
```

Transformed to **Plain** (`defineModule('plain')`):

```javascript
function() {
  // this is a module definition file that includes this single module.
  this.property = "some property";
};
```

To use the module simply include it in your gulp pipeline:

```javascript
var emberEmblem = require('gulp-ember-emblem');
var defineModule = require('gulp-define-module');

gulp.task('templates', function(){
  gulp.src(['client/templates/*.hbs'])
    .pipe(emberEmblem())
    .pipe(defineModule('node'))
    .pipe(gulp.dest('build/templates/'));
});
```


## API

### defineModule(type, [options])

#### type
Type: `String`  
Default: `bare`

The desired output type. One of the following:

* `node` - Produce Node modules
* `amd` - Produce AMD modules
* `commonjs` - Produce CommonJS modules
* `plain` - Return an unmolested function definition


#### options.require

Type: `Object`  
Default: `{}`

An object containing dependencies that should be imported for this module.
This option is only supported for `amd` and `node` modules. For other systems,
you will have to manage the dependency loading in another way.

The property name in the object should be the value of the variable that the
dependency will be accessed from, and the property value should be the name
of the dependency.

For instance, `{ Library: 'library' }` will produce:

**Node**

```javascript
var Library = global.Library || require('library');

module.exports = function() {
};

```

**AMD**

```javascript
define(['library'], function(Library) {
  return function() {
  };
});
```


#### options.wrapper

Type: `String`  
Default: `false`

Wrapper in which to wrap input modules. This wrapper will be processed
through [lodash.template] with the following context:

[gulp-handlebars], for instance, sets a wrapper of `"Handlebars.template(<%= contents %>)"`.

#### options.context

Type: `Object` or `Function`  
Default: `undefined`

Extend the context that's used to process the wrapper. If you pass an object, it will simply
be merged with the default context.

A function argument should have the signature `function(context) { return {}; }`. The
default context will be passed to your function and you can return new values to add
to the context. For instance, you can create complex definitions on a per-file basis.

```js
defineModule('plain', {
  wrapper: 'MyApp.templates["<%= templateName %>"] = <% contents %>',
  context: function(context) {
    var file = context.file;
    var name = path.relative(file.cwd, file.path)
      .slice(0, -path.extname(file.path).length)
      .split(path.sep).join('.');
    return { templateName: name };
  }
})
```

This will result in a template file, `app/view.js` with an empty function, `function() {}`, being compiled to
`MyApp.templates["app.view"] = function() {};`.


## For gulp plugin developers

Plugin developers can pass options on to this plugin so that users don't have to define
values that may be the most common setup for modules.

To do so set the `defineModuleOptions` on the [`file`](https://github.com/gulpjs/gulp-util#new-fileobj)
object. This object will be merged with options that users pass in to their `defineModule` pipe
(user's options take precedence). It's recommended that if you define _wrapper_ in these options,
that you make it a single value from the _context_ for usage simplicity.

For an example, see [gulp-ember-emblem].


[travis-url]: http://travis-ci.org/wbyoung/gulp-define-module
[travis-image]: https://secure.travis-ci.org/wbyoung/gulp-define-module.png?branch=master
[npm-url]: https://npmjs.org/package/gulp-define-module
[npm-image]: https://badge.fury.io/js/gulp-define-module.png

[gulp-define-module]: https://github.com/wbyoung/gulp-define-module
[gulp-handlebars]: https://github.com/lazd/gulp-handlebars
[gulp-ember-emblem]: https://github.com/wbyoung/gulp-ember-emblem
[lodash.template]: http://lodash.com/docs#template
