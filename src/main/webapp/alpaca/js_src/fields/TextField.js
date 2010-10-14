(function($) {
	
	var Alpaca = $.alpaca;	

	/**
	 * Basic text field control
	 * 
	 * The following additional settings are permitted:
	 * 
	 * {
	 *    size: <number>								size attribute for input element
	 *    readonly: <boolean>                           whether to mark the input control as readonly
	 *    formName: <string>                            http post form name
	 * }
	 * 
	 * This field obeys JSON Schema for:
	 * 
	 * {
	 *    minLength: <number>,                          [optional]
	 *    maxLength: <number>,                          [optional]
	 *    pattern: <string>                             [optional]
	 * }
	 */	
	Alpaca.Fields.TextField = Alpaca.ControlField.extend({ 
				
    	/**
    	 * Renders an INPUT control into the field container
    	 */
    	renderField: function(onSuccess)
    	{
			// decorate the field container with our class
			$(this.fieldContainer).addClass("alpaca-textfield");
    		
    		// input field
    		this.inputElement = $("<input/>");
    		this.inputElement.attr({"type": "text"});
    		this.inputElement.attr({"id": $(this.getEl()).attr("id") + "-field"});
    		    		
    		/** size **/
    		if (this.settings.size)
    		{
    			$(this.inputElement).attr({"size": this.settings.size});
    		}
    		
    		/** readonly **/
    		if (this.settings.readonly)
    		{
    			$(this.inputElement).attr({"readonly": "on"});
    		}
    		
    		/** form post name **/
    		if (this.settings.formName)
    		{
    			$(this.inputElement).attr({"name": this.settings.formName});
    		}
    		    			   
    		// append to the main element
    		$(this.inputElement).appendTo(this.fieldContainer);
    		
    		if (onSuccess)
    		{
    			onSuccess();
    		}
    	},
    	
    	/**
    	 * @Override
    	 * 
    	 * Sign up for events against the INPUT control
    	 */
    	initEvents: function()
    	{
    		this.base();
    		
			var _this = this;
			
			$(this.inputElement).keypress(function(e) {
				_this.onKeyPress(e);
			});

			$(this.inputElement).keyup(function(e) {
				_this.onKeyUp(e);
			});

			$(this.inputElement).click(function(e) {
				_this.onClick(e);
			});
			
			// trigger control level handlers for things that happen to input element
			$(this.inputElement).change(function(e) {
				_this.onChange(e);
			});
			
			$(this.inputElement).focus(function(e) {
				_this.onFocus(e);
			});

			$(this.inputElement).blur(function(e) {
				_this.onBlur(e);
			});			
    	},
    	
    	/**
    	 * @Override
    	 * 
    	 * Return the value of the input control
    	 */
    	getValue: function()
    	{
    		return $(this.inputElement).val();
    	},
    	
    	/**
    	 * @Override
    	 * 
    	 * Set value onto the input contorl
    	 */
    	setValue: function(value, stopUpdateTrigger)
    	{
    		if (value)
    		{
    			$(this.inputElement).val(value);
    		}
    		else
    		{
    			$(this.inputElement).val("");
    		}

    		// be sure to call into base method
    		this.base(value, stopUpdateTrigger);
    	},
    	
    	/**
    	 * @Override
    	 */
    	handleValidate: function()
    	{
    		if (!this._validatePattern())
    		{
    			return false;
    		}
    		
    		if (!this._validateMaxLength())
    		{
    			return false;
    		}
    		
    		if (!this._validateMinLength())
    		{
    			return false;
    		}
    		
    		return this.base();
    	},
    	
    	_validatePattern: function()
    	{
    		var val = this.getValue();
    		
    		// JSON SCHEMA - regular expression pattern
    		if (this.schema.pattern)
    		{
    			if (!val.match(this.schema.pattern))
    			{
    				return false;
    			}
    		}
    		
    		return true;
    	},
    	
    	_validateMinLength: function()
    	{
    		var val = this.getValue();
    		
    		// JSON SCHEMA - minLength
    		if (this.schema.minLength)
    		{
    			if (val.length < this.schema.minLength)
    			{
    				return false;
    			}
    		}
    		
    		return true;
    	},
    	
    	_validateMaxLength: function()
    	{
    		var val = this.getValue();
    		
    		// JSON SCHEMA - maxLength
    		if (this.schema.maxLength)
    		{
    			if (val.length > this.schema.maxLength)
    			{
    				return false;
    			}
    		}    		
    		
    		return true;
    	},
    	
    	/**
    	 * @Override
    	 */
    	disable: function()
    	{
    		this.inputElement.disabled = true;
    	},
    	
    	/**
    	 * @Override
    	 */
    	enable: function()
    	{
    		this.inputElement.disabled = false;
    	},
    	
    	/**
    	 * @Override
    	 */
    	focus: function()
    	{
    		this.inputElement.focus();
    	},
    	
    	/**
    	 * @Override
    	 */
    	getValidationStateMessage: function(state)
    	{
    		if (state == Alpaca.STATE_INVALID)
    		{
    			if (!this._validateMinLength())
    			{
    				return Alpaca.substituteTokens(Alpaca.messages.stringTooShort, [this.schema.minLength]);
    			}
    			
    			if (!this._validateMaxLength())
    			{
    				return Alpaca.substituteTokens(Alpaca.messages.stringTooLong, [this.schema.maxLength]);
    			}
    		}
    		
    		return this.base(state);
    	},
    	    	
    	
		///////////////////////////////////////////////////////////////////////////////////////////////
		//
		// EVENT HANDLERS
		//
		///////////////////////////////////////////////////////////////////////////////////////////////		

    	onKeyPress: function(e) 
    	{
    		// EXTENSION POINT
    	},
    	
    	onKeyUp: function(e)
    	{
    		// EXTENSION POINT
    	},
    	
    	onClick: function(e)
    	{
    		// EXTENSION POINT
    	}
    	
    });
    
    Alpaca.messages.stringTooShort = "This field should contain at least {0} numbers or characters";
    Alpaca.messages.stringTooLong = "This field should contain at most {0} numbers or characters";
    
    Alpaca.registerFieldClass("text", Alpaca.Fields.TextField);

})(jQuery);
