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

            var _this = this;

            _this.base();

            if (!this.options.rightLabel) {
                this.options.rightLabel = "";
            }

            if (typeof(_this.options.multiple) == "undefined")
            {
                if (_this.schema.type === "array")
                {
                    _this.options.multiple = true;
                }
                else if (typeof(_this.schema["enum"]) != "undefined")
                {
                    _this.options.multiple = true;
                }
            }

            _this.checkboxOptions = [];
            if (_this.options.multiple)
            {
                $.each(_this.getEnum(), function(index, value) {

                    var text = value;

                    if (_this.options.optionLabels)
                    {
                        if (!Alpaca.isEmpty(_this.options.optionLabels[index]))
                        {
                            text = _this.options.optionLabels[index];
                        }
                        else if (!Alpaca.isEmpty(_this.options.optionLabels[value]))
                        {
                            text = _this.options.optionLabels[value];
                        }
                    }

                    _this.checkboxOptions.push({
                        "value": value,
                        "text": text
                    });
                });
            }
        },

        /**
         * Gets schema enum property.
         *
         * @returns {Array|String} Field schema enum property.
         */
        getEnum: function()
        {
            var array = [];

            if (this.schema && this.schema["enum"])
            {
                array = this.schema["enum"];
            }

            return array;
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

        prepareControlModel: function(callback)
        {
            var self = this;

            this.base(function(model) {
                model.checkboxOptions = self.checkboxOptions;

                callback(model);
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

                // whenever the state of one of our input:checkbox controls is changed (either via a click or programmatically),
                // we signal to the top-level field to fire up a change
                //
                // this allows the dependency system to recalculate and such
                //
                $(self.getFieldEl()).find("input:checkbox").change(function(evt) {
                    self.triggerWithPropagation("change");
                });

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

                callback();
            });
        },

        /**
         * @see Alpaca.Field#getValue
         */
        getValue: function()
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

            return Alpaca.anyEquality(val, self.schema["enum"]);
        },

        /**
         * @see Alpaca.Field#disable
         */
        disable: function()
        {
            $(this.control).find("input").each(function() {
                $(this).disabled = true;
            });

        },

        /**
         * @see Alpaca.Field#enable
         */
        enable: function()
        {
            $(this.control).find("input").each(function() {
                $(this).disabled = false;
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
                    }
                }
            });
        }

        /* end_builder_helpers */

    });

    Alpaca.registerFieldClass("checkbox", Alpaca.Fields.CheckBoxField);
    Alpaca.registerDefaultSchemaFieldMapping("boolean", "checkbox");

})(jQuery);
