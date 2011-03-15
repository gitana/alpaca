(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * IPv4 field
     */
    Alpaca.Fields.PasswordField = Alpaca.Fields.TextField.extend({
    
        /**
         * @Override
         */
        setup: function() {
            this.base();
            
            if (!this.schema.pattern) {
                this.schema.pattern = /^[0-9a-zA-Z\x20-\x7E]*$/;
            }
            
            this.controlFieldTemplate = Alpaca.getTemplate("controlFieldPassword", this);
        },

        /**
         * @Override
         */
        postRender: function() {
            this.base();
			if (this.fieldContainer) {
				this.fieldContainer.addClass('alpaca-controlfield-password');
			}
        },
		        
        /**
         * @Override
         */
        handleValidate: function() {
            var baseStatus = this.base();
            
            var valInfo = this.validation;
            
            if (!valInfo["invalidPattern"]["status"]) {
                valInfo["invalidPattern"]["message"] = Alpaca.getMessage("invalidPassword", this);
            }
            
            return baseStatus;
        },
        
        /**
         * @Override
         */
        postRender: function() {
            this.base();
            // apply additional css
            this.fieldContainer.addClass("alpaca-controlfield-password");
        },
        
        /**
         * @Override
         */
        getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "pattern": {
                        "title": "Pattern",
                        "description": "Field Pattern in Regular Expression",
                        "type": "string",
                        "default": this.schema.pattern,
                        "readonly": true
                    },                    
					"format": {
                        "title": "Format",
                        "description": "Property data format",
                        "type": "string",
						"default":"password",
						"readonly":true
                    }
                }
            });
        },
        
        /**
         * @Override
         */
        getTitle: function() {
            return "Password Field";
        },
        
        /**
         * @Override
         */
        getDescription: function() {
            return "Password Field.";
        },

		/**
         * @Override
         */
        getFieldType: function() {
            return "password";
        }
    });
    
    Alpaca.registerTemplate("controlFieldPassword", '<input type="password" id="${id}" {{if options.size}}size="${options.size}"{{/if}} {{if options.readonly}}readonly="on"{{/if}} {{if options.formName}}name="${options.formName}"{{/if}} {{each(i,v) options.data}}data-${i}="${v}"{{/each}}/>');
    Alpaca.registerMessages({
        "invalidPassword": "Invalid Password"
    });
    Alpaca.registerFieldClass("password", Alpaca.Fields.PasswordField);
    Alpaca.registerDefaultFormatFieldMapping("password", "password");
})(jQuery);
