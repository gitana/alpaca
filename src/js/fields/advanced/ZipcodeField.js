(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.ZipcodeField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.ZipcodeField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "zipcode";
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            this.base();

            this.options.format = (this.options.format ? this.options.format : "nine");

            if (this.options.format === "nine")
            {
                this.schema.pattern = Alpaca.regexps["zipcode-nine"];
            }
            else if (this.options.format === "five")
            {
                this.schema.pattern = Alpaca.regexps["zipcode-five"];
            }
            else
            {
                Alpaca.logError("The configured zipcode format: " + this.options.format + " is not a legal value [five, nine]");

                // default to nine format
                this.options.format = "nine";
                this.schema.pattern = Alpaca.regexps["zipcode-nine"];
            }

            // set mask string
            if (this.options.format === "nine")
            {
                this.options["maskString"] = "99999-9999";
            }
            else if (this.options.format === "five")
            {
                this.options["maskString"] = "99999";
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

                if (this.options.format === "nine")
                {
                    valInfo["invalidPattern"]["message"] = this.getMessage("invalidZipcodeFormatNine");
                }
                else if (this.options.format === "five")
                {
                    valInfo["invalidPattern"]["message"] = this.getMessage("invalidZipcodeFormatFive");
                }
            }

            return baseStatus;
        }



        /* builder_helpers */
        ,

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {

            return Alpaca.merge(this.base(), {
                "properties": {
                    "format": {
                        "title": "Format",
                        "description": "How to represent the zipcode field",
                        "type": "string",
                        "default": "five",
                        "enum":["five", "nine"],
                        "readonly": true
                    }
                }
            });

        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
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
            return "Zipcode Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Provides a five or nine-digital US zipcode control with validation.";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerMessages({
        "invalidZipcodeFormatFive": "Invalid Five-Digit Zipcode (#####)",
        "invalidZipcodeFormatNine": "Invalid Nine-Digit Zipcode (#####-####)"
    });
    Alpaca.registerFieldClass("zipcode", Alpaca.Fields.ZipcodeField);
    Alpaca.registerDefaultFormatFieldMapping("zipcode", "zipcode");

})(jQuery);
