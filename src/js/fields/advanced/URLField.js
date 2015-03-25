(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.URLField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.URLField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "url";
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            // default html5 input type = "url";
            this.inputType = "url";

            this.base();

            this.schema.pattern = Alpaca.regexps.url;
            this.schema.format = "uri";
        },

        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function() {
            var baseStatus = this.base();

            var valInfo = this.validation;

            if (!valInfo["invalidPattern"]["status"]) {

                valInfo["invalidPattern"]["message"] = this.getMessage("invalidURLFormat");
            }

            return baseStatus;
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "URL Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Provides a text control with validation for an internet web address.";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerMessages({
        "invalidURLFormat": "The URL provided is not a valid web address."
    });
    Alpaca.registerFieldClass("url", Alpaca.Fields.URLField);
    Alpaca.registerDefaultFormatFieldMapping("url", "url");

})(jQuery);
