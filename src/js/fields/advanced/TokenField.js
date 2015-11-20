(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TokenField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.TokenField.prototype
     */
    {
        /**
         * @override
         */
        getFieldType: function() {
            return "token";
        },

        /**
         * @override
         */
        setup: function()
        {
            this.base();

            if (!this.options.separator)
            {
                this.options.separator = ",";
            }

            if (typeof(this.options.tokenfield) == "undefined")
            {
                this.options.tokenfield = {};
            }

            if (typeof(this.options.tokenfield.showAutocompleteOnFocus) === "undefined")
            {
                this.options.tokenfield.showAutocompleteOnFocus = true;
            }
        },

        /**
         * @override
         */
        getControlValue: function()
        {
            return this.base();
        },

        /**
         * @override
         */
        setValue: function(val)
        {
            this.base(val);
        },

        /**
         * @override
         */
        onBlur: function(e)
        {
            this.base(e);
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                // see if we can render CK Editor
                if (!self.isDisplayOnly() && self.control && typeof($.fn.tokenfield) !== "undefined")
                {
                    // wait for Alpaca to declare the DOM swapped and ready before we attempt to do anything
                    self.on("ready", function() {
                        $(self.control).tokenfield(self.options.tokenfield);
                    });
                }

                callback();
            });
        }



        /* builder_helpers */
        ,

        /**
         * @override
         */
        getTitle: function() {
            return "Token Field";
        },

        /**
         * @override
         */
        getDescription: function() {
            return "Token field for entering list of tokens separated by delimiter.";
        },

        /**
         * @override
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "separator": {
                        "title": "Separator",
                        "description": "Separator used to split tokens.",
                        "type": "string",
                        "default":","
                    },
                    "tokenfield": {
                        "title": "Token Field options",
                        "description": "Settings to pass into the underlying bootstrap-tokenfield control",
                        "type": "object",
                        "default": undefined
                    }
                }
            });
        },

        /**
         * @override
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "separator": {
                        "type": "text"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("token", Alpaca.Fields.TokenField);

})(jQuery);
