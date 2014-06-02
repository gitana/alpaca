var _ = require('lodash');

var fields = function() {

  this.World = require('../../support/world.js').World;

  var createAnyField = function(options, cb) {
    options = _.extend(options || {}, {
      schema: {
        type: 'any'
      }
    });
    this.eval(function(options) {
      $('#fixture').alpaca(options);
    }, function() {
      setTimeout(cb, 100);
    }, options);
  };

  this.Given(/^I am on a page with an any field$/, function(cb) {
    createAnyField.bind(this)('', cb);
  });

  this.Given(/^I am on a page with an any field with the value "([^"]*)" in display only mode$/, function(value, cb) {
    createAnyField.bind(this)({ data: value, view: 'bootstrap-display' }, cb);
  });

};

module.exports = fields;
