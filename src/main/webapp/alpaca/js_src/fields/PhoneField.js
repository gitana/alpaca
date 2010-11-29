(function($) {
	
	var Alpaca = $.alpaca;	

	/**
	 * Phone field
	 */
	Alpaca.Fields.PhoneField = Alpaca.Fields.TextField.extend({

        /**
         * @Override
         */
		setup: function()
		{
			this.base();
			
			if (!this.schema.pattern)
			{
				this.schema.pattern = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/;
			}
            
			if (Alpaca.isEmpty(this.settings.mask)) {
                this.settings.mask = true;
            }
            
            if (Alpaca.isEmpty(this.settings.maskString)) {
                this.settings.maskString = "(999) 999-9999";
            }
            
		},

        /**
         * @Override
         */
		postRender: function() {
            this.base();            
            // apply additional css
            $(this.fieldContainer).addClass("alpaca-phonefield");
        },
        
        /**
         * @Override
         */
    	handleValidate: function(){
        	var baseStatus = this.base();
			
			var valInfo = this.validation;

			if (!valInfo["invalidPattern"]["status"]) {
				valInfo["invalidPattern"]["message"] = Alpaca.getMessage("invalidPhone", this);
			}

			return baseStatus;	            
        }
	});
	
    Alpaca.registerMessages({
        "invalidPhone": "Invalid Phone Number, ex: (123) 456-9999"
    });	
	Alpaca.registerFieldClass("phone", Alpaca.Fields.PhoneField);
    Alpaca.registerDefaultFormatFieldMapping("phone", "phone");
})(jQuery);
