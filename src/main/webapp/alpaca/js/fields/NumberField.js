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
	 *    minimumCanEqual: <boolean>,					[optional]
	 *    maximumCanEqual: <boolean>,					[optional]
	 *    divisibleBy: <number>                         [optional]
	 * }
	 */	
	Alpaca.Fields.NumberField = Alpaca.Fields.TextField.extend({

    	getValue: function()
    	{
    		var textValue = $(this.inputElement).val();
    		return parseFloat(textValue);
    	},

    	handleValidate: function()
    	{
    		// check to make sure this is a number
    		if (!this._validateNumber())
    		{
    			return false;
    		}

    		// JSON SCHEMA - does this break a min value constraint?
    		if (!this._validateMinimum())
    		{
    			return false;
    		}

    		// JSON SCHEMA - does this break a max value constraint?
    		if (!this._validateMaximum())
    		{
    			return false;
    		}
    		
    		// JSON SCHEMA - divisible by
    		if (!this._validateDivisibleBy())
    		{
    			return false;
    		}

    		// hand off to parent to validate
    		return this.base();
    	},
    	
    	_validateNumber: function()
    	{
    		var textValue = $(this.inputElement).val();
    		var floatValue = this.getValue();

    		// quick check to see if what they entered was a number
    		if (isNaN(floatValue))
    		{
    			return false;
    		}
    		
    		// check if valid number format
    		if (!textValue.match(/^([\+\-]?((([0-9]+(\.)?)|([0-9]*\.[0-9]+))([eE][+-]?[0-9]+)?))$/))
    		{
    			return false;
    		}
    		
    		return true;
    	},
    	
    	_validateDivisibleBy: function()
    	{
    		var floatValue = this.getValue();
    		
    		if (this.schema.divisibleBy)
    		{
    			if (!(floatValue % this.schema.divisibleBy == 0))
    			{
    				return false;
    			}
    		}
    		
    		return true;
    	},
    	
    	_validateMaximum: function()
    	{
    		var floatValue = this.getValue();
    		
    		if (this.schema.maximum)
    		{
    			if (floatValue > this.schema.maximum)
    			{
    				return false;
    			}
    			
    			if (!Alpaca.isEmpty(this.schema.maximumCanEqual))
    			{
	    			if (floatValue == this.schema.maximumm && !this.schema.maximumCanEqual)
	    			{
	    				return false;
	    			}
    			}
    		}
    		
    		return true;
    	},
    	
    	_validateMinimum: function()
    	{
    		var floatValue = this.getValue();

    		if (this.schema.minimum)
    		{
    			if (floatValue < this.schema.minimum)
    			{
    				return false;
    			}
    			
    			if (!Alpaca.isEmpty(this.schema.minimumCanEqual))
    			{
	    			if (floatValue == this.schema.minimum && !this.schema.minimumCanEqual)
	    			{
	    				return false;
	    			}
    			}
    		}
    		
    		return true;
    	},
    	
    	/**
    	 * @Override
    	 */
    	getValidationStateMessage: function(state)
    	{
    		if (state == Alpaca.STATE_INVALID)
    		{
    			if (!this._validateNumber())
    			{
    				return Alpaca.messages.stringNotANumber;
    			}
    			
    			if (!this._validateDivisibleBy())
    			{
    				return Alpaca.substituteTokens(Alpaca.messages.stringDivisibleBy, [this.schema.divisibleBy]);
    			}
    			
    			if (!this._validateMinimum())
    			{
    				return Alpaca.substituteTokens(Alpaca.messages.stringValueTooSmall, [this.schema.minimum]);
    			}
    			
    			if (!this._validateMaximum())
    			{
    				return Alpaca.substituteTokens(Alpaca.messages.stringValueTooLarge, [this.schema.maximum]);
    			}
    		}
    		
    		return this.base(state);
    	},
    	
	});
	
	Alpaca.messages.stringValueTooSmall = "The minimum value for this field is {0}";
	Alpaca.messages.stringValueTooLarge = "The maximum value for this field is {0}";
	Alpaca.messages.stringDivisibleBy = "The value must be divisible by {0}";
	Alpaca.messages.stringNotANumber = "This value is not a number.";
	
	Alpaca.registerFieldClass("number", Alpaca.Fields.NumberField);

})(jQuery);
