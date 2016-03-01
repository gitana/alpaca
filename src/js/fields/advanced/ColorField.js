/**
 * Uses the spectrum plugin to provide a color picker.
 * This used to rely on HTML5 but no longer.
 */
(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.ColorField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.ColorField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            var self = this;

            this.spectrumAvailable = false;
            if (!self.isDisplayOnly() && typeof($.fn.spectrum) !== "undefined")
            {
                this.spectrumAvailable = true;
            }

            // default html5 input type = "color";
            if (typeof(this.options.spectrum) === "undefined" && self.spectrumAvailable)
            {
                this.inputType = "color";
            }

            this.base();

            // set up default spectrum settings
            if (typeof(this.options.spectrum) === "undefined")
            {
                this.options.spectrum = {};
            }
            if (typeof(this.options.spectrum.showInput) === "undefined")
            {
                this.options.spectrum.showInput = true;
            }
            if (typeof(this.options.spectrum.showPalette) === "undefined")
            {
                this.options.spectrum.showPalette = true;
            }
            if (typeof(this.options.spectrum.preferredFormat) === "undefined")
            {
                this.options.spectrum.preferredFormat = "hex3";
            }
            if (typeof(this.options.spectrum.clickoutFiresChange) === "undefined")
            {
                this.options.spectrum.clickoutFiresChange = true;
            }
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "color";
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
                if (self.spectrumAvailable && self.control)
                {
                    setTimeout(function() {
                        $((self.control)[0]).spectrum(
                          $.extend({ color: this.data }, self.options.spectrum)
                        );
                    }, 100);

                    $(self.control).on('change.spectrum', function(e, tinycolor) {
                        self.setValue(tinycolor.toHexString());
                    });
                }

                callback();
            });
        },

        /* builder_helpers */

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Color Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "A color picker for selecting hexadecimal color values";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("color", Alpaca.Fields.ColorField);
    Alpaca.registerDefaultSchemaFieldMapping("color", "color");

})(jQuery);
