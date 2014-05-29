var fields = function() {

  this.World = require("../../support/world.js").World;

  this.Then(/^I should see (\d+) (.*) tags?$/, function(num, type, cb) {

    this.eval(function(type) {
      return $('input:visible').length;
    }, function(n) {
      if (n == num) {
        cb();
      } else {
        cb.fail('Expected to see ' + num + ' ' + type + 's but saw ' + n);
      }
    }, type)

  });

};

module.exports = fields;
