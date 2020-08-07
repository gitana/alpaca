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
            if (typeof(this.options.markdown) === "undefined")
            {
                this.options.markdown = {};
                if (Alpaca.Fields.MarkdownField.defaults && Alpaca.Fields.MarkdownField.defaults.options && Alpaca.Fields.MarkdownField.defaults.options.markdown)
                {
                    for (var k in Alpaca.Fields.MarkdownField.defaults.options.markdown)
                    {
                        this.options.markdown[k] = Alpaca.Fields.MarkdownField.defaults.options.markdown[k];
                    }
                }
            }

        },

        initMarkdownEditorEvents: function()
        {
            var self = this;

            if (self.editor)
            {
                self.editor.codemirror.on("change", function(e) {
                    self.onChange();
                    self.triggerWithPropagation("change", e);
                    self.triggerWithPropagation("after_nested_change", e);
                });

                self.editor.codemirror.on("beforeChange", function(e) {
                    self.triggerWithPropagation("before_nested_change", e);
                });

                self.editor.codemirror.on("keyHandled", function(e) {
                    self.onKeyPress.call(self, e);
                    self.trigger("keypress", e);
                });

                self.editor.codemirror.on('blur', function (e) {
                    self.onBlur();
                    self.trigger("blur", e);
                });

                self.editor.codemirror.on("focus", function (e) {
                    self.onFocus.call(self, e);
                    self.trigger("focus", e);
                });

                self.editor.codemirror.on("mousedown", function (e) {
                    self.onClick.call(self, e);
                    self.trigger("click", e);
                });
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
                            // Replace toolbar buttons with configured plugins
                            var toolbar = self.options.markdown.toolbar;
                            if (toolbar && Alpaca.isArray(toolbar))
                            {
                                for (var i = 0; i < toolbar.length; i++)
                                {
                                    var toolbarItem = toolbar[i];
                                    if (Alpaca.isString(toolbarItem) && toolbarItem in Alpaca.Fields.MarkdownField.ToolbarButtonPlugins )
                                    {
                                        toolbar[i] = Alpaca.Fields.MarkdownField.ToolbarButtonPlugins[toolbarItem];
                                    }
                                }
                            }
                            
                            self.editor = new SimpleMDE(self.options.markdown);
                        }

                        self.initMarkdownEditorEvents();
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
                if (!value)
                {
                    self.editor.value("");
                }
                else
                {
                    self.editor.value(value);
                }
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

    Alpaca.Fields.MarkdownField.ToolbarButtonPlugins = {};

    Alpaca.Fields.MarkdownField.registerToolbarButtonPlugin = function(key, config)
    {
        Alpaca.Fields.MarkdownField.ToolbarButtonPlugins[key] = config;
    };

    Alpaca.registerFieldClass("markdown", Alpaca.Fields.MarkdownField);

})(jQuery);