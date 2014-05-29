var fields = function() {

  this.World = require("../../support/world.js").World;

  this.Given(/^I am on a page with an array field with the data \[(.*)\]$/, function(data, cb) {

    var data = data.split(',').map(function(str) {
      return str.replace(/\s/, '');
    });

    this.eval(function(data) {
      $('#fixture').alpaca({
        data: data,
        schema: {
          type: 'array'
        },
        options: {

        }
      });
    }, function() {
      setTimeout(cb, 100);
    }, data);

  });

  this.Given(/^I am on a page with an array field with (\d+) elements?$/, function(num, cb) {

    var data = [
      'foo', 'bar', 'baz', 'bizz', 'boo', 'bam'
    ];

    data = data.slice(0, num);

    this.eval(function(data) {
      $('#fixture').alpaca({
        data: data,
        schema: {
          type: 'array'
        },
        options: {

        }
      });
    }, function() {
      setTimeout(cb, 100);
    }, data);

  });

  this.When(/^I click on the array bar's (.*) button$/, function(type, cb) {

    this.eval(function(type) {
      var btn = $($('#fixture').find('[data-alpaca-array-actionbar-action="' + type + '"]')[0]);
      btn.click();
    }, cb, type);

  });

};

module.exports = fields;
