(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.HiddenField = Alpaca.ControlField.extend(
    /**
     * @lends Alpaca.Fields.ControlField.prototype
     */
    {
        /**
         * @see Alpaca.ControlField#getFieldType
         */
        getFieldType: function()
        {
            return "hidden";
        },

        /**
         * @see Alpaca.Field#setup
         */
        setup: function()
        {
            this.base();
        },

        /**
         * @see Alpaca.Field#getValue
         */
        getValue: function()
        {
            return this._getControlVal(true);
        },

        /**
         * @see Alpaca.Field#setValue
         */
        setValue: function(value)
        {
            if (Alpaca.isEmpty(value)) {
                this.getControlEl().val("");
            } else {
                this.getControlEl().val(value);
            }

            // be sure to call into base method
            this.base(value);
        },

        /**
         * @see Alpaca.Field#getType
         */
        getType: function() {
            return "string";
        },


        /* builder_helpers */

        /**
         * @see Alpaca.Field#getTitle
         */
        getTitle: function() {
            return "Hidden";
        },

        /**
         * @see Alpaca.Field#getDescription
         */
        getDescription: function() {
            return "Field for a hidden HTML input";
        }

        /* end_builder_helpers */

    });

    Alpaca.registerFieldClass("hidden", Alpaca.Fields.HiddenField);

})(jQuery);
