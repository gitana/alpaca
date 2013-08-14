(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.NumberField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.NumberField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.TextField
         *
         * @class Control for JSON schema number type.
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
            this.base(container, data, options, schema, view, connector, errorCallback);
        },

        /**
         * @see Alpaca.Fields.TextField#getValue
         */
        getValue: function() {
            var textValue = this.field.val();
            if (Alpaca.isValEmpty(textValue)) {
                return -1;
            } else {
                return parseFloat(textValue);
            }
        },
        
        /**
         * @see Alpaca.Fields.TextField#postRender
         */
        postRender: function() {
            this.base();
			if (this.fieldContainer) {
				this.fieldContainer.addClass('alpaca-controlfield-number');
			}
        },		
				
        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function() {
            var baseStatus = this.base();
            
            var valInfo = this.validation;
			
			var status = this._validateNumber();
            valInfo["stringNotANumber"] = {
                "message": status ? "" : this.view.getMessage("stringNotANumber"),
                "status": status
            };

            status = this._validateDivisibleBy();
			valInfo["stringDivisibleBy"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.view.getMessage("stringDivisibleBy"), [this.schema.divisibleBy]),
                "status": status
            };

            status = this._validateMaximum();
			valInfo["stringValueTooLarge"] = {
                "message": "",
                "status": status
            };
            if (!status) {
                if (this.schema.exclusiveMaximum) {
                    valInfo["stringValueTooLarge"]["message"] = Alpaca.substituteTokens(this.view.getMessage("stringValueTooLargeExclusive"), [this.schema.maximum]);
                } else {
                    valInfo["stringValueTooLarge"]["message"] = Alpaca.substituteTokens(this.view.getMessage("stringValueTooLarge"), [this.schema.maximum]);
                }
            }
			
			status = this._validateMinimum();
            valInfo["stringValueTooSmall"] = {
                "message": "",
                "status": status
            };
            if (!status) {
                if (this.schema.exclusiveMinimum) {
                    valInfo["stringValueTooSmall"]["message"] = Alpaca.substituteTokens(this.view.getMessage("stringValueTooSmallExclusive"), [this.schema.minimum]);
                } else {
                    valInfo["stringValueTooSmall"]["message"] = Alpaca.substituteTokens(this.view.getMessage("stringValueTooSmall"), [this.schema.minimum]);
                }
            }
            return baseStatus && valInfo["stringNotANumber"]["status"] && valInfo["stringDivisibleBy"]["status"] && valInfo["stringValueTooLarge"]["status"] && valInfo["stringValueTooSmall"]["status"];
        },
        
        /**
         * Validates if it is a float number.
         * @returns {Boolean} true if it is a float number
         */
        _validateNumber: function() {
            var textValue = this.field.val();
            // allow null
            if (Alpaca.isValEmpty(textValue)) {
                return true;
            }
            var floatValue = this.getValue();
            
            // quick check to see if what they entered was a number
            if (isNaN(floatValue)) {
                return false;
            }
            
            // check if valid number format
            if (!textValue.match(Alpaca.regexps.number)) {
                return false;
            }
            
            return true;
        },
        
        /**
         * Validates divisibleBy constraint.
         * @returns {Boolean} true if it passes the divisibleBy constraint.
         */
        _validateDivisibleBy: function() {
            var floatValue = this.getValue();
            if (!Alpaca.isEmpty(this.schema.divisibleBy)) {

                // mod
                if (floatValue % this.schema.divisibleBy !== 0)
                {
                    return false;
                }
            }
            return true;
        },
        
        /**
         * Validates maximum constraint.
         * @returns {Boolean} true if it passes the maximum constraint.
         */
        _validateMaximum: function() {
            var floatValue = this.getValue();
            
            if (!Alpaca.isEmpty(this.schema.maximum)) {
                if (floatValue > this.schema.maximum) {
                    return false;
                }
                
                if (!Alpaca.isEmpty(this.schema.exclusiveMaximum)) {
                    if (floatValue == this.schema.maximum && this.schema.exclusiveMaximum) {
                        return false;
                    }
                }
            }
            
            return true;
        },
        
        /**
         * Validates maximum constraint.
         * @returns {Boolean} true if it passes the minimum constraint.
         */
        _validateMinimum: function() {
            var floatValue = this.getValue();
            
            if (!Alpaca.isEmpty(this.schema.minimum)) {
                if (floatValue < this.schema.minimum) {
                    return false;
                }
                
                if (!Alpaca.isEmpty(this.schema.exclusiveMinimum)) {
                    if (floatValue == this.schema.minimum && this.schema.exclusiveMinimum) {
                        return false;
                    }
                }
            }
            
            return true;
        },//__BUILDER_HELPERS

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(), {
				"properties": {
					"minimum": {
						"title": "Minimum",
						"description": "Minimum value of the property.",
						"type": "number"
					},
					"maximum": {
						"title": "Maximum",
						"description": "Maximum value of the property.",
						"type": "number"
					},
					"exclusiveMinimum": {
						"title": "Exclusive Minimum",
						"description": "Property value can not equal the number defined by the minimum schema property.",
						"type": "boolean",
						"default": false
					},
					"exclusiveMaximum": {
						"title": "Exclusive Maximum",
						"description": "Property value can not equal the number defined by the maximum schema property.",
						"type": "boolean",
						"default": false
					}
				}				
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsSchema
         */
        getOptionsForSchema: function() {
			return Alpaca.merge(this.base(), {
				"fields": {
					"minimum": {
						"title": "Minimum",
						"description": "Minimum value of the property",
						"type": "number"
					},
					"maximum": {
						"title": "Maximum",
						"description": "Maximum value of the property",
						"type": "number"
					},
					"exclusiveMinimum": {
						"rightLabel": "Exclusive minimum ?",
						"helper": "Field value must be greater than but not equal to this number if checked",
						"type": "checkbox"
					},
					"exclusiveMaximum": {
						"rightLabel": "Exclusive Maximum ?",
						"helper": "Field value must be less than but not equal to this number if checked",
						"type": "checkbox"
					}
				}
			});
		},

		/**
         * @see Alpaca.Fields.TextField#getTitle
		 */
		getTitle: function() {
			return "Number Field";
		},
		
		/**
         * @see Alpaca.Fields.TextField#getDescription
		 */
		getDescription: function() {
			return "Field for float numbers.";
		},

		/**
         * @see Alpaca.Fields.TextField#getType
         */
        getType: function() {
            return "number";
        },

		/**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "number";
        }//__END_OF_BUILDER_HELPERS
    });
    
    // Additional Registrations
    Alpaca.registerMessages({
        "stringValueTooSmall": "The minimum value for this field is {0}",
        "stringValueTooLarge": "The maximum value for this field is {0}",
        "stringValueTooSmallExclusive": "Value of this field must be greater than {0}",
        "stringValueTooLargeExclusive": "Value of this field must be less than {0}",
        "stringDivisibleBy": "The value must be divisible by {0}",
        "stringNotANumber": "This value is not a number."
    });
    Alpaca.registerFieldClass("number", Alpaca.Fields.NumberField);
    Alpaca.registerDefaultSchemaFieldMapping("number", "number");
})(jQuery);
