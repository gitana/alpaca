(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TagField = Alpaca.Fields.LowerCaseField.extend(
    /**
     * @lends Alpaca.Fields.TagField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.TextField
         *
         * @class Time control for JSON schema time format.
         *
         * @param {Object} container Field container.
         * @param {Any} data Field data.
         * @param {Object} options Field options.
         * @param {Object} schema Field schema.
         * @param {Object|String} view Field view.
         * @param {Alpaca.Connector} connector Field connector.
         * @param {Function} errorCallback Error callback.
         */
        constructor: function(container, data, options, schema, view, connector, errorCallback) {
            this.base(container, data, options, schema, view, connector, errorCallback);
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function() {
            this.base();

            if (!this.options.separator) {
                this.options.separator = ",";
            }
        },

        /**
         * @see Alpaca.Fields.TextField#postRender
         */
        postRender: function() {
            this.base();
            if (this.fieldContainer) {
                this.fieldContainer.addClass('alpaca-controlfield-tag');
            }
        },

        /**
         * @see Alpaca.Fields.TextField#getValue
         */
        getValue: function() {
            var val = this.base();
            if (val === "") {
                return [];
            }
            return val.split(this.options.separator);
        },

        /**
         * @see Alpaca.Fields.TextField#setValue
         */
        setValue: function(val) {
            if (val === "") {
                return;
            }

            this.base(val.join(this.options.separator));
        },

        /**
         * @see Alpaca.Field#onBlur
         */
        onBlur: function(e) {
            this.base(e);

            var vals = this.getValue();

            var trimmed = [];

            $.each(vals, function(i, v) {
                if (v.trim() !== "") {
                    trimmed.push(v.trim());
                }
            });

            this.setValue(trimmed);

        },//__BUILDER_HELPERS

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "separator": {
                        "title": "Separator",
                        "description": "Separator used to split tags.",
                        "type": "string",
                        "default":","
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
                    "separator": {
                        "type": "text"
                    }
                }
            });
        },

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Tag Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Text field for entering list of tags separated by delimiter.";
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "tag";
        }//__END_OF_BUILDER_HELPERS
    });

    Alpaca.registerFieldClass("tag", Alpaca.Fields.TagField);
})(jQuery);
