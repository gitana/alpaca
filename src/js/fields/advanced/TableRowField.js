(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TableRowField = Alpaca.Fields.ObjectField.extend(
    /**
     * @lends Alpaca.Fields.TableRowField.prototype
     */
    {
        setup: function()
        {
            this.base();

            /*
            // disable labels for all properties
            for (var k in this.schema.properties)
            {
                delete this.schema.properties[k].title;
            }
            for (var k in this.options.fields)
            {
                delete this.options.fields[k].label;
            }
            */
        },

        /**
         * @see Alpaca.ControlField#getFieldType
         */
        getFieldType: function() {
            return "tablerow";
        },

        /**
         * @see Alpaca.ControlField#getType
         */
        getType: function() {
            return "object";
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.ControlField#getTitle
         */
        getTitle: function() {
            return "Table Row Field";
        },

        /**
         * @see Alpaca.ControlField#getDescription
         */
        getDescription: function() {
            return "Renders object items into a table row";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("tablerow", Alpaca.Fields.TableRowField);

})(jQuery);
