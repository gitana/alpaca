(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.CountryCallingCodeField = Alpaca.Fields.SelectField.extend(
    /**
     * @lends Alpaca.Fields.CountryCallingCodeField.prototype
     */
    {
        /**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function() {
            return "countryCallingCode";
        },

        /**
         * @see Alpaca.Fields.Field#setup
         */
        setup: function()
        {
            var self = this;

            // defaults
            if (Alpaca.isUndefined(self.options.capitalize))
            {
                self.options.capitalize = false;
            }

            self.schema["enum"] = [];
            self.options.optionLabels = [];

            var countryCallingCodesList = this.getMessage("countryCallingCodes");
            if (countryCallingCodesList)
            {
                var listClean = countryCallingCodesList.filter(function(obj) {
                    return obj.dial_code != null;
                });

                listClean.forEach(function(obj) {
                    var code = obj.dial_code.split('+').join('').split(' ').join('');
                    var label = obj.dial_code + ' (' + obj.name + ')';
                    if (self.options.capitalize)
                    {
                        label = label.toUpperCase();
                    }

                    self.schema["enum"].push(code);
                    self.options.optionLabels.push(label);
                });
            }

            self.base();
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Country Calling Code Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Provides a dropdown selector of country dialing codes.";
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {

            return Alpaca.merge(this.base(), {
                "properties": {
                    "capitalize": {
                        "title": "Capitalize",
                        "description": "Whether the values should be capitalized",
                        "type": "boolean",
                        "default": false,
                        "readonly": true
                    }
                }
            });

        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "capitalize": {
                        "type": "checkbox"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("countryCallingCode", Alpaca.Fields.CountryCallingCodeField);
    Alpaca.registerDefaultFormatFieldMapping("countryCallingCode", "countryCallingCode");

})(jQuery);
