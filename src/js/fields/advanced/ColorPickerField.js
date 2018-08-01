/**
 * Uses: https://mjolnic.com/bootstrap-colorpicker/
 */
(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.ColorPickerField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.ColorPickerField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            var self = this;

            this.simpleColorPickerAvailable = false;
            if (!self.isDisplayOnly() && typeof($.fn.colorpicker) !== "undefined")
            {
                this.simpleColorPickerAvailable = true;
            }

            // default html5 input type = "color";
            if (typeof(this.options.colorpicker) === "undefined" && !self.simpleColorPickerAvailable)
            {
                this.inputType = "color";
            }

            this.base();

            // set up default colorpicker settings
            if (typeof(this.options.colorpicker) === "undefined")
            {
                this.options.colorpicker = {};
            }
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "colorpicker";
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

                // if we can render the spectrum plugin...
                if (self.simpleColorPickerAvailable && self.control)
                {
                    setTimeout(function(self) {
                        return function() {

                            // create a copy of the color picker settings and bind that
                            // this is because colorpicker jquery plugin seems to munge these configs across multiple instances
                            var cp = JSON.parse(JSON.stringify(self.options.colorpicker));
                            if (self.data)
                            {
                                cp.color = self.data;
                            }


                            $(self.control).colorpicker(cp);
                            $(self.control).on('changeColor.colorpicker', function(event) {
                                self.setValue(event.color.toHex());
                            });
                        }
                    }(self, self));
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
            return "Color Picker Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "A color picker for selecting hexadecimal color values";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("colorpicker", Alpaca.Fields.ColorPickerField);

})(jQuery);
