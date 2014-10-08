(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.ImageField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.ImageField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "image";
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Image Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Image Field.";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("image", Alpaca.Fields.ImageField);

})(jQuery);
