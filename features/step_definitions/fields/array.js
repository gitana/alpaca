var fields = function() {

  this.World = require('../../support/world.js').World;

  var createArrayField = function(options, cb) {
    options.schema = {
      type: 'array'
    };
    this.eval(function(options) {
      $('#fixture').alpaca(options);
    }, function() {
      setTimeout(cb, 100);
    }, options);
  };

  this.Given(/^I am on a page with an array field with the data \[(.*)\]$/, function(data, cb) {

    var data = data.split(',').map(function(str) {
      return str.replace(/\s|"/g, '');
    });

    createArrayField.bind(this)({ data: data }, cb);

  });

  this.Given(/^I am on a page with an array field with (\d+) elements?$/, function(num, cb) {

    var data = [
      'foo', 'bar', 'baz', 'bizz', 'boo', 'bam'
    ];

    data = data.slice(0, num);

    createArrayField.bind(this)({ data: data }, cb);

  });

  this.When(/^I click on the array bar's (\S*) button$/, function(type, cb) {

    this.eval(function(type) {
      var btn = $($('#fixture').find('[data-alpaca-array-actionbar-action="' + type + '"]')[0]);
      btn.click();
    }, cb, type);

  });

};

module.exports = fields;
