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

        world.ith = function(i) {
          var s = i.toLowerCase();
          if (s === 'first')  return 0;
          if (s === 'second') return 1;
          if (s === 'third')  return 2;
          if (s === 'fourth') return 3;
          if (s === 'fifth')  return 4;
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
