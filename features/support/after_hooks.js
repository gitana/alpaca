/**
 * Hooks that are ran after each cucumber test are defined here.
 */
var afterHooks = function() {

  this.After(function(cb) {
    this.clearFixture().then(function() {
      cb();
    });
  });

};

module.exports = afterHooks;
