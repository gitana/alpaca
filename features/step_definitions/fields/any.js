var _ = require('lodash');

var fields = function() {

  /**
   * Helper to make creating any fields easier.
   *
   * @param {Object}   options The options to pass to alpaca.
   * @param {function} cb      A function to call when complete.
   */
  var createAnyField = function(options, cb) {
    options = _.extend(options || {}, {
      schema: {
        type: 'any'
      }
    });
    this.eval(function(options) {
      $('#fixture').alpaca(options);
    }, options).then(function() {
      setTimeout(cb, 100);
    });
  };

  /**
   * Place an any field on the page.
   */
  this.Given(/^I am on a page with an any field$/, function(cb) {
    createAnyField.bind(this)('', cb);
  });

  /**
   * Place an any field in display mode with a given value on the page.
   */
  this.Given(/^I am on a page with an any field with the value "([^"]*)" in display only mode$/, function(value, cb) {
    createAnyField.bind(this)({ data: value, view: 'bootstrap-display' }, cb);
  });

};

module.exports = fields;
