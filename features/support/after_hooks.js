var afterHooks = function() {

  this.After(function(cb) {
    this.clearFixture();
    cb();
  });

};

module.exports = afterHooks;
