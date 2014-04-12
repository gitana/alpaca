'use strict';

var through = require('through');
var path = require('path');
var gutil = require('gulp-util');
var Handlebars = require('handlebars');

module.exports = function(options) {
  var opts = options || {};
  var compilerOptions = opts.compilerOptions || {};

  return through(function(file) {
    if (file.isNull()) {
      return this.queue(file);
    }

    if (file.isStream()) {
      return this.emit('error', new gutil.PluginError('gulp-handlebars', 'Streaming not supported'));
    }

    var contents = file.contents.toString();
    var compiled = null;
    try {
      compiled = Handlebars.precompile(contents, compilerOptions).toString();
    }
    catch (err) {
      return this.emit('error', err);
    }

    file.contents = new Buffer(compiled);
    file.path = gutil.replaceExtension(file.path, '.js');

    // Options that take effect when used with gulp-define-module
    file.defineModuleOptions = {
      require: {
        Handlebars: 'handlebars'
      },
      context: {
        handlebars: 'Handlebars.template(<%= contents %>)'
      },
      wrapper: '<%= handlebars %>'
    };

    this.queue(file);
  });
};
