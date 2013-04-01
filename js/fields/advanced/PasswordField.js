(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.PasswordField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.PasswordField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.TextField
         *
         * @class Control for JSON schema password format.
         *
         * @param {Object} container Field container.
         * @param {Any} data Field data.
         * @param {Object} options Field options.
         * @param {Object} schema Field schema.
         * @param {Object|String} view Field view.
         * @param {Alpaca.Connector} connector Field connector.
         * @param {Function} errorCallback Error callback.
         */
        constructor: function(container, data, options, schema, view, connector, errorCallback) {
            this.base(container, data, options, schema, view, connector, errorCallback);
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function() {
            this.base();
            
            if (!this.schema.pattern) {
                this.schema.pattern = Alpaca.regexps.password;
            }
            
            this.controlFieldTemplateDescriptor = this.view.getTemplateDescriptor("controlFieldPassword");
        },

        /**
         * @see Alpaca.Fields.TextField#postRender
         */
        postRender: function() {
            this.base();
			if (this.fieldContainer) {
				this.fieldContainer.addClass('alpaca-controlfield-password');
			}
        },

        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function() {
            var baseStatus = this.base();
            
            var valInfo = this.validation;
            
            if (!valInfo["invalidPattern"]["status"]) {
                valInfo["invalidPattern"]["message"] = this.view.getMessage("invalidPassword");
            }
            
            return baseStatus;
        },//__BUILDER_HELPERS

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            var pattern = (this.schema && this.schema.pattern)? this.schema.pattern : /^[0-9a-zA-Z\x20-\x7E]*$/;
            return Alpaca.merge(this.base(), {
                "properties": {
                    "pattern": {
                        "title": "Pattern",
                        "description": "Field Pattern in Regular Expression",
                        "type": "string",
                        "default": this.schema.pattern,
                        "enum":[pattern],
                        "readonly": true
                    },                    
					"format": {
                        "title": "Format",
                        "description": "Property data format",
                        "type": "string",
						"default":"password",
                        "enum":["password"],
						"readonly":true
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForSchema
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
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Password Field";
        },
        
        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Password Field.";
        },

		/**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "password";
        }//__END_OF_BUILDER_HELPERS
    });

    Alpaca.registerTemplate("controlFieldPassword", '<input type="password" id="${id}" {{if options.size}}size="${options.size}"{{/if}} {{if options.readonly}}readonly="readonly"{{/if}} {{if name}}name="${name}"{{/if}} {{each(i,v) options.data}}data-${i}="${v}"{{/each}}/>');
    Alpaca.registerMessages({
        "invalidPassword": "Invalid Password"
    });
    Alpaca.registerFieldClass("password", Alpaca.Fields.PasswordField);
    Alpaca.registerDefaultFormatFieldMapping("password", "password");
})(jQuery);
