var _ = require('lodash');

var fields = function() {

  /**
   * Create an alpaca form with a check box for each possible value in the enum
   */
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
