
/**
 * Uses: https://github.com/tkrotoff/jquery-simplecolorpicker
 */
(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.SimpleColorPickerField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.SimpleColorPickerField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            var self = this;

            this.simpleColorPickerAvailable = false;
            if (!self.isDisplayOnly() && typeof($.fn.simplecolorpicker) !== "undefined")
            {
                this.simpleColorPickerAvailable = true;
            }

            // default html5 input type = "color";
            if (typeof(this.options.simplecolorpicker) === "undefined" && !self.simpleColorPickerAvailable)
            {
                this.inputType = "color";
            }

            this.base();

            // set up default spectrum settings
            if (typeof(this.options.simplecolorpicker) === "undefined")
            {
                this.options.simplecolorpicker = {};
            }

            if (typeof(this.options.simplecolorpicker.picker) === "undefined")
            {
                this.options.simplecolorpicker.picker = true;
            }

            // if colors not specified, use default colors
            if (typeof(this.options.colors) === "undefined")
            {
                this.options.colors = [{
                    "value": "#1abc9c",
                    "label": "Turquoise"
                }, {
                    "value": "#2ecc71",
                    "label": "Emerald"
                }, {
                    "value": "#3498db",
                    "label": "Peter River"
                }, {
                    "value": "#9b59b6",
                    "label": "Amethyst"
                }, {
                    "value": "#34495e",
                    "label": "Wet Asphalt"
                }, {
                    "value": "#16a085",
                    "label": "Green Sea"
                }, {
                    "value": "#27ae60",
                    "label": "Nephritis"
                }, {
                    "value": "#2980b9",
                    "label": "Belize Hole"
                }, {
                    "value": "#8e44ad",
                    "label": "Wisteria"
                }, {
                    "value": "#2c3e50",
                    "label": "Midnight Blue"
                }, {
                    "value": "#f1c40f",
                    "label": "Sunflower"
                }, {
                    "value": "#e67e22",
                    "label": "Carrot"
                }, {
                    "value": "#e74c3c",
                    "label": "Alizarin"
                }, {
                    "value": "#ecf0f1",
                    "label": "Clouds"
                }, {
                    "value": "#95a5a6",
                    "label": "Concrete"
                }, {
                    "value": "#f39c12",
                    "label": "Orange"
                }, {
                    "value": "#d35400",
                    "label": "Pumpkin"
                }, {
                    "value": "#c0392b",
                    "label": "Pomegranate"
                }, {
                    "value": "#bdc3c7",
                    "label": "Silver"
                }, {
                    "value": "#7f8c8d",
                    "label": "Charcoal"
                }, {
                    "value": "#bb9977",
                    "label": "Alpaca"
                }]
            }

            if (this.data)
            {
                self.options.selectedColor = self.findMatchingColor(this.data);
            }
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "simplecolorpicker";
        },

        /**
         * @see Alpaca.Fields.TextField#getType
         */
        getType: function() {
            return "string";
        },

        findMatchingColor: function(value)
        {
            var self = this;

            var match = null;

            for (var i = 0; i < self.options.colors.length; i++)
            {
                if (self.options.colors[i].value === value)
                {
                    match = self.options.colors[i];
                }
            }

            if (match && !match.label) {
                match.label = match.value;
            }

            return match;
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                if (self.control)
                {
                    var select = $(self.control).children("select[name='colorpicker']");
                    var title = $(self.control).children("span.colorpicker-title");

                    $(select).on("change", function (e) {
                        var colorValue = $(this).val();
                        var match = self.findMatchingColor(colorValue);
                        if (match)
                        {
                            $(title).html(match.label);
                        }
                    });

                    // if we can render the plugin...
                    if (self.simpleColorPickerAvailable)
                    {
                        if (self.options.simplecolorpicker)
                        {
                            $(select).simplecolorpicker(self.options.simplecolorpicker);
                        }
                        else
                        {
                            $(select).simplecolorpicker();
                        }

                        if (self.data)
                        {
                            $(select).simplecolorpicker('selectColor', self.data);
                        }
                    }
                    else
                    {
                        if (self.data)
                        {
                            $(select).val(self.data);
                        }
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
            return "Simple Color Picker Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "A simple color picker for selecting hexadecimal color values";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("simplecolorpicker", Alpaca.Fields.SimpleColorPickerField);

})(jQuery);
