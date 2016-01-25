(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TableRowField = Alpaca.Fields.ObjectField.extend(
    /**
     * @lends Alpaca.Fields.TableRowField.prototype
     */
    {
        prepareContainerModel: function(callback)
        {
            var self = this;

            this.base(function(model) {

                model.options.showActionsColumn = self.parent.options.showActionsColumn;
                model.options.dragRows = self.parent.options.dragRows;

                // walk all items and mark hiddens so that the template can easily pick this up
                // hiddens are applied the "alpaca-table-column-hidden" css class so that they can be hidden
                for (var i = 0; i < model.items.length; i++)
                {
                    if (model.items[i].options.type === "hidden")
                    {
                        model.items[i].hidden = true;
                    }
                }

                callback(model);
            });
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
