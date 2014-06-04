/**
 * Hooks that are ran before each cucumber test are defined here.
 */
var beforeHooks = function() {

  this.Before(function(cb) {
    this.eval(function() {
      window.alpacaForms = [];
    });
    cb();
  });

};

module.exports = beforeHooks;
