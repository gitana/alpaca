(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.DatetimeField = Alpaca.Fields.DateField.extend(
        /**
         * @lends Alpaca.Fields.DatetimeField.prototype
         */
        {
            /**
             * @see Alpaca.Fields.TextField#getFieldType
             */
            getFieldType: function() {
                return "datetime";
            },

            getDefaultFormat: function() {
                return "MM/DD/YYYY HH:mm:ss";
            },

            getDefaultExtraFormats: function() {
                return [
                    "MM/DD/YYYY hh:mm:ss a",
                    "MM/DD/YYYY HH:mm",
                    "MM/DD/YYYY"
                ];
            },

            /**
             * @see Alpaca.Fields.TextField#setup
             */
            setup: function()
            {
                var self = this;

                // default html5 input type = "datetime";
                //this.inputType = "datetime";

                this.base();
            }

            /* builder_helpers */
            ,

            /**
             * @see Alpaca.Fields.TextField#getTitle
             */
            getTitle: function() {
                return "Datetime Field";
            },

            /**
             * @see Alpaca.Fields.TextField#getDescription
             */
            getDescription: function() {
                return "Datetime Field based on <a href='http://eonasdan.github.io/bootstrap-datetimepicker/'>Bootstrap DateTime Picker</a>.";
            }

            /* end_builder_helpers */
        });

    Alpaca.registerFieldClass("datetime", Alpaca.Fields.DatetimeField);

    // "datetime" is legacy (pre v4 schema)
    Alpaca.registerDefaultFormatFieldMapping("datetime", "datetime");

    // official v4 uses date-time
    Alpaca.registerDefaultFormatFieldMapping("date-time", "datetime");

})(jQuery);
