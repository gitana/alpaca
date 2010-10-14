(function($) {
	
	var Alpaca = $.alpaca;	

	/**
	 * Text area field
	 * 
	 * The following additional settings are permitted:
	 * 
	 * {
	 *    rows: <number>
	 *    cols: <number>
	 * }
	 */	
	Alpaca.Fields.TextAreaField = Alpaca.Fields.TextField.extend({

		setup: function()
		{
			this.base();
			
			if (!this.settings.rows)
			{
				this.settings.rows = 5;
			}
			
			if (!this.settings.cols)
			{
				this.settings.cols = 40;
			}
		},
		
    	/**
    	 * Renders an INPUT control into the field container
    	 */
    	renderField: function(onSuccess)
    	{
			// decorate the field container with our class
			$(this.fieldContainer).addClass("alpaca-textareafield");
    		
			this.textAreaElement = $("<textarea></textarea>");
			
			if (this.settings.rows)
			{
				this.textAreaElement.attr({ "rows" : this.settings.rows });
			}
			
			if (this.settings.cols)
			{
				this.textAreaElement.attr({ "cols" : this.settings.cols });
			}
			
			if (this.settings.formName)
			{
				this.textAreaElement.attr({ "name": this.settings.formName });
			}
			
			if (this.settings.readonly)
			{
				this.textAreaElement.attr({ "readonly" : this.settings.readonly });
			}

    		// append to the main element
    		$(this.textAreaElement).appendTo(this.fieldContainer);
    		
    		if (onSuccess)
    		{
    			onSuccess();
    		}
    	},
    	
    	setValue: function(value, stopUpdateTrigger)
    	{
    		$(this.textAreaElement).val(val);
    		
    		// be sure to call into base method
    		this.base(value, stopUpdateTrigger);
    	},
		
    	getValue: function()
    	{
    		return $(this.textAreaElement).val();
    	}
    	
	});
	
	Alpaca.registerFieldClass("textarea", Alpaca.Fields.TextAreaField);

})(jQuery);
