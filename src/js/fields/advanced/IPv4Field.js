(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.IPv4Field = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.IPv4Field.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "ipv4";
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            this.base();

            if (!this.schema.pattern)
            {
                this.schema.pattern = Alpaca.regexps.ipv4;
            }
        },

        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            if (!valInfo["invalidPattern"]["status"])
            {
                valInfo["invalidPattern"]["message"] = this.getMessage("invalidIPv4");
            }

            return baseStatus;
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "IP Address Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "IP Address Field.";
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            var pattern = (this.schema && this.schema.pattern)? this.schema.pattern : Alpaca.regexps.ipv4;
            return Alpaca.merge(this.base(), {
                "properties": {
                    "pattern": {
                        "title": "Pattern",
                        "description": "Field Pattern in Regular Expression",
                        "type": "string",
                        "default": pattern,
                        "readonly": true
                    },
                    "format": {
                        "title": "Format",
                        "description": "Property data format",
                        "type": "string",
                        "enum": ["ip-address"],
                        "default":"ip-address",
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
        "invalidIPv4": "Invalid IPv4 address, e.g. 192.168.0.1"
    });
    Alpaca.registerFieldClass("ipv4", Alpaca.Fields.IPv4Field);
    Alpaca.registerDefaultFormatFieldMapping("ip-address", "ipv4");

})(jQuery);
