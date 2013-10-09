(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TextAreaField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.TextAreaField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.TextField
         *
         * @class Textarea control for chunk of text.
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

            if (!this.options.rows) {
                this.options.rows = 5;
            }

            if (!this.options.cols) {
                this.options.cols = 40;
            }

            this.controlFieldTemplateDescriptor = this.view.getTemplateDescriptor("controlFieldTextarea");
        },

        /**
         * @see Alpaca.Fields.TextField#postRender
         */
        postRender: function() {
            this.base();
            if (this.fieldContainer) {
                this.fieldContainer.addClass('alpaca-controlfield-textarea');
            }
        },

        /**
         * @see Alpaca.ControlField#handleValidate
         */
        handleValidate: function() {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status =  this._validateWordCount();
            valInfo["wordLimitExceeded"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.view.getMessage("wordLimitExceeded"), [this.options.wordlimit]),
                "status": status
            };

            return baseStatus && valInfo["wordLimitExceeded"]["status"];
        },

        /**
         * Validate for word limit.
         *
         * @returns {Boolean} True if the number of words is equal to or less than the word limit.
         */
        _validateWordCount: function() {

            if (this.options.wordlimit && this.options.wordlimit > -1)
            {
                var val = this.data;

                if (val)
                {
                    var wordcount = val.split(" ").length;
                    if (wordcount > this.options.wordlimit)
                    {
                        return false;
                    }
                }
            }

            return true;
        },


        /**
         *@see Alpaca.Fields.TextField#setValue
         */
        setValue: function(value) {
            $(this.field).val(value);

            // be sure to call into base method
            this.base(value);
        },

        /**
         * @see Alpaca.Fields.TextField#getValue
         */
        getValue: function() {
            return $(this.field).val();
        },//__BUILDER_HELPERS

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "rows": {
                        "title": "Rows",
                        "description": "Number of rows",
                        "type": "number",
                        "default": 5
                    },
                    "cols": {
                        "title": "Columns",
                        "description": "Number of columns",
                        "type": "number",
                        "default": 40
                    },
                    "wordlimit": {
                        "title": "Word Limit",
                        "description": "Limits the number of words allowed in the text area.",
                        "type": "number",
                        "default": -1
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
                    "rows": {
                        "type": "integer"
                    },
                    "cols": {
                        "type": "integer"
                    },
                    "wordlimit": {
                        "type": "integer"
                    }
                }
            });
        },

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Multi-Line Text";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Textarea field for multiple line text.";
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "textarea";
        }//__END_OF_BUILDER_HELPERS

    });

    Alpaca.registerMessages({
        "wordLimitExceeded": "The maximum word limit of {0} has been exceeded."
    });

    Alpaca.registerTemplate("controlFieldTextarea", '<textarea id="${id}" {{if options.placeholder}}placeholder="${options.placeholder}"{{/if}} {{if options.rows}}rows="${options.rows}"{{/if}} {{if options.cols}}cols="${options.cols}"{{/if}} {{if options.readonly}}readonly="readonly"{{/if}} {{if name}}name="${name}"{{/if}} {{each options.data}}data-${fieldId}="${value}"{{/each}}/>');
    Alpaca.registerFieldClass("textarea", Alpaca.Fields.TextAreaField);

})(jQuery);
