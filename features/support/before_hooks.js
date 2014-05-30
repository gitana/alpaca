var beforeHooks = function() {

  this.Before(function(cb) {
    cb();
  });

};

module.exports = beforeHooks;
