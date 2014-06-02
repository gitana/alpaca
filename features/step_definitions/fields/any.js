var fields = function() {

  this.World = require('../../support/world.js').World;

  var createAnyField = function(cb) {
    options = {
      schema: {
        type: 'any'
      }
    };
    this.eval(function(options) {
      $('#fixture').alpaca(options);
    }, function() {
      setTimeout(cb, 100);
    }, options);
  };

  this.Given(/^I am on a page with an any field$/, function(cb) {
    createAnyField.bind(this)(cb);
  });

};

module.exports = fields;
