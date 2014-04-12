'use strict';

var defineModule = require('../');
var gutil = require('gulp-util');
var path = require('path');
var fs = require('fs');

require('mocha');
require('should');

var fixtureFile = function(filePath) {
  var fixturesDir = path.join('test', 'fixtures');
  var fixturePath = path.join(fixturesDir, filePath);
  var file = new gutil.File({
    path: fixturePath,
    cwd: fixturesDir,
    base: path.dirname(fixturePath),
    contents: fs.readFileSync(fixturePath)
  });
  return file;
};

var streamThroughDefineModule = function(type, options, filePath, cb) {
  var stream = defineModule(type, options);
  var file = fixtureFile(filePath);
  cb(stream);
  stream.write(file);
  stream.end();
};

var fileShouldMatchExpected = function(file, filePath) {
  var expectedDir = path.join('test', 'expected');
  var expectedPath = path.join(expectedDir, filePath);
  file.contents.toString().should.equal(fs.readFileSync(expectedPath).toString());
};

describe('gulp-define-module', function() {
  describe('defineModule()', function() {

    var basic = function(type, options, variant) {
      return function(done) {
        streamThroughDefineModule(type, options, 'basic.js', function(stream) {
          stream.on('data', function(file) {
            var expectedName = 'basic_' + type;
            if (variant) { expectedName += '_' + variant; }
            fileShouldMatchExpected(file, expectedName + '.js');
            done();
          });
        });
      };
    };

    it('makes AMD modules', basic('amd'));
    it('makes CommonJS modules', basic('commonjs'));
    it('makes Node modules', basic('node'));
    it('makes plain modules', basic('plain'));

    it('throws when the the type is unsupported', function() {
      basic('invalid').should.throw(); // throws before it becomes async
    });

    var requireOptions = { require: { Library: 'library' } };
    it('hanldes require for AMD', basic('amd', requireOptions, 'require'));
    it('hanldes require for Node', basic('node', requireOptions, 'require'));
    it('ignores require for CommonJS', basic('commonjs', requireOptions));
    it('ignores require for plain', basic('plain', requireOptions));

    it('accepts wrapper option',
      basic('plain', { wrapper: 'App.TEMPLATES = TemplateWrapper(<%= contents %>)' }, 'wrapped'));

    it('accepts options.context as a string',
      basic('plain', {
        context: { customContents: '<%= contents %>' },
        wrapper: '<%= customContents %>'
      }));

    it('accepts options.context as a function',
      basic('plain', {
        context: function(context) {
          return {
            customContents: 'App.TEMPLATES = TemplateWrapper(' + context.contents + ')'
          };
        },
        wrapper: '<%= customContents %>'
      }, 'wrapped'));

    it('accepts options through incoming file', function(done) {
      var stream = defineModule('amd');
      var file = fixtureFile('basic.js');
      file.defineModuleOptions = requireOptions;
      stream.on('data', function(file) {
        fileShouldMatchExpected(file, 'basic_amd_require.js');
        done();
      });
      stream.write(file);
      stream.end();
    });

    describe('wrapper context', function() {
      it('defines name', basic('plain', {
        wrapper: 'App["<%= name %>"] = <%= contents %>'
      }, 'context_name'));
      it('defines file', basic('plain', {
        wrapper: 'App["<%= file.path %>"] = <%= contents %>'
      }, 'context_file'));
      it('defines contents', basic('plain', {
        wrapper: '<%= contents %>'
      }));
      it('handles nested paths for name', function(done) {
        var stream = defineModule('plain', {
          wrapper: 'App["<%= name %>"] = <%= contents %>'
        });
        var file = fixtureFile('nested/basic.js');
        stream.on('data', function(file) {
          fileShouldMatchExpected(file, 'basic_plain_context_name.js');
          done();
        });
        stream.write(file);
        stream.end();
      });
    });
  });
});
