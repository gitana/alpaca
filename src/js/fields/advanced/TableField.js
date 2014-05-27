(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TableField = Alpaca.Fields.ArrayField.extend(
    /**
     * @lends Alpaca.Fields.TableField.prototype
     */
    {
        /**
         * @see Alpaca.ControlField#getFieldType
         */
        getFieldType: function() {
            return "table";
        },

        afterRenderContainer: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                $(self.container).find("table").dataTable({

                });

                callback();
            });
        },

        //__BUILDER_HELPERS

        /**
         * @see Alpaca.ControlField#getTitle
         */
        getTitle: function() {
            return "Table Field";
        },

        /**
         * @see Alpaca.ControlField#getDescription
         */
        getDescription: function() {
            return "Renders array items into a table";
        },

        /**
         * @see Alpaca.ControlField#getType
         */
        getType: function() {
            return "array";
        }

        //__END_OF_BUILDER_HELPERS
    });

    Alpaca.registerFieldClass("table", Alpaca.Fields.TableField);

})(jQuery);
