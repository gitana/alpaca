/**
 * Hooks that are ran before each cucumber test are defined here.
 */
var beforeHooks = function() {

  this.Before(function(cb) {
    this.eval(function() {
      window.fields = [];
    });
    cb();
  });

};

module.exports = beforeHooks;
