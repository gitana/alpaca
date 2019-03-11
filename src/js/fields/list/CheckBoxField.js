(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.CheckBoxField = Alpaca.Fields.ListField.extend(
    /**
     * @lends Alpaca.Fields.CheckBoxField.prototype
     */
    {
        /**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function() {
            return "checkbox";
        },

        /**
         * @see Alpaca.Field#setup
         */
        setup: function() {

            var self = this;

            if (typeof(self.options.multiple) === "undefined")
            {
                self.options.multiple = false;

                if (self.schema.type === "array")
                {
                    self.options.multiple = true;
                }
                else if (typeof(self.schema["enum"]) !== "undefined")
                {
                    self.options.multiple = true;
                }
            }

            self.base();

            // in single mode, blank out rightlabel
            if (!self.options.multiple)
            {
                if (!this.options.rightLabel) {
                    this.options.rightLabel = "";
                }
            }
        },

        prepareControlModel: function(callback)
        {
            var self = this;

            this.base(function(model) {
                callback(model);
            });
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                var afterChangeHandler = function()
                {
                    var newData = [];

                    if (self.options.multiple)
                    {
                        $(self.getFieldEl()).find("input:checkbox").each(function() {

                            var value = $(this).attr("data-checkbox-value");

                            if (Alpaca.checked(this))
                            {
                                for (var i = 0; i < self.selectOptions.length; i++)
                                {
                                    if (self.selectOptions[i].value === value)
                                    {
                                        newData.push(self.selectOptions[i].value);
                                    }
                                }
                            }
                        });
                    }
                    else
                    {
                        var checkbox = $(self.getFieldEl()).find("input:checkbox");
                        if (Alpaca.checked(checkbox))
                        {
                            newData = true;
                        }
                    }

                    // set value silently
                    self.setValue(newData, true);

                    self.refreshValidationState();
                    self.triggerWithPropagation("change");
                };

                // whenever the state of one of our input:checkbox controls is changed (either via a click or programmatically),
                // we signal to the top-level field to fire up a change
                //
                // this allows the dependency system to recalculate and such
                //
                $(self.getFieldEl()).find("input:checkbox").change(function(evt) {
                    afterChangeHandler();
                });

                callback();
            });
        },

        afterSetValue: function()
        {
            var self = this;

            // uncheck everything
            Alpaca.checked($(self.getFieldEl()).find("input:checkbox"), false);

            // check those that are selected
            if (self.options.multiple)
            {
                for (var i = 0; i < self.data.length; i++)
                {
                    var checkbox = $(self.getFieldEl()).find("input:checkbox[data-checkbox-value='" + self.data[i].value + "']");
                    Alpaca.checked(checkbox, true);
                }
            }
            else
            {
                var checkbox = $(self.getFieldEl()).find("input:checkbox");
                if (self.data.length > 0)
                {
                    Alpaca.checked(checkbox, true);
                }
            }
        },

        /**
         * @see Alpaca.Field#disable
         */
        disable: function()
        {
            $(this.control).addClass("disabled");

            $(this.control).find("input").each(function() {
                $(this).disabled = true;
                $(this).prop("disabled", true);
            });
        },

        /**
         * @see Alpaca.Field#enable
         */
        enable: function()
        {
            $(this.control).removeClass("disabled");

            $(this.control).find("input").each(function() {
                $(this).disabled = false;
                $(this).prop("disabled", false);
            });
        },

        /**
         * @see Alpaca.Field#getType
         */
        getType: function() {
            return "boolean"; // or string, or array of strings or array of objects
        }

        /* builder_helpers */

        ,

        /**
         * @see Alpaca.Field#getTitle
         */
        getTitle: function() {
            return "Checkbox Field";
        },

        /**
         * @see Alpaca.Field#getDescription
         */
        getDescription: function() {
            return "Checkbox Field for boolean (true/false), string ('true', 'false' or comma-delimited string of values) or data array.";
        },

        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "rightLabel": {
                        "title": "Option Label",
                        "description": "Optional right-hand side label for single checkbox field.",
                        "type": "string"
                    },
                    "multiple": {
                        "title": "Multiple",
                        "description": "Whether to render multiple checkboxes for multi-valued type (such as an array or a comma-delimited string)",
                        "type": "boolean"
                    },
                    "dataSource": {
                        "title": "Option DataSource",
                        "description": "Data source for generating list of options.  This can be a string or a function.  If a string, it is considered to be a URI to a service that produces a object containing key/value pairs or an array of elements of structure {'text': '', 'value': ''}.  This can also be a function that is called to produce the same list.",
                        "type": "string"
                    },
                    "useDataSourceAsEnum": {
                        "title": "Use Data Source as Enumerated Values",
                        "description": "Whether to constrain the field's schema enum property to the values that come back from the data source.",
                        "type": "boolean",
                        "default": true
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
                    "rightLabel": {
                        "type": "text"
                    },
                    "multiple": {
                        "type": "checkbox"
                    },
                    "dataSource": {
                        "type": "text"
                    }
                }
            });
        }

        /* end_builder_helpers */

    });

    Alpaca.registerFieldClass("checkbox", Alpaca.Fields.CheckBoxField);
    Alpaca.registerDefaultSchemaFieldMapping("boolean", "checkbox");

})(jQuery);