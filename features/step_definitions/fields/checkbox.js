var _ = require('lodash');

var fields = function() {

  /**
   * Helper to make creating checkbox fields easier.
   *
   * @param {Object}   options The options to pass to alpaca.
   * @param {function} cb      A function to call when complete.
   */
  var createCheckboxField = function(options, cb) {
    this.alpaca(_.extend(options || {}, {
      schema: {
        type: 'boolean'
      }
    }), cb);
  };

  /**
   * Creates a simple checkbox field
   */
  this.Given(/^I am on a page with a checkbox field$/, function(cb) {
    createCheckboxField.bind(this)(undefined, cb);
  });

  /**
   * Give some json to customize the checkbox field
   */
  this.Given(/^I am on a page with a checkbox field with (.*)$/, function(json, cb) {
    createCheckboxField.bind(this)(JSON.parse(json), cb);
  });

  this.Given(/^I am on a page with a checkbox field representing an enum$/, function(cb) {
    this.alpaca({
      data: "foo, bar, baz",
      schema: {
        type: "string",
        enum: ["foo", "bar", "bing", "baz"]
      },
      options: {
        type: "checkbox"
      }
    }, cb);
  });

};

module.exports = fields;
