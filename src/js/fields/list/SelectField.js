(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.SelectField = Alpaca.Fields.SelectFieldBase.extend(
    /**
     * @lends Alpaca.Fields.SelectFieldBase.prototype
     */
    {
        /**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function()
        {
            return "select";
        },

        /**
         * @see Alpaca.Field#getTitle
         */
        getTitle: function() {
            return "Select Field";
        },

        /**
         * @see Alpaca.Field#getDescription
         */
        getDescription: function() {
            return "Select Field";
        },

    });
    
    Alpaca.registerFieldClass("select", Alpaca.Fields.SelectField);

})(jQuery);
