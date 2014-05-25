// title case a string
var tc = function(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// camel case a string
var cc = function(str) {
  var temp = pc(str);
  return temp.charAt(0).toLowerCase() + temp.slice(1);
};

// pascal case a string
var pc = function(str) {
  var temp = str.replace(/\s/, '');
  return temp.charAt(0).toUpperCase() + temp.slice(1);
};

var zombie = require('zombie');

var World = function(cb) {

  var world = {};

  world.browser = new zombie();
  world.browser.visit('./zombie.html');

  var $ = browser.window.$;

  var fixture = $('<div></div>');

  $('body').append(fixture);

  world.fixture = fixture;

  world.clearFixture = function() {
    fixture.empty();
  };

  world.createField = function(type) {
    var field = Alpaca.Fields[pc(type) + 'Field'];
  };

  cb(world);

};

exports.World = World;
