var path    = require('path');
var phantom = require('phantom');

var World = function(cb) {

  var world = {};

  // open ./cucumber.html
  var url = path.join(__dirname, 'cucumber.html');

  phantom.create(function(ph) {
    ph.createPage(function(page) {
      page.open(url, function(status) {

        world.page = page;
        world.eval = page.evaluate;

        world.clearFixture = function() {
          page.evaluate(function() {
            $('#fixture').empty();
          });
        };

        cb(world);
      });
    });
  }, {
    dnodeOpts: {
      weak: false
    }
  });

};

exports.World = World;
