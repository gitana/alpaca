(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.SelectField = Alpaca.Fields.ListField.extend(
    /**
     * @lends Alpaca.Fields.SelectField.prototype
     */
    {
        /**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function()
        {
            return "select";
        },

        /**
         * @see Alpaca.Fields.ListField#setup
         */
        setup: function()
        {
            var self = this;

            this.base();

            // automatically turn on "hideNone" if we're in multiselect mode and have the multiselect plugin
            if (self.options.multiple && $.fn.multiselect)
            {
                if (typeof(self.options.hideNone) === "undefined")
                {
                    self.options.hideNone = true;
                }
            }

            // offer some backward compability here as older version of Alpaca used to incorrectly look for
            // maxItems and minItems on the schema.items subobject.
            // if not defined properly, we offer some automatic forward migration of these properties
            if (this.schema.items && this.schema.items.maxItems && typeof(this.schema.maxItems) === "undefined") {
                this.schema.maxItems = this.schema.items.maxItems;
                delete this.schema.items.maxItems;
            }
            if (this.schema.items && this.schema.items.minItems && typeof(this.schema.minItems) === "undefined") {
                this.schema.minItems = this.schema.items.minItems;
                delete this.schema.items.minItems;
            }

            if (!self.options.multiselect && $.fn.multiselect)
            {
                self.options.multiselect = {};
            }

            if (self.options.multiselect && typeof(self.options.multiselect.disableIfEmpty) === "undefined")
            {
                self.options.multiselect.disableIfEmpty = true;
            }

            // if we're in a display only mode, turn off multiselect
            if (self.isDisplayOnly())
            {
                delete self.options.multiselect;
            }
        },

        initControlEvents: function()
        {
            var self = this;

            self.base();

            if (self.options.multiple)
            {
                var button = this.control.parent().find("button.multiselect");

                button.focus(function(e) {
                    if (!self.suspendBlurFocus)
                    {
                        self.onFocus.call(self, e);
                        self.trigger("focus", e);
                    }
                });

                button.blur(function(e) {
                    if (!self.suspendBlurFocus)
                    {
                        self.onBlur.call(self, e);
                        self.trigger("blur", e);
                    }
                });
            }
        },

        prepareControlModel: function(callback) {
            var self = this;

            this.base(function (model) {

                if (typeof(self.options.noneLabel) === "undefined")
                {
                    self.options.noneLabel = self.getMessage("noneLabel");
                }

                if (typeof(self.options.hideNone) === "undefined")
                {
                    if (typeof(self.options.removeDefaultNone) !== "undefined")
                    {
                        self.options.hideNone = self.options.removeDefaultNone;
                    }
                    else
                    {
                        self.options.hideNone = self.isRequired();
                    }
                }

                callback(model);
            });
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                // if we are in multiple mode and the bootstrap multiselect plugin is available, bind it in
                if (self.options.multiple && $.fn.multiselect && !self.isDisplayOnly())
                {
                    var settings = null;
                    if (self.options.multiselect) {
                        settings = self.options.multiselect;
                    }
                    else
                    {
                        settings = {};
                    }
                    if (!settings.nonSelectedText)
                    {
                        settings.nonSelectedText = "None";
                        if (self.options.noneLabel)
                        {
                            settings.nonSelectedText = self.options.noneLabel;
                        }
                    }

                    $(self.getControlEl()).multiselect(settings);
                }

                var afterChangeHandler = function()
                {
                    var newData = [];

                    var val = $(self.control).val();
                    if (!val) {
                        val = [];
                    }
                    if (Alpaca.isString(val)) {
                        val = [val];
                    }

                    var tempMap = {};
                    for (var i = 0; i < model.selectOptions.length; i++)
                    {
                        tempMap[model.selectOptions[i].value] = model.selectOptions[i];
                    }

                    for (var i = 0; i < val.length; i++)
                    {
                        if (tempMap[val[i]])
                        {
                            newData.push(tempMap[val[i]].value);
                        }
                    }

                    // set value silently
                    self.setValue(newData, true);

                    self.refreshValidationState();
                    self.triggerWithPropagation("change");
                };

                $(self.control).change(function(e) {
                    afterChangeHandler();
                });

                callback();

            });
        },

        afterSetValue: function()
        {
            var self = this;

            if (self.data.length > 0)
            {
                var values = [];
                for (var i = 0; i < self.data.length; i++) {
                    values.push(self.data[i].value);
                }

                $(self.control).val(values);
            }
        },

        /**
         * @see Alpaca.Field#focus
         */
        focus: function(onFocusCallback)
        {
            if (this.control && this.control.length > 0)
            {
                // set focus onto the select
                var el = $(this.control).get(0);

                el.focus();

                if (onFocusCallback)
                {
                    onFocusCallback(this);
                }
            }
        },

        /**
         * @override
         */
        disable: function()
        {
            var self = this;

            this.base();

            if (self.options.multiselect)
            {
                $(self.getControlEl()).multiselect("disable");
            }
        },

        /**
         * @override
         */
        enable: function()
        {
            var self = this;

            this.base();

            if (self.options.multiselect)
            {
                $(self.getControlEl()).multiselect("enable");
            }
        }




        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Field#getTitle
         */
        getTitle: function() {
            return "Select Field";
        },

        /**
         * @see Alpaca.Field#getDescription
         */
        getDescription: function() {
            return "Select Field";
        },

        /**
         * @private
         * @see Alpaca.Fields.ListField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "multiple": {
                        "title": "Multiple Selection",
                        "description": "Allow multiple selection if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "size": {
                        "title": "Displayed Options",
                        "description": "Number of options to be shown.",
                        "type": "number"
                    },
                    "emptySelectFirst": {
                        "title": "Empty Select First",
                        "description": "If the data is empty, then automatically select the first item in the list.",
                        "type": "boolean",
                        "default": false
                    },
                    "multiselect": {
                        "title": "Multiselect Plugin Settings",
                        "description": "Multiselect plugin properties - http://davidstutz.github.io/bootstrap-multiselect",
                        "type": "any"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.ListField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "multiple": {
                        "rightLabel": "Allow multiple selection ?",
                        "helper": "Allow multiple selection if checked",
                        "type": "checkbox"
                    },
                    "size": {
                        "type": "integer"
                    },
                    "emptySelectFirst": {
                        "type": "checkbox",
                        "rightLabel": "Empty Select First"
                    },
                    "multiselect": {
                        "type": "object",
                        "rightLabel": "Multiselect plugin properties - http://davidstutz.github.io/bootstrap-multiselect"
                    }
                }
            });
        }

        /* end_builder_helpers */

    });

    Alpaca.registerFieldClass("select", Alpaca.Fields.SelectField);

})(jQuery);
