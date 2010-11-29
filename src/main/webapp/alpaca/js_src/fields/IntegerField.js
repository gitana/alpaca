(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Integer field control
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
     *    minimumCanEqual: <boolean>,					[optional]
     *    maximumCanEqual: <boolean>,					[optional]
     *    divisibleBy: <number>                         [optional]
     * }
     */
    Alpaca.Fields.IntegerField = Alpaca.Fields.NumberField.extend({
    
        /**
         * @Override
         *
         */
        getValue: function() {
            var textValue = $(this.inputElement).val();
            return parseInt(textValue);
        },
        
        /**
         * @Override
         *
         */
        handleValidate: function() {
			
        	var baseStatus = this.base();
			
			var valInfo = this.validation;

			if (!valInfo["stringNotANumber"]["status"]) {
				valInfo["stringNotANumber"]["message"] = Alpaca.getMessage("stringNotAnInteger", this);
			}			
			
            return baseStatus;
        },
        
        /**
         * Validates if it is a number
         */
        _validateNumber: function() {
            var textValue = $(this.inputElement).val();
            var floatValue = this.getValue();
            
            // quick check to see if what they entered was a number
            if (isNaN(floatValue)) {
                return false;
            }
            
            // check if valid number format
            if (!textValue.match(/^([\+\-]?([1-9]\d*)|0)$/)) {
                return false;
            }
            
            return true;
        }
    });
    
    // Additional Registrations
    Alpaca.registerMessages({
        "stringNotAnInteger": "This value is not an integer."
    });
    Alpaca.registerFieldClass("integer", Alpaca.Fields.IntegerField);
})(jQuery);
