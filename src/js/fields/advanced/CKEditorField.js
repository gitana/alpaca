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
                    // wait for Alpaca to declare the DOM swapped and ready before we attempt to do anything with CKEditor
                    self.on("ready", function() {
                        if (!self.editor)
                        {
                            self.editor = CKEDITOR.replace($(self.control)[0], self.options.ckeditor);

                            self.initCKEditorEvents();
                        }
                    });
                }

                // if the ckeditor's dom element gets destroyed, make sure we clean up the editor instance
                $(self.control).bind('destroyed', function() {

                    if (self.editor)
                    {
                        self.editor.removeAllListeners();
                        // catch here because CKEditor has an issue if DOM element deletes before CKEditor cleans up
                        // see: https://github.com/lemonde/angular-ckeditor/issues/7
                        try { self.editor.destroy(false); } catch (e) { }
                        self.editor = null;
                    }

                });

                callback();
            });
        },

        initCKEditorEvents: function()
        {
            var self = this;

            if (self.editor)
            {
                // click event
                self.editor.on("click", function (e) {
                    self.onClick.call(self, e);
                    self.trigger("click", e);
                });

                // change event
                self.editor.on("change", function (e) {
                    self.onChange();
                    self.triggerWithPropagation("change", e);
                });

                // blur event
                self.editor.on('blur', function (e) {
                    self.onBlur();
                    self.trigger("blur", e);
                });

                // focus event
                self.editor.on("focus", function (e) {
                    self.onFocus.call(self, e);
                    self.trigger("focus", e);
                });

                // keypress event
                self.editor.on("key", function (e) {
                    self.onKeyPress.call(self, e);
                    self.trigger("keypress", e);
                });

                // NOTE: these do not seem to work with CKEditor?
                /*
                 // keyup event
                 self.editor.on("keyup", function(e) {
                 self.onKeyUp.call(self, e);
                 self.trigger("keyup", e);
                 });

                 // keydown event
                 self.editor.on("keydown", function(e) {
                 self.onKeyDown.call(self, e);
                 self.trigger("keydown", e);
                 });
                 */
            }
        },

        setValue: function(value)
        {
            var self = this;

            // be sure to call into base method
            this.base(value);

            if (self.editor)
            {
                self.editor.setData(value);
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
                value = self.editor.getData();
            }

            return value;
        },

        /**
         * @see Alpaca.Field#destroy
         */
        destroy: function()
        {
            var self = this;

            // destroy the plugin instance
            if (self.editor)
            {
                self.editor.destroy();
                self.editor = null;
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
