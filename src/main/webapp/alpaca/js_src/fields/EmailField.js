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
    	postRender: function() {
            this.base();            
            // apply additional css
            $(this.fieldContainer).addClass("alpaca-emailfield");
        },
        
        /**
         * @Override
         */
        handleValidate: function(){
        	var baseStatus = this.base();
			
			var valInfo = this.validation;

			if (!valInfo["invalidPattern"]["status"]) {
				valInfo["invalidPattern"]["message"] = Alpaca.getMessage("invalidEmail", this);
			}

			return baseStatus;	            
        }
	});
	
    Alpaca.registerMessages({
        "invalidEmail": "Invalid Email address, ex: admin@gitanasoftware.com"
    });	
	Alpaca.registerFieldClass("email", Alpaca.Fields.EmailField);
    Alpaca.registerDefaultFormatFieldMapping("email", "email");
})(jQuery);
