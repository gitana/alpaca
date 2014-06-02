var fields = function() {

  this.World = require("../support/world.js").World;

  this.Then(/^after (.*) seconds?/, function(num, cb) {
    setTimeout(cb, 1000 * num);
  });

  this.Then(/^I should see (\d+) (.*) tags?$/, function(num, type, cb) {

    this.eval(function(type) {
      return $(type + ':visible').length;
    }, function(n) {
      if (n == num) {
        cb();
      } else {
        cb.fail('Expected to see ' + num + ' ' + type + 's but saw ' + n);
      }
    }, type)

  });

  this.Then(/^the (\S+) (\S+) tag's value should be (.*)$/, function(ith, type, val, cb) {

    var i = (function() {
      if (ith === 'first') return 0;
    })();

    this.eval(function(type, index) {
      return $($(type)[index]).val();
    }, function(result) {
      if (result == val) {
        cb();
      } else {
        cb.fail('The value of the ' + ith + ' ' + type + ' tag was expected to be ' + val + ' but was ' + result);
      }
    }, type, i);

  });

  this.Then(/^I should see "([^"]*)"$/, function(val, cb) {
    this.eval(function(val) {
      var els = $('*');
      var i = 0;
      for (var k in els) {
        var el = els[k];
        if ((el.innerHTML || '').replace(/^\s+|\s+$/g, '') == val) {
          i++;
        }
      }
      return i;
    }, function(result) {
      if (result == 1) {
        cb();
      } else {
        cb.fail('Expected to see "' + val + '" one time but saw it ' + result + '  times');
      }
    }, val);
  });

};

module.exports = fields;
