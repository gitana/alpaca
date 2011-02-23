(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * IPv4 field
     */
    Alpaca.Fields.IPv4Field = Alpaca.Fields.TextField.extend({
    
        /**
         * @Override
         */
        setup: function() {
            this.base();
            
            if (!this.schema.pattern) {
                this.schema.pattern = /^(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)(?:\.(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)){3}$/;
            }
        },

        /**
         * @Override
         */
        postRender: function() {
            this.base();
			if (this.fieldContainer) {
				this.fieldContainer.addClass('alpaca-controlfield-ipv4');
			}	
        },
		        
        /**
         * @Override
         */
        handleValidate: function() {
            var baseStatus = this.base();
            
            var valInfo = this.validation;
            
            if (!valInfo["invalidPattern"]["status"]) {
                valInfo["invalidPattern"]["message"] = Alpaca.getMessage("invalidIPv4", this);
            }
            
            return baseStatus;
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
						"default":"ipv4",
						"readonly":true
                    }
                }
            });
        },
        
        /**
         * @Override
         */
        getTitle: function() {
            return "IP Address Field";
        },
        
        /**
         * @Override
         */
        getDescription: function() {
            return "IP Address Field.";
        },

		/**
         * @Override
         */
        getFieldType: function() {
            return "ipv4";
        }
    });
    
    Alpaca.registerMessages({
        "invalidIPv4": "Invalid IPv4 address, ex: 192.168.0.1"
    });
    Alpaca.registerFieldClass("ipv4", Alpaca.Fields.IPv4Field);
    Alpaca.registerDefaultFormatFieldMapping("ip-address", "ipv4");
})(jQuery);
