(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.MarkdownField = Alpaca.Fields.TextAreaField.extend(
    /**
     * @lends Alpaca.Fields.MarkdownField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextAreaField#getFieldType
         */
        getFieldType: function() {
            return "markdown";
        },

        /**
         * @see Alpaca.Fields.TextAreaField#setup
         */
        setup: function()
        {
            if (!this.data)
            {
                this.data = "";
            }

            this.base();

            if (typeof(this.options.markdown) == "undefined")
            {
                this.options.markdown = {};
            }
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                // see if we can render Markdown Editor
                if (!self.isDisplayOnly() && self.control && typeof(SimpleMDE) !== "undefined")
                {
                    self.on("ready", function() {

                        self.options.markdown.element = $(self.control)[0];

                        if (!self.editor)
                        {
                            self.editor = new SimpleMDE(self.options.markdown);
                        }
                    });
                }

                // if markdown's dom element gets destroyed, make sure we clean up the editor instance
                $(self.control).bind('destroyed', function() {
                    try { $(self.control).markdown('destroy'); } catch (e) { }
                });

                callback();
            });
        },

        setValue: function(value)
        {
            var self = this;

            // be sure to call into base method
            this.base(value);

            if (self.editor)
            {
                self.editor.value(value);
            }
        },

        /**
         * @see Alpaca.Fields.ControlField#getControlValue
         */
        getControlValue: function()
        {
            var self = this;

            var value = null;

            if (self.editor)
            {
                value = self.editor.value();
            }

            return value;
        },


        /* builder_helpers */

        /**
         * @see Alpaca.Fields.TextAreaField#getTitle
         */
        getTitle: function() {
            return "Markdown Editor";
        },

        /**
         * @see Alpaca.Fields.TextAreaField#getDescription
         */
        getDescription: function() {
            return "Provides an instance of a Markdown Editor control for use in editing HTML.";
        },

        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "markdown": {
                        "title": "Markdown Editor options",
                        "description": "Use this entry to provide configuration options to the underlying Markdown plugin.",
                        "type": "any"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ControlField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "markdown": {
                        "type": "any"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("markdown", Alpaca.Fields.MarkdownField);

})(jQuery);