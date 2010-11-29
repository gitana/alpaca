(function($) {
	
	var Alpaca = $.alpaca;	

	/**
	 * IPv4 field
	 */
	Alpaca.Fields.IPv4Field = Alpaca.Fields.TextField.extend({

        /**
         * @Override
         */
		setup: function()
		{
			this.base();
			
			if (!this.schema.pattern)
			{
				this.schema.pattern = /^(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)(?:\.(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)){3}$/;
			}
    	},

        /**
         * @Override
         */
        handleValidate: function(){
        	var baseStatus = this.base();
			
			var valInfo = this.validation;

			if (!valInfo["invalidPattern"]["status"]) {
				valInfo["invalidPattern"]["message"] = Alpaca.getMessage("invalidIPv4", this);
			}

			return baseStatus;	            
        }
	});
	
    Alpaca.registerMessages({
        "invalidIPv4": "Invalid IPv4 address, ex: 192.168.0.1"
    });	
	Alpaca.registerFieldClass("ipv4", Alpaca.Fields.IPv4Field);
    Alpaca.registerDefaultSchemaFieldMapping("ip-address", "ipv4");
    Alpaca.registerDefaultFormatFieldMapping("ip-address", "ipv4");
})(jQuery);
