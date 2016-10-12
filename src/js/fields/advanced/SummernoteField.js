(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.SummernoteField = Alpaca.Fields.TextAreaField.extend(
    /**
     * @lends Alpaca.Fields.SummernoteField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextAreaField#getFieldType
         */
        getFieldType: function() {
            return "summernote";
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

            if (typeof(this.options.summernote) == "undefined")
            {
                this.options.summernote = {
                    height: null,
                    minHeight: null,
                    maxHeight: null,
                    focus: true
                };
            }
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                // see if we can render Summernote Editor
                if (!self.isDisplayOnly() && self.control && $.fn.summernote)
                {
                    // wait for Alpaca to declare the DOM swapped and ready before we attempt to do anything with CKEditor
                    self.on("ready", function() {
                        $(self.control).summernote(self.options.summernote);
                    });
                }

                // if summernote's dom element gets destroyed, make sure we clean up the editor instance
                $(self.control).bind('destroyed', function() {
                    try { $(self.control).summernote('destroy'); } catch (e) { }
                });

                callback();
            });
        }

        /* builder_helpers */

        /**
         * @see Alpaca.Fields.TextAreaField#getTitle
         */
        ,
        getTitle: function() {
            return "Summernote Editor";
        },

        /**
         * @see Alpaca.Fields.TextAreaField#getDescription
         */
        getDescription: function() {
            return "Provides an instance of a Summernote Editor control for use in editing HTML.";
        },

        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "summernote": {
                        "title": "Summernote Editor options",
                        "description": "Use this entry to provide configuration options to the underlying Summernote plugin.",
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
                    "summernote": {
                        "type": "any"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("summernote", Alpaca.Fields.SummernoteField);

})(jQuery);
