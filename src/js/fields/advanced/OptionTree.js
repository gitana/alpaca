(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.OptionTreeField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.OptionTree.prototype
     */
    {
        /**
         * @see Alpaca.Fields.ObjectField#getFieldType
         */
        getFieldType: function() {
            return "optiontree";
        },

        /**
         * @private
         * @see Alpaca.Fields.ObjectField#setup
         */
        setup: function()
        {
            this.base();

            if (!this.options.tree)
            {
                this.options.tree = {};
            }

            if (!this.options.tree.selectors)
            {
                this.options.tree.selectors = {};
            }

            if (!this.options.tree.selectorOrder)
            {
                this.options.tree.selectorOrder = [];
            }

            if (!this.options.tree.data)
            {
                this.options.tree.data = [];
            }

            // walk data
            for (var i = 0; i < this.options.tree.data.length; i++)
            {
                var item = this.options.tree.data[i];

                if (item.attributes)
                {
                    for (var k in item.attributes)
                    {
                        if (!this.options.tree.selectors[k])
                        {
                            this.options.tree.selectors[k] = {};
                        }

                        if (!this.options.tree.selectors[k].label)
                        {
                            this.options.tree.selectors[k].label = "Choose...";
                        }

                        if (!this.options.tree.selectors[k].type)
                        {
                            this.options.tree.selectors[k].type = "select";
                        }
                    }

                    if (!this.options.tree.selectorOrder)
                    {
                        this.options.tree.selectorOrder = [];

                        for (var k in item.attributes)
                        {
                            this.options.tree.selectorOrder.push(k);
                        }
                    }
                }
            }
        },

        /**
         * @see Alpaca.Field#afterRenderContainer
         */
        afterRenderContainer: function(model, callback) {

            var self = this;

            this.base(model, function() {

                // TODO
                var holder = null;

                var currentAttribute = "sport";

                // assemble data
                var options = {};

                for (var i = 0; i < self.options.tree.data.length; i++)
                {
                    if (self.options.tree.data[i].attributes)
                    {
                        var v = self.options.tree.data[i].attributes[currentAttribute];

                        var optionId = v;
                        var optionLabel = v;

                        if (Alpaca.isObject(v))
                        {
                            optionId = v.id;
                            optionLabel = v.label;
                        }

                        if (v && !options[optionId])
                        {
                            options[optionId] = optionLabel;
                        }
                    }
                }

                var currentHolder = $(holder).append("<div></div>");

                $(currentHolder).alpaca({
                    "schema": {
                        "type": "number",
                        "enum": optionIds
                    },
                    "options": {
                        "type": "select",
                        "optionLabels": optionLabels
                    }
                });

                callback();

            });
        },

        /**
         * @see Alpaca.Fields.ObjectField#getType
         */
        getType: function() {
            return "any";
        }


        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.ObjectField#getTitle
         */
        getTitle: function() {
            return "Option Tree";
        },

        /**
         * @see Alpaca.Fields.ObjectField#getDescription
         */
        getDescription: function() {
            return "Option Tree";
        },

        /**
         * @private
         * @see Alpaca.Fields.ObjectField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.ObjectField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("optiontree", Alpaca.Fields.OptionTreeField);

})(jQuery);
