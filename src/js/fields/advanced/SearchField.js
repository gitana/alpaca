(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.SearchField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.SearchField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            // default html5 input type = "search";
            this.inputType = "search";

            this.base();

            this.options.attributes.results = 5;
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "search";
        },

        /**
         * @see Alpaca.Fields.TextField#getType
         */
        getType: function() {
            return "string";
        },

        /* builder_helpers */

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Search Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "A search box field";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("search", Alpaca.Fields.SearchField);
    Alpaca.registerDefaultSchemaFieldMapping("search", "search");

})(jQuery);
