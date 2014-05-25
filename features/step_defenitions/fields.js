var fields = function() {

  this.World = require("../support/world.js").World;

  this.Given(/^I am on a page with an? (.*) field$/, function(type, cb) {
    this.createField(type);
    cb();
  });

};

module.exports = fields;
