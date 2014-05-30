var path      = require('path');
var webdriver = require('selenium-webdriver');

var driver = new webdriver.Builder().
    withCapabilities(webdriver.Capabilities.chrome()).
    build();

var World = function(cb) {

  var world = {};

  // open ./cucumber.html
  var url = path.join(__dirname, 'cucumber.html');

  driver.get('file://' + url).then(function() {

    world.driver = driver;

    world.clearFixture = function() {
      driver.executeScript("$('#fixture').empty()");
    };

    world.eval = function(fn, cb) {
      var args = Array.prototype.slice.call(arguments, 2).map(function(str) {
        return JSON.stringify(str);
      });
      var result = driver.executeScript('return (' + fn.toString() + ')(' + args.join(',') + ');');
      result.then(function(result) {
        if (cb) cb(result);
      });
      return result;
    };

    cb(world);

  });

};

exports.World = World;
