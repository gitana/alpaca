var _ = require('lodash');

var defaults = {

  address: {
    options: {
      type: 'address'
    }
  },

  alpacaForm: {

  },

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
  },

  ckeditor: {
    options: {
      type: 'ckeditor',

      "ckeditor": {
        "toolbar": [
          ['Format', 'Font', 'FontSize'],
          ['Bold', 'Italic', 'Underline', 'StrikeThrough', '-', 'Undo', 'Redo', '-', 'Cut', 'Copy', 'Paste', 'Find', 'Replace', '-', 'Outdent', 'Indent', '-', 'Print'], '/', ['NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
          ['Image', 'Table', '-', 'Link', 'Flash', 'Smiley', 'TextColor', 'BGColor', 'Source']
        ]
      }

    }
  },

  country: {
    options: {
      type: 'country'
    }
  },

  currency: {
    options: {
      type: 'currency'
    }
  },

  file: {
    options: {
      type: 'file'
    },
    schema: {
      type: 'string',
      format: 'uri'
    }
  },

  grid: {
    data: [
      {
        sku: 'sku1',
        name: 'name1',
        price: 100,
        quantity: 10,
        total: 1000
      },
      {
        sku: 'sku2',
        name: 'name2',
        price: 100,
        quantity: 10,
        total: 1000
      }
    ],
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          sku: {
            type: 'string'
          },
          name: {
            type: 'string'
          },
          price: {
            type: 'number'
          },
          quantity: {
            type: 'number'
          },
          total: {
            type: 'number'
          }
        }
      }
    },
    options: {
      type: 'grid',
      fields: {
        sky: {
            label: 'SKU'
        },
        name: {
            label: 'Name'
        },
        price: {
            label: 'Price'
        },
        quantity: {
            label: 'Quantity'
        },
        total: {
            label: 'Total'
        }
      }
    }
  },

  hidden: {
    options: {
      type: 'hidden'
    }
  },

  number: {
    data: 0,
    schema: {
      minimum: 0,
      maximum: 100,
    }
  },

  radio: {
    data: 'Coffee',
    options: {
      label: 'Ice cream',
      helper: 'Guess my favorite ice cream?'
    },
    schema: {
      required: true,
      enum: ['Vanilla', 'Chocolate', 'Coffee']
    }
  },

  select: {
    data: 'Coffee',
    options: {
      label: 'Ice cream',
      helper: 'Guess my favorite ice cream?'
    },
    schema: {
      enum: ['Vanilla', 'Chocolate', 'Coffee', 'Strawberry', 'Mint']
    }
  },

  textarea: {
    options: {
      type: 'textarea'
    }
  },

  text: {

  }

};

module.exports = _.mapValues(defaults, function(d) {
  return function(options, cb) {
    _.defaults(options, d);
    this.alpaca(options, cb);
  };
});
