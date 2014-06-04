var fields = function() {

  this.Given('I am on a page with required fields and the hideInitValidationError flag on', function(cb) {
    this.alpaca({
      data: {

      },
      schema: {
        type: 'object',
        properties: {
          required: {
            required: true,
            type: 'string'
          }
        }
      },
      options: {
        hideInitValidationError: true,
        fields: {
          required: {

          }
        }
      }
    }, cb);
  });

};

module.exports = fields;
