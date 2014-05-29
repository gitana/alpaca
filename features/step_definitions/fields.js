var fields = function() {

  this.World = require("../support/world.js").World;

  this.Given(/^I am on a page with an? (.*) field$/, function(type, cb) {

    this.eval(function() {
      $('#fixture').alpaca({
        data: [
          'foo', 'bar', 'baz'
        ],
        schema: {
          type: 'array'
        },
        options: {

        }
      });
    }, function() {
      setTimeout(cb, 100);
    });

  });

  this.When(/^I click on the array bar's (.*) button$/, function(type, cb) {

    this.eval(function(type) {
      var btn = $($('#fixture').find('[data-alpaca-array-actionbar-action="' + type + '"]')[0]);
      btn.click();
    }, cb, type);

  });

  this.Then(/^I should see (\d+) (.*)s?$/, function(num, type, cb) {

    this.eval(function(type) {
      return $('input').length;
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
