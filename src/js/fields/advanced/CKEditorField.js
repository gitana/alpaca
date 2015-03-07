(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.CKEditorField = Alpaca.Fields.TextAreaField.extend(
    /**
     * @lends Alpaca.Fields.CKEditorField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextAreaField#getFieldType
         */
        getFieldType: function() {
            return "ckeditor";
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

            if (typeof(this.options.ckeditor) == "undefined")
            {
                this.options.ckeditor = {};
            }
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                // see if we can render CK Editor
                if (!self.isDisplayOnly() && self.control && typeof(CKEDITOR) !== "undefined")
                {
                    // use a timeout because CKEditor has some odd timing dependencies
                    setTimeout(function() {

                        self.editor = CKEDITOR.replace($(self.control)[0], self.options.ckeditor);

                    }, 250);
                }

                // if the ckeditor's dom element gets destroyed, make sure we clean up the editor instance
                $(self.control).bind('destroyed', function() {

                    if (self.editor)
                    {
                        self.editor.removeAllListeners();
                        self.editor.destroy(false);
                        self.editor = null;
                    }

                });

                callback();
            });
        },

        /**
         * @see Alpaca.Field#destroy
         */
        destroy: function()
        {
            // destroy the plugin instance
            if (this.editor)
            {
                this.editor.destroy();
                this.editor = null;
            }

            // call up to base method
            this.base();
        }

        /* builder_helpers */

        /**
         * @see Alpaca.Fields.TextAreaField#getTitle
         */
        ,
        getTitle: function() {
            return "CK Editor";
        },

        /**
         * @see Alpaca.Fields.TextAreaField#getDescription
         */
        getDescription: function() {
            return "Provides an instance of a CK Editor control for use in editing HTML.";
        },

        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "ckeditor": {
                        "title": "CK Editor options",
                        "description": "Use this entry to provide configuration options to the underlying CKEditor plugin.",
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
                    "ckeditor": {
                        "type": "any"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("ckeditor", Alpaca.Fields.CKEditorField);

})(jQuery);
