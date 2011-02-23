(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Phone field
     */
    Alpaca.Fields.PhoneField = Alpaca.Fields.TextField.extend({
    
        /**
         * @Override
         */
        setup: function() {
            this.base();
            
            if (!this.schema.pattern) {
                this.schema.pattern = /^(\D?(\d{3})\D?\D?(\d{3})\D?(\d{4}))?$/;
            }
            
            if (Alpaca.isEmpty(this.options.mask)) {
                this.options.mask = true;
            }
            
            if (Alpaca.isEmpty(this.options.maskString)) {
                this.options.maskString = "(999) 999-9999";
            }
            
        },
        
        /**
         * @Override
         */
        postRender: function() {
            this.base();
			$('<span class="ui-icon ui-icon-contact"></span>').prependTo(this.fieldContainer);
			if (this.fieldContainer) {
				this.fieldContainer.addClass('alpaca-controlfield-phone');
			}			
        },
        
        /**
         * @Override
         */
        handleValidate: function() {
            var baseStatus = this.base();
            
            var valInfo = this.validation;
            
            if (!valInfo["invalidPattern"]["status"]) {
                valInfo["invalidPattern"]["message"] = Alpaca.getMessage("invalidPhone", this);
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
						"default":"phone",
						"readonly":true
                    }
                }
            });
        },
        
        /**
         * @Override
         */
        getTitle: function() {
            return "Phone Field";
        },
        
        /**
         * @Override
         */
        getDescription: function() {
            return "Phone Field.";
        },
		
        /**
         * @Override
         */
		getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(),{
				"properties": {
					"mask": {
						"title": "Field Mask Option",
						"description": "Enable field mask if true",
						"type": "boolean",
						"default": true
					},
					"maskString": {
						"title": "Field Mask String",
						"description": "Expression for field mask",
						"type": "string",
						"default": "(999) 999-9999"
					}
				}	
			});
		},

		/**
         * @Override
         */
        getFieldType: function() {
            return "phone";
        }
    });
    
    Alpaca.registerMessages({
        "invalidPhone": "Invalid Phone Number, ex: (123) 456-9999"
    });
    Alpaca.registerFieldClass("phone", Alpaca.Fields.PhoneField);
    Alpaca.registerDefaultFormatFieldMapping("phone", "phone");
})(jQuery);
