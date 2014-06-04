var path      = require('path');
var webdriver = require('selenium-webdriver');

var _ = require('lodash');

var driver = new webdriver.Builder().
    withCapabilities(webdriver.Capabilities.chrome()).
    build();

var World = function(cb) {

  var world = {};

  var url = path.join(__dirname, 'cucumber.html');

  /**
   * Uppercase the first letter in a given string
   */
  var ucFirst = world.ucFirst = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  /**
   * Converts a number string like "first"/"second"/"third" to an integer like 0/1/2
   *
   * @param {string} ith A string like "first"/"second"/"third"
   *
   * @returns {number} The number represented by the given parameter (minus one).
   */
  world.ith = function(str) {
    return [
      'first',
      'second',
      'third',
      'fourth',
      'fifth',
      'sixth',
      'seventh',
      'eighth',
      'ninth'
    ].indexOf(str.toLowerCase());
  };

  driver.get('file://' + url).then(function() {

    world.driver = driver;

    /**
     * Clears the #fixture element in the browser.
     *
     * @returns {promise} A promise which resolves when the browser is done clearing the element.
     */
    world.clearFixture = function() {
      return driver.executeScript("$('#fixture').empty()");
    };

    /**
     * Evaluates a given function in a browser.
     *
     * @param {function} fn   A function to be evaluated in the browser.
     * @param {*...}     args Arguments for the function.  Must be JSON serializable.
     *
     * @returns {Q.promise} A promise which resolves to the return value of the given function.
     */
    world.eval = function(fn /*, args... */) {
      var args = Array.prototype.slice.call(arguments, 1).map(function(str) {
        return JSON.stringify(str);
      });
      var result = driver.executeScript('return (' + fn.toString() + ')(' + args.join(',') + ');');
      return result;
    };

    world.click = function(selector) {
      return driver.findElement(webdriver.By.css(selector))
        .click();
    };

    world.type = function(selector, str) {
      return driver.findElement(webdriver.By.css(selector))
        .sendKeys(str);
    };

    /**
     * Helper function for calling alpaca in the browser.
     */
    world.alpaca = function(options, cb) {
      var p = this.eval(function(o) {
        o.postRender = function(field) {
          window.alpacaForms.push(field);
        };
        $('#fixture').alpaca(o);
      }, options);
      p.then(function(res) {
        if (typeof cb === 'function') {
          setTimeout(cb, 150);
        }
      });
      return p;
    };

    /**
     * Make simple fields
     */
    _.forEach(require('./fields/fields'), function(v, k) {
      world['create' + ucFirst(k) + 'Field'] = v;
    });

    cb(world);

  });

};

exports.World = World;
