(function($) {

	var Alpaca = $.alpaca;

	/**
	 * Abstract base class for all of the Alpaca Fields
	 * 
	 * This extends the basic Field class and provisions all of the Alpaca fields with common properties as
	 * well as look and feel (i.e. a common control class).
	 *
	 * The following additional settings are supported:
	 * 
	 * {
	 *    label: <string>							    optional
	 *    labelClass: <string>					        optional
	 *    helper: <string>                              optional
	 *    helperClass: <string>                         optional
	 *    showMessages: <boolean>					    optional - whether to show messages (true)
	 * }
	 */
	Alpaca.ControlField = Alpaca.Field.extend({

		/**
		 * Sets up any default values for this field.
		 */
		setup: function() 
		{
			this.base();
		
			if (Alpaca.isUndefined(this.settings.showMessages))
			{
				this.settings.showMessages = true;
			}		
		},
		
		/**
		 * @Override
		 * 
		 * We manually set up the outer and use the template to define what goes into the "fieldContainer".
		 */
		renderOuter: function()
		{
			var _this = this;
			
			// Add a LABEL into the outerEl
			if (this.settings.label)
			{
				this.labelDiv = $("<div></div>");
				this.labelDiv.attr({
					"id": $(this.outerEl).attr("id") + "-label"
				});
				this.labelDiv.addClass("alpaca-field-label");
				this.labelEl = $("<div></div>").html(this.settings.label);				
				this.labelEl.appendTo(this.labelDiv);
				this.labelDiv.appendTo(this.outerEl);
				
				if (this.settings.labelClass)
				{
					this.labelDiv.addClass(this.settings.labelClass);
				}
			}
			
			// Add a "fieldContainer" DIV where custom controls can be bound in
			this.fieldContainer = $("<div></div>");
			$(this.fieldContainer).addClass("alpaca-field-container");
			$(this.fieldContainer).appendTo(this.outerEl);
									
			// render into the fieldContainer
			this.processRender(this.fieldContainer, function() {
				
				// bind our field dom element into the container
				$(_this.getEl()).appendTo(_this.container);
				
				// allow any post-rendering facilities to kick in
				_this.postRender();				
			});
		},

		/**
		 * @Override
		 * 
		 * In most cases, a template isn't used to render the control (though it is an option).
		 * As such, we handle this default case and call through to a renderField method that can be
		 * overridden to generate the stuff that gets placed into "fieldContainer".
		 */
		handleNoTemplateRender: function(parentEl, onSuccess)
		{
			this.renderField(onSuccess);
		},
		
		/**
		 * To be overridden
		 */
		renderField: function(onSuccess)
		{
			// OVERRIDE
			
			if (onSuccess)
			{
				onSuccess();
			}
		},

		/**
		 * @Override
		 */
    	postRender: function()
    	{
			if (this.getMode() == Alpaca.MODE_EDIT)
			{
				// Add any helper text into the outerEl
				if (this.settings.helper)
				{
					var helperDiv = $("<div></div>");
					$(helperDiv).attr({"id": $(this.getEl()).attr("id") + "-desc"});
					$(helperDiv).addClass("alpaca-field-helper");
					$(helperDiv).html(this.settings.helper);
					
					$(helperDiv).appendTo(this.fieldContainer);
					
					if (this.settings.helperClass)
					{
						$(helperDiv).addClass(this.settings.helperClass);
					}
				}
			}
			
			this.base();
    	},

		/**
		 * @Override
		 */
		renderValidationState: function()
		{
			this.base();
			
			var state = this.getValidationState();
			
			// Allow for the message to change
			if (this.settings.showMessages)
			{
				if (!this.initializing)
				{
					this.displayMessage( this.getValidationStateMessage(state) );
				}
			}
		},
				
		
		///////////////////////////////////////////////////////////////////////////////////////////////
		//
		// MESSAGES
		//
		///////////////////////////////////////////////////////////////////////////////////////////////		
		
		/**
		 * Renders a validation state message below the field.
		 */
		displayMessage: function(message) 
		{
	    	if (message && message.length > 0)
	    	{
	    		if (this.messageElement)
	    		{
	    			$(this.messageElement).remove();
	    		}
	    		
				// lazy construction of the message element
				this.messageElement = $("<div></div>");
				$(this.messageElement).addClass("alpaca-field-message");
				$(this.messageElement).appendTo(this.getEl());
				
				$(this.messageElement).html("* " + message);
	    	}
	    	else
	    	{
	    		// remove the message element if it exists
	    		if (this.messageElement)
	    		{
	    			$(this.messageElement).remove();
	    		}
	    	}			
		}
		
	});

})(jQuery);