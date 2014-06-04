var _ = require('lodash');

var fields = function() {

  /**
   * Place an any field in display mode with a given value on the page.
   */
  this.Given(/^I am on a page with an any field with the value "([^"]*)" in display only mode$/, function(value, cb) {
    this.createAnyField({ data: value, view: 'bootstrap-display' }, cb);
  });

  /**
   * Creates an any field with a maximum length.
   */
  this.Given(/^I am on a page with an any field that has a max length of (\d+)$/, function(len, cb) {
    this.createAnyField({ schema: { maxLength: len, type: 'string' } }, cb);
  });

};

module.exports = fields;
