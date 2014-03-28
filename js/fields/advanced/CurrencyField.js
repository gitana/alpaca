(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.CurrencyField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.CurrencyField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.TextField
         *
         * @class Currency Control
         *
         * @param {Object} container Field container.
         * @param {Any} data Field data.
         * @param {Object} options Field options.
         * @param {Object} schema Field schema.
         * @param {Object|String} view Field view.
         * @param {Alpaca.Connector} connector Field connector.
         * @param {Function} errorCallback Error callback.
         */
        constructor: function(container, data, options, schema, view, connector, errorCallback) {
            var pfOptionsSchema = this.getSchemaOfPriceFormatOptions().properties;
            for (var i in pfOptionsSchema) {
                var option = pfOptionsSchema[i];
                if (!(i in options)) {
                    options[i] = option.default || undefined;
                }
            }
            this.base(container, data, options, schema, view, connector, errorCallback);
        },

        /**
         * @see Alpaca.Fields.TextField#postRender
         */
        postRender: function(callback) {

            var self = this;

            this.base(function() {

                $(self.field).priceFormat(self.options);

                callback();

            });
        },

        /**
         * @see Alpaca.Fields.TextField#getValue
         */
        getValue: function() {
            if (this.options.unmask) {
                var unmasked   = "" + parseFloat(this.field.unmask());
                var len        = unmasked.length;
                var centsLimit = this.options.centsLimit;
                var value      = unmasked.substring(0, len - centsLimit)
                               + '.'
                               + unmasked.substring(len - centsLimit, len);
                return parseFloat(value);
            } else {
                return this.field.val();
            }
        },

        getSchemaOfPriceFormatOptions: function() {
            return {
                "properties": {
                    "allowNegative": {
                        "title": "Allow Negative",
                        "description": "Determines if negative numbers are allowed.",
                        "type": "boolean",
                        "default": false
                    },
                    "centsLimit": {
                        "title": "Cents Limit",
                        "description": "The limit of fractional digits.",
                        "type": "number",
                        "default": 2,
                        "minimum": 0
                    },
                    "centsSeparator": {
                        "title": "Cents Separator",
                        "description": "The separator between whole and fractional amounts.",
                        "type": "text",
                        "default": "."
                    },
                    "clearPrefix": {
                        "title": "Clear Prefix",
                        "description": "Determines if the prefix is cleared on blur.",
                        "type": "boolean",
                        "default": false
                    },
                    "clearSuffix": {
                        "title": "Clear Suffix",
                        "description": "Determines if the suffix is cleared on blur.",
                        "type": "boolean",
                        "default": false
                    },
                    "insertPlusSign": {
                        "title": "Plus Sign",
                        "description": "Determines if a plus sign should be inserted for positive values.",
                        "type": "boolean",
                        "default": false
                    },
                    "limit": {
                        "title": "Limit",
                        "description": "A limit of the length of the field.",
                        "type": "number",
                        "default": undefined,
                        "minimum": 0
                    },
                    "prefix": {
                        "title": "Prefix",
                        "description": "The prefix if any for the field.",
                        "type": "text",
                        "default": "$"
                    },
                    "suffix": {
                        "title": "Suffix",
                        "description": "The suffix if any for the field.",
                        "type": "text",
                        "default": ""
                    },
                    "thousandsSeparator": {
                        "title": "Thousands Separator",
                        "description": "The separator between thousands.",
                        "type": "string",
                        "default": ","
                    },
                    "unmask": {
                        "title": "Unmask",
                        "description": "If true then the resulting value for this field will be unmasked.  That is, the resulting value will be a float instead of a string (with the prefix, suffix, etc. removed).",
                        "type": "boolean",
                        "default": true
                    }
                }
            };
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {

            return Alpaca.merge(this.base(), this.getSchemaOfPriceFormatOptions());

        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "allowNegative": {
                        "type": "checkbox"
                    },
                    "centsLimit": {
                        "type": "number"
                    },
                    "centsSeparator": {
                        "type": "text"
                    },
                    "clearPrefix": {
                        "type": "checkbox"
                    },
                    "clearSuffix": {
                        "type": "checkbox"
                    },
                    "insertPlusSign": {
                        "type": "checkbox"
                    },
                    "limit": {
                        "type": "number"
                    },
                    "prefix": {
                        "type": "text"
                    },
                    "suffix": {
                        "type": "text"
                    },
                    "thousandsSeparator": {
                        "type": "string"
                    },
                    "unmask": {
                        "type": "checkbox"
                    }
                }
            });
        },

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Currency Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Provides an automatically formatted and configurable input for entering currency amounts.";
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "currency";
        }//__END_OF_BUILDER_HELPERS
    });

    Alpaca.registerFieldClass("currency", Alpaca.Fields.CurrencyField);

})(jQuery);
