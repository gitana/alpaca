(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.EmailField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.EmailField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "email";
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            // default html5 input type = "email";
            this.inputType = "email";

            this.base();

            if (!this.schema.pattern)
            {
                this.schema.pattern = Alpaca.regexps.email;
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
                valInfo["invalidPattern"]["message"] = this.getMessage("invalidEmail");
            }

            return baseStatus;
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Email Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Email Field.";
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            var pattern = (this.schema && this.schema.pattern) ? this.schema.pattern : Alpaca.regexps.email;
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
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForSchema
         */
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(), {
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
        "invalidEmail": "Invalid Email address e.g. info@cloudcms.com"
    });
    Alpaca.registerFieldClass("email", Alpaca.Fields.EmailField);
    Alpaca.registerDefaultFormatFieldMapping("email", "email");

})(jQuery);
