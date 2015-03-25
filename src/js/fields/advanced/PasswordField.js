(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.PasswordField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.PasswordField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "password";
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            this.base();

            if (!this.schema.pattern)
            {
                this.schema.pattern = Alpaca.regexps.password;
            }
        },

        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            if (!valInfo["invalidPattern"]["status"]) {
                valInfo["invalidPattern"]["message"] = this.getMessage("invalidPassword");
            }

            return baseStatus;
        }

        /* builder_helpers */
        ,

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
        }

		/* end_builder_helpers */
    });

    Alpaca.registerMessages({
        "invalidPassword": "Invalid Password"
    });
    Alpaca.registerFieldClass("password", Alpaca.Fields.PasswordField);
    Alpaca.registerDefaultFormatFieldMapping("password", "password");
})(jQuery);
