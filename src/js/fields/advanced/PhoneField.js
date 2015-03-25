(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.PhoneField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.PhoneField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            // default html5 input type = "tel";
            this.inputType = "tel";

            this.base();

            if (!this.schema.pattern) {
                this.schema.pattern = Alpaca.regexps.phone;
            }

            if (Alpaca.isEmpty(this.options.maskString)) {
                this.options.maskString = "(999) 999-9999";
            }

        },

        /**
         * @see Alpaca.Fields.TextField#postRender
         */
        postRender: function(callback) {

            var self = this;

            this.base(function() {

                callback();

            });
        },

        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function() {
            var baseStatus = this.base();

            var valInfo = this.validation;

            if (!valInfo["invalidPattern"]["status"]) {
                valInfo["invalidPattern"]["message"] = this.getMessage("invalidPhone");
            }

            return baseStatus;
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "phone";
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Phone Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Phone Field.";
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            var pattern = (this.schema && this.schema.pattern) ? this.schema.pattern : Alpaca.regexps.phone;
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
                        "default":"phone",
                        "enum":["phone"],
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
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "maskString": {
                        "title": "Field Mask String",
                        "description": "Expression for field mask",
                        "type": "string",
                        "default": "(999) 999-9999"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerMessages({
        "invalidPhone": "Invalid Phone Number, e.g. (123) 456-9999"
    });
    Alpaca.registerFieldClass("phone", Alpaca.Fields.PhoneField);
    Alpaca.registerDefaultFormatFieldMapping("phone", "phone");

})(jQuery);
