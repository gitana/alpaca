(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.GridField = Alpaca.Fields.ArrayField.extend(
    /**
     * @lends Alpaca.Fields.GridField.prototype
     */
    {
        /**
         * @see Alpaca.ControlField#getFieldType
         */
        getFieldType: function() {
            return "grid";
        },

        setup: function()
        {
            this.base();

            if (typeof(this.options.grid) == "undefined")
            {
                this.options.grid = {};
            }
        },

        afterRenderContainer: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                // convert the data array into the grid's expected format
                var gridData = [];

                // add in headers
                var headers = [];
                for (var key in self.options.fields)
                {
                    var fieldDefinition = self.options.fields[key];

                    var label = key;
                    if (fieldDefinition.label)
                    {
                        label = fieldDefinition.label;
                    }

                    headers.push(label);
                }
                gridData.push(headers);

                for (var i = 0; i < self.data.length; i++)
                {
                    var row = [];
                    for (var key2 in self.data[i])
                    {
                        row.push(self.data[i][key2]);
                    }
                    gridData.push(row);
                }

                /*
                // TODO
                var gridData = [
                    ["Maserati", "Mazda", "Mercedes", "Mini", "Mitsubishi"],
                    ["2009", 0, 2941, 4303, 354, 5814],
                    ["2010", 5, 2905, 2867, 412, 5284],
                    ["2011", 4, 2517, 4822, 552, 6127],
                    ["2012", 2, 2422, 5399, 776, 4151]
                ];
                */

                var holder = $(self.container).find(".alpaca-container-grid-holder");

                var gridConfig = self.options.grid;
                gridConfig.data = gridData;

                $(holder).handsontable(gridConfig);

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
            return "Grid Field";
        },

        /**
         * @see Alpaca.ControlField#getDescription
         */
        getDescription: function() {
            return "Renders array items into a grid";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("grid", Alpaca.Fields.GridField);

})(jQuery);
