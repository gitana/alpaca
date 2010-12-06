(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Number field control
     *
     * The following additional settings are permitted:
     *
     * {
     *    min: <number>                                  minimum value
     *    max: <number>                                  maximum value
     * }
     *
     * This field obeys JSON Schema for:
     *
     * {
     *    minimum: <number>,							[optional]
     *    maximum: <number>,							[optional]
     *    exclusiveMinimum: <boolean>,					[optional]
     *    exclusiveMaximum: <boolean>,					[optional]
     *    divisibleBy: <number>                         [optional]
     * }
     */
    Alpaca.Fields.NumberField = Alpaca.Fields.TextField.extend({
    		
        /**
         * @Override
         *
         */
        getValue: function() {
            var textValue = $(this.inputElement).val();
            return parseFloat(textValue);
        },
        
        /**
         * @Override
         *
         */
        handleValidate: function() {
            var baseStatus = this.base();
            
            var valInfo = this.validation;
            valInfo["stringNotANumber"] = {
                "message": "",
                "status": this._validateNumber()
            };
            if (!this._validateNumber()) {
                valInfo["stringNotANumber"]["message"] = Alpaca.getMessage("stringNotANumber", this);
            }
            valInfo["stringDivisibleBy"] = {
                "message": "",
                "status": this._validateDivisibleBy()
            };
            if (!this._validateDivisibleBy()) {
                valInfo["stringDivisibleBy"]["message"] = Alpaca.substituteTokens(Alpaca.getMessage("stringDivisibleBy", this), [this.schema.divisibleBy]);
            }
            valInfo["stringValueTooLarge"] = {
                "message": "",
                "status": this._validateMaximum()
            };
            if (!this._validateMaximum()) {
				if (this.schema.exclusiveMaximum) {
					valInfo["stringValueTooLarge"]["message"] = Alpaca.substituteTokens(Alpaca.getMessage("stringValueTooLargeExclusive", this), [this.schema.maximum]);
				} else {
					valInfo["stringValueTooLarge"]["message"] = Alpaca.substituteTokens(Alpaca.getMessage("stringValueTooLarge", this), [this.schema.maximum]);					
				}
            }
            valInfo["stringValueTooSmall"] = {
                "message": "",
                "status": this._validateMinimum()
            };
            if (!this._validateMinimum()) {
				if (this.schema.exclusiveMinimum) {
					valInfo["stringValueTooSmall"]["message"] = Alpaca.substituteTokens(Alpaca.getMessage("stringValueTooSmallExclusive", this), [this.schema.minimum]);
				} else {
					valInfo["stringValueTooSmall"]["message"] = Alpaca.substituteTokens(Alpaca.getMessage("stringValueTooSmall", this), [this.schema.minimum]);
				}
            }
            return baseStatus && valInfo["stringNotANumber"]["status"] && valInfo["stringDivisibleBy"]["status"] && valInfo["stringValueTooLarge"]["status"] && valInfo["stringValueTooSmall"]["status"];
        },
        
        /**
         * Validates if it is a number
         */
        _validateNumber: function() {
            var textValue = $(this.inputElement).val();
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
            if (!textValue.match(/^([\+\-]?((([0-9]+(\.)?)|([0-9]*\.[0-9]+))([eE][+-]?[0-9]+)?))$/)) {
                return false;
            }
            
            return true;
        },
        
        /**
         * Validates DivisibleBy
         */
        _validateDivisibleBy: function() {
            var floatValue = this.getValue();
            
            if (this.schema.divisibleBy) {
                if (!(floatValue % this.schema.divisibleBy == 0)) {
                    return false;
                }
            }
            
            return true;
        },
        
        /**
         * Validates Maximum
         */
        _validateMaximum: function() {
            var floatValue = this.getValue();
            
            if (this.schema.maximum) {
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
         * Validates Minimum
         */
        _validateMinimum: function() {
            var floatValue = this.getValue();
            
            if (this.schema.minimum) {
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
        }
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
