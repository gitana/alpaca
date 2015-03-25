(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TextAreaField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.TextAreaField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function()
        {
            return "textarea";
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            this.base();

            if (!this.options.rows) {
                this.options.rows = 5;
            }

            if (!this.options.cols) {
                this.options.cols = 40;
            }
        },

        /**
         * @see Alpaca.ControlField#handleValidate
         */
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status =  this._validateWordCount();
            valInfo["wordLimitExceeded"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("wordLimitExceeded"), [this.options.wordlimit]),
                "status": status
            };

            return baseStatus && valInfo["wordLimitExceeded"]["status"];
        },

        /**
         * Validate for word limit.
         *
         * @returns {Boolean} True if the number of words is equal to or less than the word limit.
         */
        _validateWordCount: function()
        {
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
        }

        /* builder_helpers */
        ,

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
        }

        /* end_builder_helpers */

    });

    Alpaca.registerMessages({
        "wordLimitExceeded": "The maximum word limit of {0} has been exceeded."
    });

    Alpaca.registerFieldClass("textarea", Alpaca.Fields.TextAreaField);

})(jQuery);
