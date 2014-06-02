/**
 * Hooks that are ran before each cucumber test are defined here.
 */
var beforeHooks = function() {

  this.Before(function(cb) {
    cb();
  });

};

module.exports = beforeHooks;
