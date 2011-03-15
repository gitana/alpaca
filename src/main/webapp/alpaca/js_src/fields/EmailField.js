(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Email field
     */
    Alpaca.Fields.EmailField = Alpaca.Fields.TextField.extend({
    
        /**
         * @Override
         */
        setup: function() {
            this.base();
            
            if (!this.schema.pattern) {
                this.schema.pattern = /^[a-z0-9!\#\$%&'\*\-\/=\?\+\-\^_`\{\|\}~]+(?:\.[a-z0-9!\#\$%&'\*\-\/=\?\+\-\^_`\{\|\}~]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,6}$/i;
            }
        },
        
        /**
         * @Override
         */
        postRender: function() {
            this.base();
            $('<span class="ui-icon ui-icon-mail-closed"></span>').prependTo(this.fieldContainer);
			if (this.fieldContainer) {
				this.fieldContainer.addClass('alpaca-controlfield-email');
			}	
        },
        
		/**
		 * 
		 */
		addFieldClass: function() {
			this.base();
			this.outerEl.addClass('alpaca-controlfield-email');
		},
        
        /**
         * @Override
         */
        handleValidate: function() {
            var baseStatus = this.base();
            
            var valInfo = this.validation;
            
            if (!valInfo["invalidPattern"]["status"]) {
                valInfo["invalidPattern"]["message"] = Alpaca.getMessage("invalidEmail", this);
            }
            
            return baseStatus;
        },
        /**
         * @Override
         */
        getSchemaOfSchema: function() {
            var pattern = (this.schema && this.schema.pattern)? this.schema.pattern :/^[a-z0-9!\#\$%&'\*\-\/=\?\+\-\^_`\{\|\}~]+(?:\.[a-z0-9!\#\$%&'\*\-\/=\?\+\-\^_`\{\|\}~]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,6}$/i;
            return Alpaca.merge(this.base(), {
                "properties": {
                    "pattern": {
                        "title": "Pattern",
                        "description": "Field Pattern in Regular Expression",
                        "type": "string",
                        "default": pattern,
                        "enum":[pattern],
                        "readonly": true
                    },                    
					"format": {
                        "title": "Format",
                        "description": "Property data format",
                        "type": "string",
						"default":"email",
                        "enum":["email"],
						"readonly":true
                    }
                }
            });
        },

        /**
         * @Override
         */
		getOptionsForSchema: function() {
            return Alpaca.merge(this.base(),{
				"fields": {
					"format": {
						"type": "text"
					}
				}
			});
        },
        
        /**
         * @Override
         */
        getTitle: function() {
            return "Email Field";
        },
        
        /**
         * @Override
         */
        getDescription: function() {
            return "Email Field.";
        },
        
        /**
         * @Override
         */
        getFieldType: function() {
            return "email";
        }
    });
    
    Alpaca.registerMessages({
        "invalidEmail": "Invalid Email address, ex: admin@gitanasoftware.com"
    });
    Alpaca.registerFieldClass("email", Alpaca.Fields.EmailField);
    Alpaca.registerDefaultFormatFieldMapping("email", "email");
})(jQuery);
