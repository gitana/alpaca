(function($) {

    var round = (function() {
        var strategies = {
            up:      Math.ceil,
            down:    function(input) { return ~~input; },
            nearest: Math.round
        };
        return function(strategy) {
            return strategies[strategy];
        };
    })();

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
            options = options || {};

            var pfOptionsSchema = this.getSchemaOfPriceFormatOptions().properties;
            for (var i in pfOptionsSchema) {
                var option = pfOptionsSchema[i];
                if (!(i in options)) {
                    options[i] = option["default"] || undefined;
                }
            }

            if (typeof(data) !== "undefined")
            {
                data = "" + parseFloat(data).toFixed(options.centsLimit);
            }

            this.base(container, data, options, schema, view, connector, errorCallback);
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "currency";
        },

        /**
         * @see Alpaca.Fields.TextField#postRender
         */
        afterRenderControl: function(model, callback) {

            var self = this;

            var field = this.getControlEl();

            this.base(model, function() {

                $(field).priceFormat(self.options);

                callback();

            });
        },

        /**
         * @see Alpaca.Fields.ControlField#getControlValue
         */
        getControlValue: function() {

            var field = this.getControlEl();

            var val = $(field).is('input') ? field.val() : field.html();
            if (this.options.unmask || this.options.round !== "none") {
                var unmasked = function() {
                    var result = '';
                    for (var i in val) {
                        var cur = val[i];
                        if (!isNaN(cur)) {
                            result += cur;
                        } else if (cur === this.options.centsSeparator) {
                            result += '.';
                        }
                    }
                    return parseFloat(result);
                }.bind(this)();
                if (this.options.round !== "none") {
                    unmasked = round(this.options.round)(unmasked);
                    if (!this.options.unmask) {
                        var result = [];
                        var unmaskedString = "" + unmasked;
                        for (var i = 0, u = 0; i < val.length; i++) {
                            if (!isNaN(val[i])) {
                                result.push(unmaskedString[u++] || 0);
                            } else {
                                result.push(val[i]);
                            }
                        }
                        return result.join('');
                    }
                }
                return unmasked;
            } else {
                return val;
            }
        }

        /* builder_helpers */
        ,

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
                    "round": {
                        "title": "Round",
                        "description": "Determines if the field is rounded. (Rounding is done when getValue is called and is not reflected in the UI)",
                        "type": "string",
                        "enum": [ "up", "down", "nearest", "none" ],
                        "default": "none"
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
                    "round": {
                        "type": "select"
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
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("currency", Alpaca.Fields.CurrencyField);

})(jQuery);
