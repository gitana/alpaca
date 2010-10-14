(function($) {
	
	var Alpaca = $.alpaca;	

	/**
	 * IPv4 field
	 */
	Alpaca.Fields.IPv4Field = Alpaca.Fields.TextField.extend({

		setup: function()
		{
			this.base();
			
			// if the invalid message wasn't explicitly overridden, we will set up a new default
			if (!this.settings.messages[Alpaca.STATE_INVALID])
			{
				this.settings.messages[Alpaca.STATE_INVALID] = Alpaca.messages.invalidIPv4;
			}
			
			if (!this.schema.pattern)
			{
				this.schema.pattern = /^(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)(?:\.(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)){3}$/;
			}
    	}
	});
	
	Alpaca.messages.invalidIPv4 = "Invalid IPv4 address, ex: 192.168.0.1";
	
	Alpaca.registerFieldClass("ipv4", Alpaca.Fields.IPv4Field);

})(jQuery);
