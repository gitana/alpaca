/**
 * Uses: https://github.com/billyaraujo/pick-a-color
 */
(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.PickAColorField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.PickAColorField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            var self = this;

            this.pickAColorFieldAvailable = false;
            if (!self.isDisplayOnly() && typeof($.fn.pickAColor) !== "undefined")
            {
                this.pickAColorFieldAvailable = true;
            }

            // default html5 input type = "color";
            if (typeof(this.options.pickacolor) === "undefined" && !self.pickAColorFieldAvailable)
            {
                this.inputType = "color";
            }

            this.base();

            // set up default spectrum settings
            if (typeof(this.options.pickacolor) === "undefined")
            {
                this.options.pickacolor = {
                    showSpectrum          : true,
                    showSavedColors       : true,
                    saveColorsPerElement  : false,
                    fadeMenuToggle        : true,
                    showAdvanced          : true,
                    showBasicColors       : true,
                    showHexInput          : true,
                    allowBlank            : true,
                    inlineDropdown        : false
                };
            }

            // if colors not specified, use default colors
            if (typeof(this.options.colors) === "undefined")
            {
                this.options.colors = {
                    white: "#ffffff",
                    clouds: "#ecf0f1",
                    red: "#c0392b",
                    orange: "#e67e22",
                    yellow: "#f1c40f",
                    green: "#27ae60",
                    blue: "#2980b9",
                    purple: "#8e44ad",
                    dark: "#34495e",
                    black: "#000000",
                    brown: "#bb9977"
                };
            }

            if (this.options.pickacolor && typeof(this.options.pickacolor.basicColors) === "undefined")
            {
                this.options.pickacolor.basicColors = this.options.colors;
            }

            if (typeof(this.options.pickacolor.inlineDropdown) === "undefined")
            {
                this.options.pickacolor.inlineDropdown = false;
            }
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "pickacolor";
        },

        /**
         * @see Alpaca.Fields.TextField#getType
         */
        getType: function() {
            return "string";
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                if (self.control)
                {
                    // if we can render the plugin...
                    if (self.pickAColorFieldAvailable && self.options.pickacolor)
                    {
                        if (self.data) {
                            $(self.control).attr("value", "#" + self.data);
                        }

                        $(self.control).addClass("pick-a-color");
                        $(self.control).pickAColor(self.options.pickacolor);

                        $(self.control).on("change", function(e) {
                            self.setValue("#" + $(this).val());
                            self.refresh();
                        });
                    }
                }

                callback();
            });
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Pick-A-Color Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "A color picker for selecting hexadecimal color values";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("pickacolor", Alpaca.Fields.PickAColorField);

})(jQuery);
