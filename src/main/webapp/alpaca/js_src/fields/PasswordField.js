(function($) {
	
	var Alpaca = $.alpaca;	

	/**
	 * IPv4 field
	 */
	Alpaca.Fields.PasswordField = Alpaca.Fields.TextField.extend({

        /**
         * @Override
         */
		setup: function()
		{
			this.base();
			
			if (!this.schema.pattern)
			{
				this.schema.pattern = /^[0-9a-zA-Z\x20-\x7E]*$/;
			}
    	},

        /**
         * @Override
         */
    	handleValidate: function(){
        	var baseStatus = this.base();
			
			var valInfo = this.validation;

			if (!valInfo["invalidPattern"]["status"]) {
				valInfo["invalidPattern"]["message"] = Alpaca.getMessage("invalidPassword", this);
			}

			return baseStatus;	            
        },
        
		/**
         * @Override
         *
         * Renders an INPUT control into the field container
         */
        renderField: function(onSuccess){
            var controlFieldTemplate = Alpaca.getTemplate("controlFieldPassword", this, null, this.mode);
            
            if (controlFieldTemplate) {
                this.inputElement = $.tmpl(controlFieldTemplate, {
                    "id": this.getId(),
                    "settings": this.settings
                });
				this.inputElement.addClass("alpaca-textfield");
                this.injectField(this.inputElement);
            }
            
            if (onSuccess) {
                onSuccess();
            }
        }        
	});
	
    Alpaca.registerTemplate("controlFieldPassword", '<input type="password" id="${id}" {{if settings.size}}size="${settings.size}"{{/if}} {{if settings.readonly}}readonly="on"{{/if}} {{if settings.formName}}name="${settings.formName}"{{/if}} {{each(i,v) settings.data}}data-${i}="${v}"{{/each}}/>');
    Alpaca.registerMessages({
        "invalidPassword": "Invalid Password"
    });	
	Alpaca.registerFieldClass("password", Alpaca.Fields.PasswordField);
    Alpaca.registerDefaultFormatFieldMapping("password", "password");
})(jQuery);
