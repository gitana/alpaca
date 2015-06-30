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

                callback(model);
            });
        },

        /*
        afterRenderContainer: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                // apply data-type="alpaca" to each TD
                var tds = $(this.container).find("td");
                for (var i = 0; i < self.children.length; i++)
                {
                    $(tds[i]).attr("data-type", "alpaca");
                }

                callback();

            }.bind(self));
        },
        */

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
