(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.CheckBoxField = Alpaca.ControlField.extend(
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

                self.base();

                if (typeof(self.options.multiple) == "undefined")
                {
                    if (self.schema.type === "array")
                    {
                        self.options.multiple = true;
                    }
                    else if (typeof(self.schema["enum"]) !== "undefined")
                    {
                        self.options.multiple = true;
                    }
                }

                if (self.options.multiple)
                {
                    // multiple mode

                    self.checkboxOptions = [];

                    // if we have enum values, copy them into checkbox options
                    if (self.getEnum())
                    {
                        // sort the enumerated values
                        self.sortEnum();

                        var optionLabels = self.getOptionLabels();

                        $.each(self.getEnum(), function (index, value) {

                            var text = value;
                            if (optionLabels)
                            {
                                if (!Alpaca.isEmpty(optionLabels[index]))
                                {
                                    text = optionLabels[index];
                                }
                                else if (!Alpaca.isEmpty(optionLabels[value]))
                                {
                                    text = optionLabels[value];
                                }
                            }

                            self.checkboxOptions.push({
                                "value": value,
                                "text": text
                            });
                        });
                    }

                    // if they provided "datasource", we copy to "dataSource"
                    if (self.options.datasource && !self.options.dataSource) {
                        self.options.dataSource = self.options.datasource;
                        delete self.options.datasource;
                    }

                    // we optionally allow the data source return values to override the schema and options
                    if (typeof(self.options.useDataSourceAsEnum) === "undefined")
                    {
                        self.options.useDataSourceAsEnum = true;
                    }
                }
                else
                {
                    // single mode

                    if (!this.options.rightLabel) {
                        this.options.rightLabel = "";
                    }
                }
            },

            prepareControlModel: function(callback)
            {
                var self = this;

                this.base(function(model) {

                    if (self.checkboxOptions)
                    {
                        model.checkboxOptions = self.checkboxOptions;
                    }

                    callback(model);
                });
            },

            /**
             * @OVERRIDE
             */
            getEnum: function()
            {
                var values = this.base();
                if (!values)
                {
                    if (this.schema && this.schema.items && this.schema.items.enum)
                    {
                        values = this.schema.items.enum;
                    }
                }

                return values;
            },

            /**
             * @OVERRIDE
             */
            getOptionLabels: function()
            {
                var values = this.base();
                if (!values)
                {
                    if (this.options && this.options.items && this.options.items.optionLabels)
                    {
                        values = this.options.items.optionLabels;
                    }
                }

                return values;
            },

            /**
             * Handler for the event that the checkbox is clicked.
             *
             * @param e Event.
             */
            onClick: function(e)
            {
                this.refreshValidationState();
            },

            /**
             * @see Alpaca.ControlField#beforeRenderControl
             */
            beforeRenderControl: function(model, callback)
            {
                var self = this;

                this.base(model, function() {

                    if (self.options.dataSource)
                    {
                        // switch to multiple mode
                        self.options.multiple = true;

                        if (!self.checkboxOptions) {
                            model.checkboxOptions = self.checkboxOptions = [];
                        }

                        // clear the array
                        self.checkboxOptions.length = 0;

                        self.invokeDataSource(self.checkboxOptions, model, function(err) {

                            if (self.options.useDataSourceAsEnum)
                            {
                                // now build out the enum and optionLabels
                                var _enum = [];
                                var _optionLabels = [];
                                for (var i = 0; i < self.checkboxOptions.length; i++)
                                {
                                    _enum.push(self.checkboxOptions[i].value);
                                    _optionLabels.push(self.checkboxOptions[i].text);
                                }

                                self.setEnum(_enum);
                                self.setOptionLabels(_optionLabels);
                            }

                            callback();
                        });
                    }
                    else
                    {
                        callback();
                    }

                });
            },


            /**
             * @see Alpaca.ControlField#postRender
             */
            postRender: function(callback) {

                var self = this;

                this.base(function() {

                    // do this little trick so that if we have a default value, it gets set during first render
                    // this causes the checked state of the control to update
                    if (self.data && typeof(self.data) !== "undefined")
                    {
                        self.setValue(self.data);
                    }

                    // for multiple mode, mark values
                    if (self.options.multiple)
                    {
                        // none checked
                        $(self.getFieldEl()).find("input:checkbox").prop("checked", false);

                        if (self.data)
                        {
                            var dataArray = self.data;
                            if (typeof(self.data) === "string")
                            {
                                dataArray = self.data.split(",");
                                for (var a = 0; a < dataArray.length; a++)
                                {
                                    dataArray[a] = $.trim(dataArray[a]);
                                }
                            }

                            for (var k in dataArray)
                            {
                                $(self.getFieldEl()).find("input:checkbox[data-checkbox-value=\"" + dataArray[k] + "\"]").prop("checked", true);
                            }
                        }
                    }

                    // single mode

                    // whenever the state of one of our input:checkbox controls is changed (either via a click or programmatically),
                    // we signal to the top-level field to fire up a change
                    //
                    // this allows the dependency system to recalculate and such
                    //
                    $(self.getFieldEl()).find("input:checkbox").change(function(evt) {
                        self.triggerWithPropagation("change");
                    });

                    callback();
                });
            },

            /**
             * @see Alpaca.Field#getValue
             */
            getControlValue: function()
            {
                var self = this;

                var value = null;

                if (!self.options.multiple)
                {
                    // single scalar value
                    var input = $(self.getFieldEl()).find("input");
                    if (input.length > 0)
                    {
                        value = Alpaca.checked($(input[0]));
                    }
                    else
                    {
                        value = false;
                    }
                }
                else
                {
                    // multiple values
                    var values = [];
                    for (var i = 0; i < self.checkboxOptions.length; i++)
                    {
                        var inputField = $(self.getFieldEl()).find("input[data-checkbox-index='" + i + "']");
                        if (Alpaca.checked(inputField))
                        {
                            var v = $(inputField).attr("data-checkbox-value");
                            values.push(v);
                        }
                    }

                    // determine how we're going to hand this value back

                    // if type == "array", we just hand back the array
                    // if type == "string", we build a comma-delimited list
                    if (self.schema.type === "array")
                    {
                        value = values;
                    }
                    else if (self.schema.type === "string")
                    {
                        value = values.join(",");
                    }
                }

                return value;
            },

            /**
             * @see Alpaca.Field#setValue
             */
            setValue: function(value)
            {
                var self = this;

                // value can be a boolean, string ("true"), string ("a,b,c") or an array of values

                var applyScalarValue = function(value)
                {
                    if (Alpaca.isString(value)) {
                        value = (value === "true");
                    }

                    var input = $(self.getFieldEl()).find("input");
                    if (input.length > 0)
                    {
                        Alpaca.checked($(input[0]), value);
                    }
                };

                var applyMultiValue = function(values)
                {
                    // allow for comma-delimited strings
                    if (typeof(values) === "string")
                    {
                        values = values.split(",");
                    }

                    // trim things to remove any excess white space
                    for (var i = 0; i < values.length; i++)
                    {
                        values[i] = Alpaca.trim(values[i]);
                    }

                    // walk through values and assign into appropriate inputs
                    Alpaca.checked($(self.getFieldEl()).find("input[data-checkbox-value]"), false);
                    for (var j = 0; j < values.length; j++)
                    {
                        var input = $(self.getFieldEl()).find("input[data-checkbox-value=\"" + values[j] + "\"]");
                        if (input.length > 0)
                        {
                            Alpaca.checked($(input[0]), value);
                        }
                    }
                };

                var applied = false;

                if (!self.options.multiple)
                {
                    // single value mode

                    // boolean
                    if (typeof(value) === "boolean")
                    {
                        applyScalarValue(value);
                        applied = true;
                    }
                    else if (typeof(value) === "string")
                    {
                        applyScalarValue(value);
                        applied = true;
                    }
                }
                else
                {
                    // multiple value mode

                    if (typeof(value) === "string")
                    {
                        applyMultiValue(value);
                        applied = true;
                    }
                    else if (Alpaca.isArray(value))
                    {
                        applyMultiValue(value);
                        applied = true;
                    }
                }

                if (!applied && value)
                {
                    Alpaca.logError("CheckboxField cannot set value for schema.type=" + self.schema.type + " and value=" + value);
                }

                // be sure to call into base method
                this.base(value);
            },

            /**
             * Validate against enum property in the case that the checkbox field is in multiple mode.
             *
             * @returns {Boolean} True if the element value is part of the enum list, false otherwise.
             */
            _validateEnum: function()
            {
                var self = this;

                if (!self.options.multiple)
                {
                    return true;
                }

                var val = self.getValue();
                if (!self.isRequired() && Alpaca.isValEmpty(val))
                {
                    return true;
                }

                // if val is a string, convert to array
                if (typeof(val) === "string")
                {
                    val = val.split(",");
                }

                return Alpaca.anyEquality(val, self.getEnum());
            },

            /**
             * @see Alpaca.Field#disable
             */
            disable: function()
            {
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
                $(this.control).find("input").each(function() {
                    $(this).disabled = false;
                    $(this).prop("disabled", false);
                });
            },

            /**
             * @see Alpaca.Field#getType
             */
            getType: function() {
                return "boolean";
            },


            /* builder_helpers */

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