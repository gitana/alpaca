(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["alpaca/Alpaca", "jquery"], factory);
    } else {
        factory(window.Alpaca, window.$);
    }
}(this, function (Alpaca, $) {

    /**
     * @lends Alpaca.Fields.TagField.prototype
     *
     * @constructs
     * @augments Alpaca.Fields.TextField
     *
     * @class Time control for JSON schema time format.
     */
    Alpaca.Fields.TagField = Alpaca.Fields.LowerCaseField.extend({

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
        postRender: function(callback) {

            var self = this;

            this.base(function() {

                if (self.fieldContainer) {
                    self.fieldContainer.addClass('alpaca-controlfield-tag');
                }

                callback();
            });
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

    return Alpaca.Fields.TagField;
}));
