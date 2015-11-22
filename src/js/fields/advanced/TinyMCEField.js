(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TinyMCEField = Alpaca.Fields.TextAreaField.extend(
        /**
         * @lends Alpaca.Fields.tinyMCEField.prototype
         */
        {
            /**
             * @see Alpaca.Fields.TextAreaField#getFieldType
             */
            getFieldType: function() {
                return "tinymce";
            },

            /**
             * @see Alpaca.Fields.TextAreaField#setup
             */
            setup: function()
            {
                var self = this;

                if (!this.data)
                {
                    this.data = "";
                }

                if (!self.options.toolbar)
                {
                    self.options.toolbar = "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image";
                }

                this.base();
            },

            setValue: function(value)
            {
                var self = this;

                // be sure to call into base method
                this.base(value);

                if (self.editor)
                {
                    self.editor.setContent(value);
                }
            },

            /**
             * @see Alpaca.Fields.ControlField#getControlValue
             */
            getControlValue:function()
            {
                var self = this;

                var value = null;

                if (self.editor)
                {
                    value = self.editor.getContent()
                }

                return value;
            },

            initTinyMCEEvents: function()
            {
                var self = this;

                if (self.editor) {

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
                    self.editor.on("keypress", function (e) {
                        self.onKeyPress.call(self, e);
                        self.trigger("keypress", e);
                    });

                    // keyup event
                    self.editor.on("keyup", function (e) {
                        self.onKeyUp.call(self, e);
                        self.trigger("keyup", e);
                    });

                    // keydown event
                    self.editor.on("keydown", function (e) {
                        self.onKeyDown.call(self, e);
                        self.trigger("keydown", e);
                    });
                }
            },

            afterRenderControl: function(model, callback)
            {
                var self = this;

                this.base(model, function() {

                    if (!self.isDisplayOnly() && self.control && typeof(tinyMCE) !== "undefined")
                    {
                        // wait for Alpaca to declare the DOM swapped and ready before we attempt to do anything with CKEditor
                        self.on("ready", function() {

                            if (!self.editor)
                            {
                                var rteFieldID = $(self.control)[0].id;

                                tinyMCE.init({
                                    init_instance_callback: function(editor) {
                                        self.editor = editor;

                                        self.initTinyMCEEvents();
                                    },
                                    selector: "#" + rteFieldID,
                                    toolbar: self.options.toolbar
                                });

                            }
                        });
                    }

                    callback();
                });
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
                    self.editor.remove();
                    self.editor = null;
                }

                // call up to base method
                this.base();
            },


            /* builder_helpers */

            /**
             * @see Alpaca.Fields.TextAreaField#getTitle
             */
            getTitle: function() {
                return "TinyMCE Editor";
            },

            /**
             * @see Alpaca.Fields.TextAreaField#getDescription
             */
            getDescription: function() {
                return "Provides an instance of a TinyMCE control for use in editing HTML.";
            },

            /**
             * @private
             * @see Alpaca.ControlField#getSchemaOfOptions
             */
            getSchemaOfOptions: function() {
                return Alpaca.merge(this.base(), {
                    "properties": {
                        "toolbar": {
                            "title": "TinyMCE toolbar options",
                            "description": "Toolbar options for TinyMCE plugin.",
                            "type": "string"
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
                        "toolbar": {
                            "type": "text"
                        }
                    }
                });
            }

            /* end_builder_helpers */
        });

    Alpaca.registerFieldClass("tinymce", Alpaca.Fields.TinyMCEField);

})(jQuery);