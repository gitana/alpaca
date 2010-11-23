(function($) {
	
	var Alpaca = $.alpaca;	

	/**
	 * Email field
	 */
	Alpaca.Fields.EmailField = Alpaca.Fields.TextField.extend({

        /**
         * @Override
         */
		setup: function()
		{
			this.base();
			
			if (!this.schema.pattern)
			{
				this.schema.pattern = /^[a-z0-9!\#\$%&'\*\-\/=\?\+\-\^_`\{\|\}~]+(?:\.[a-z0-9!\#\$%&'\*\-\/=\?\+\-\^_`\{\|\}~]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,6}$/i;
			}
    	},

    	/**
         * @Override
         */
        getValidationStateMessage: function(state){
            if (state == Alpaca.STATE_INVALID) {
                if (!this._validatePattern()) {
                    return Alpaca.getMessage("invalidEmail", this);
                }
            }
            
            return this.base(state);
        }
	});
	
    Alpaca.registerMessages({
        "invalidEmail": "Invalid Email address, ex: admin@gitanasoftware.com"
    });	
	Alpaca.registerFieldClass("email", Alpaca.Fields.EmailField);
    Alpaca.registerDefaultFormatFieldMapping("email", "email");
})(jQuery);
