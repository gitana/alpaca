var _ = require('lodash');

var defaults = {

  any: {
    schema: {
      type: 'any'
    }
  },

  array: {
    schema: {
      type: 'array'
    }
  },

  checkbox: {
    schema: {
      type: 'boolean'
    }
  }

};

module.exports = _.mapValues(defaults, function(d, cb) {
  return function(options) {
    _.defaults(options, d);
    this.alpaca(options, cb);
  };
});
