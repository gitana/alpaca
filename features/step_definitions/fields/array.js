var _ = require('lodash');

var fields = function() {

  /**
   * Helper to make creating array fields easier.
   *
   * @param {Object}   options The options to pass to alpaca.
   * @param {function} cb      A function to call when complete.
   */
  var createArrayField = function(options, cb) {
    options = _.extend(options || {}, {
      schema: {
        type: 'array'
      }
    });
    this.eval(function(options) {
      $('#fixture').alpaca(options);
    }, options).then(function() {
      setTimeout(cb, 100);
    });
  };

  /**
   * Place an array field on the page with the given data.
   */
  this.Given(/^I am on a page with an array field with the data \[(.*)\]$/, function(data, cb) {
    var data = data.split(',').map(function(str) {
      return str.replace(/\s|"/g, '');
    });

    createArrayField.bind(this)({ data: data }, cb);
  });

  /**
   * Place an array field on the page with a given size.
   */
  this.Given(/^I am on a page with an array field with (\d+) elements?$/, function(num, cb) {
    var data = [
      'foo', 'bar', 'baz', 'bizz', 'boo', 'bam'
    ];

    data = data.slice(0, num);

    createArrayField.bind(this)({ data: data }, cb);
  });

  /**
   * Click on a given button of the the first action bar.
   */
  this.When(/^I click on the array bar's (\S*) button$/, function(type, cb) {
    this.eval(function(type) {
      var btn = $($('#fixture').find('[data-alpaca-array-actionbar-action="' + type + '"]')[0]);
      btn.click();
    }, type).then(cb);
  });

};

module.exports = fields;
