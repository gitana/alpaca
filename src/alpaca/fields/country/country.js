(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["alpaca/Alpaca", "jquery"], factory);
    } else {
        factory(window.Alpaca, window.$);
    }
}(this, function (Alpaca, $) {

    /**
     * @lends Alpaca.Fields.CountryField.prototype
     *
     * @constructs
     * @augments Alpaca.Fields.TextField
     *
     * @class Country Control
     */
    Alpaca.Fields.CountryField = Alpaca.Fields.SelectField.extend({

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function() {

            // defaults
            if (Alpaca.isUndefined(this.options.capitalize)) {
                this.options.capitalize = false;
            }

            this.schema["enum"] = [];
            this.options.optionLabels = [];

            var countriesMap = this.view.getMessage("countries");
            if (countriesMap)
            {
                for (var countryKey in countriesMap)
                {
                    this.schema["enum"].push(countryKey);

                    var label = countriesMap[countryKey];
                    if (this.options.capitalize) {
                        label = label.toUpperCase();
                    }
                    this.options.optionLabels.push(label);
                }
            }

            this.base();
        },

        /**
         * @see Alpaca.Fields.TextField#postRender
         */
        postRender: function(callback) {

            var self = this;

            this.base(function() {

                if (self.fieldContainer) {
                    self.fieldContainer.addClass('alpaca-controlfield-country');
                }

                callback();

            });
        },

        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function() {
            var baseStatus = this.base();

            // no additional validation

            return baseStatus;
        },//__BUILDER_HELPERS

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
        },

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Country Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Provides a dropdown selector of countries keyed by their ISO3 code.  The names of the countries are read from the I18N bundle for the current locale.";
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "country";
        }//__END_OF_BUILDER_HELPERS
    });

    Alpaca.registerFieldClass("country", Alpaca.Fields.CountryField);
    Alpaca.registerDefaultFormatFieldMapping("country", "country");

    return Alpaca.Fields.CountryField;

}));
