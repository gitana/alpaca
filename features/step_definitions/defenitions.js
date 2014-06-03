var fields = function() {

  this.World = require("../support/world.js").World;

  /**
   * Basic field creator
   */
   this.Given(/^I am on a page with an? (\S+) field(?: with (.+))?$/, function(type, opt, cb) {
    opt = JSON.parse(opt || '{}');
    this['create' + this.ucFirst(type) + 'Field'](opt, cb);
   });

  /**
   * Wait some number of seconds before moving on to the next step.
   *
   * @param {number} num The number of seconds to wait.
   */
  this.Then(/^(?:after|I wait) (.*) seconds?/, function(num, cb) {
    setTimeout(cb, 1000 * num);
  });

  /**
   * Just calls the callback's pending method.
   */
  this.Then('pending', function(cb) {
    cb.pending();
  });

  /**
   * Looks for a number of elements which match a given selector.
   *
   * @param {number} num  The number of tags to look for.
   * @param {string} type The selector to use when looking for tags.
   */
  this.Then(/^I should see ([\d\.\,]+) "(.*)" tags?$/, function(num, type, cb) {
    num = num.replace(/\,/g, '');

    this.eval(function(type) {
      return $('#fixture').find(type + ':visible').length;
    }, type).then(function(n) {
      if (n == num) {
        cb();
      } else {
        cb.fail('Expected to see ' + num + ' ' + type + 's but saw ' + n);
      }
    });
  });

  /**
   * Checks the value of a tag on the screen.
   *
   * @param {string} ith  A string representing which tag to check (first, second, etc).
   * @param {string} type A selector.
   * @param {string} val  The expected value.
   */
  this.Then(/^the (\S+) (\S+) tag's value should be "(.*)"$/, function(ith, type, val, cb) {
    var i = this.ith(ith);

    this.eval(function(type, index) {
      return $($(type)[index]).val();
    }, type, i).then(function(result) {
      if (result == val) {
        cb();
      } else {
        cb.fail('The value of the ' + ith + ' ' + type + ' tag was expected to be ' + val + ' but was ' + result);
      }
    });
  });

  /**
   * Looks for a given string inside a tag exactly once.
   *
   * @param {string} val The value being looked for.
   */
  this.Then(/^I should see "([^"]*)"$/, function(val, cb) {
    this.eval(function(val) {
      var els = $('#fixture').find('*').andSelf();
      var i = 0;
      for (var k in els) {
        var el = els[k];
        if ((el.innerHTML || '').replace(/^\s+|\s+$/g, '') == val) {
          i++;
        }
      }
      return i;
    }, val).then(function(result) {
      if (result == 1) {
        cb();
      } else {
        cb.fail('Expected to see "' + val + '" one time but saw it ' + result + ' times');
      }
    });
  });

  /**
   * Used to set the value of a tag.
   */
  this.When(/^I set the value of the (.+) "([^"]*)" tag to "([^"]*)"$/, function(ith, selector, val, cb) {
    var i = this.ith(ith);
    this.eval(function(i, selector, val) {
      $($('#fixture').find(selector)[i]).val(val);
    }, i, selector, val).then(cb);
  });

  /**
   * Focus control
   */
  this.When(/^(?:I )?(un)?focus the (.+) "([^"]*)" tag$/, function(un, ith, selector, cb) {
    un = un && un.length > 0 ? true : false;
    var i = this.ith(ith);
    this.eval(function(i, selector, un) {
      $($('#fixture').find(selector)[i])[un ? 'blur' : 'focus']();
    }, i, selector, un).then(cb);
  });

  /**
   * Check if forms are valid
   */
  this.Then(/^the (?:(.+) )?alpaca field should be (in)?valid$/, function(ith, invalid, cb) {
    var i     = this.ith(ith || 'first');
    var valid = invalid && invalid.length > 0 ? false : true;
    this.eval(function(i, valid) {
      return valid === window.fields[i].isValid(true);
    }, i, valid).then(cb);
  });

};

module.exports = fields;
