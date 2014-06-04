var _ = require('lodash');

var fields = function() {

  /**
   * Create an alpaca form with two number fields
   */
  this.Given(/I am on a page with an alpacaForm with two number fields/, function(cb) {
    this.createAnyField({
      data: { a: 0, b: 0 },
      schema: {
        properties: {
          a: {
            type: 'number'
          },
          b: {
            type: 'number'
          }
        }
      }
    }, cb)
  });

};

module.exports = fields;
