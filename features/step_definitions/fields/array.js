var _ = require('lodash');

var fields = function() {

  /**
   * Place an array field on the page with the given data.
   */
  this.Given(/^I am on a page with an array field with the data \[(.*)\]$/, function(data, cb) {
    var data = data.split(',').map(function(str) {
      return str.replace(/\s|"/g, '');
    });

    this.createArrayField({ data: data }, cb);
  });

  /**
   * Place an array field on the page with a given size.
   */
  this.Given(/^I am on a page with an array field with (\d+) elements?$/, function(num, cb) {
    var data = [
      'foo', 'bar', 'baz', 'bizz', 'boo', 'bam'
    ];

    data = data.slice(0, num);

    this.createArrayField({ data: data }, cb);
  });

  /**
   * Click on a given button of the the first action bar.
   */
  this.When(/^I click on the array bar's (\S+) button$/, function(type, cb) {
    this.eval(function(type) {
      var btn = $($('#fixture').find('[data-alpaca-array-actionbar-action="' + type + '"]')[0]);
      btn.click();
    }, type).then(cb);
  });

  /**
   * Click on a given button of a specific action bar.
   */
  this.When(/^I click on the array bar's (.+) (\S+) button$/, function(ith, type, cb) {
    var i = this.ith(ith);
    this.eval(function(type, i) {
      var btn = $($('#fixture').find('[data-alpaca-array-actionbar-action="' + type + '"]')[i]);
      btn.click();
    }, type, i).then(cb);
  });

};

module.exports = fields;
