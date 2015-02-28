(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TableField = Alpaca.Fields.ArrayField.extend(
    /**
     * @lends Alpaca.Fields.TableField.prototype
     */
    {
        setup: function()
        {
            this.base();

            if (!this.options.items.type)
            {
                this.options.items.type = "tablerow";
            }

        },

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

                /*
                if ($.fn.dataTable)
                {
                    $(self.container).find("table").dataTable({

                    });
                }
                */

                callback();
            });
        },

        /**
         * @see Alpaca.ControlField#getType
         */
        getType: function() {
            return "array";
        }


        /* builder_helpers */
        ,

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
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("table", Alpaca.Fields.TableField);

})(jQuery);
