(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.ListField = Alpaca.ControlField.extend(
    /**
     * @lends Alpaca.Fields.ListField.prototype
     */
    {
        /**
         * @see Alpaca.Field#setup
         */
        setup: function()
        {
            var self = this;

            self.base();

            self.selectOptions = [];

            if (self.getEnum())
            {
                // sort the enumerated values
                self.sortEnum();

                var optionLabels = self.getOptionLabels();

                $.each(self.getEnum(), function(index, value)
                {
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

                    self.selectOptions.push({
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

            if (typeof(self.options.multiple) === "undefined")
            {
                if (self.schema["type"] && self.schema["type"] === "array")
                {
                    self.options.multiple = true;
                }
                else
                {
                    self.options.multiple = false;
                }
            }

            // make sure we convert any incoming data to our expected format
            self.setValue(this.data, true);
        },

        prepareControlModel: function(callback)
        {
            var self = this;

            this.base(function(model) {

                model.selectOptions = self.selectOptions;

                callback(model);
            });
        },

        populateDisplayableText: function(model)
        {
            var self = this;

            // build out "displayableText"
            var displayableTexts = [];
            var map = {};
            for (var i = 0; i < model.selectOptions.length; i++)
            {
                map[model.selectOptions[i].value] = model.selectOptions[i].text;
            }

            if (self.schema.type === "boolean")
            {
                displayableTexts.push("" + (model.data.length > 0));
            }
            else if (Alpaca.isArray(model.data))
            {
                for (var i = 0; i < model.data.length; i++)
                {
                    var text = map[model.data[i].value];
                    if (text)
                    {
                        displayableTexts.push(text);
                    }
                }
            }
            else
            {
                var text = map[model.data.value];
                if (text)
                {
                    displayableTexts.push(text);
                }
            }
            
            model.displayableText = displayableTexts.join(", ");
        },

        /**
         * @see Alpaca.ControlField#beforeRenderControl
         */
        beforeRenderControl: function(model, callback)
        {
            var self = this;

            var completionFn = function()
            {
                for (var i = 0; i < self.selectOptions.length; i++)
                {
                    for (var j = 0; j < self.data.length; j++)
                    {
                        if (self.data[j].value === self.selectOptions[i].value)
                        {
                            self.selectOptions[i].selected = true;
                        }
                    }
                }

                // if emptySelectFirst and we have options but no data, then auto-select first item in the options list
                if (self.data.length === 0 && self.options.emptySelectFirst && self.selectOptions.length > 0)
                {
                    self.selectOptions[0].selected = true;
                    self.data = [self.selectOptions[0]];
                }

                // likewise, we auto-assign first pick if field required
                if (self.data.length === 0 && self.isRequired() && self.selectOptions.length > 0)
                {
                    self.selectOptions[0].selected = true;
                    self.data = [self.selectOptions[0]];
                }

                callback();
            };

            this.base(model, function() {

                self.populateDisplayableText(model);

                if (self.options.dataSource)
                {
                    // clear the array
                    self.selectOptions.length = 0;

                    self.invokeDataSource(self.selectOptions, model, function() {

                        if (self.options.useDataSourceAsEnum)
                        {
                            // now build out the enum and optionLabels
                            var _enum = [];
                            var _optionLabels = [];
                            for (var i = 0; i < self.selectOptions.length; i++)
                            {
                                _enum.push(self.selectOptions[i].value);
                                _optionLabels.push(self.selectOptions[i].text);
                            }

                            self.setEnum(_enum);
                            self.setOptionLabels(_optionLabels);
                        }

                        completionFn();

                    });
                }
                else
                {
                    completionFn();
                }

            });
        },

        convertDataExternalToInternal: function(external)
        {
            var convertedValue = {};

            if (external.value) {
                convertedValue.value = external.value;
            } else if (external.id) {
                convertedValue.value = external.id;
            } else if (external.val) {
                convertedValue.value = external.val;
            } else if (external.v) {
                convertedValue.value = external.v;
            } else if (external.key) {
                convertedValue.value = external.key;
            }

            if (external.text) {
                convertedValue.text = external.text;
            } else if (external.title) {
                convertedValue.text = external.title;
            } else if (external.label) {
                convertedValue.text = external.label;
            }

            return convertedValue;
        },

        convertDataInternalToExternal: function(internal)
        {
            return {
                "value": internal.value,
                "text": internal.text
            };
        },

        // @Override
        bindData: function()
        {
        },

        /**
         * Retrieves the value of the control and formats it to the expected output/external format.
         *
         * @returns {*}
         */
        getValue: function()
        {
            var self = this;

            // for legacy support, in case data was set to null, set back to []
            if (this.data === null || typeof(this.data) === "undefined") {
                this.data = [];
            }

            var val = null;

            if (!self.schema.type || self.schema.type === "string")
            {
                var array = [];
                for (var i = 0; i < this.data.length; i++) {
                    array.push(this.data[i].value);
                }
                
                // Use custom join function if provided
                if (self.options.join && Alpaca.isFunction(self.options.join))
                {
                    val = self.options.join(array);
                }
                else
                {
                    val = array.join(",");
                }
            }
            else if (self.schema.type === "number")
            {
                if (this.data.length > 0)
                {
                    val = this.data[0].value;
                }
            }
            else if (self.schema.type === "boolean")
            {
                val = (this.data.length > 0);
            }
            else if (self.schema.type === "array")
            {
                var values = [];
                for (var i = 0; i < this.data.length; i++)
                {
                    if (self.schema.items && self.schema.items.type === "string")
                    {
                        values.push(this.data[i].value);
                    }
                    else
                    {
                        values.push(self.convertDataInternalToExternal(this.data[i]));
                    }
                }

                val = values;
            }
            else if (self.schema.type === "object")
            {
                if (this.data.length > 0)
                {
                    val = self.convertDataInternalToExternal(this.data[0]);
                }
            }

            return val;
        },

        /**
         * Converts the externally formatted data to an internal format and sets it onto the control.
         *
         * The external data nominally comes in as:
         *
         *    A comma-delimitted string
         *    An array of strings
         *    An array of objects
         *
         * In the latter case, the objects nominally look like:
         *
         *      [{
         *          "text": "",
         *          "value": ""
         *      }]
         *
         * But may also have other structures, such as this one which Cloud CMS uses:
         *
         *      [{
         *          "id": "",
         *          "ref": "",
         *          "title": "",
         *          ... other properties
         *      }]
         *
         * These are all converted the internal format, which looks like:
         *
         *      [{
         *          "text": "",
         *          "value": "">
         *      }]
         *
         * @param val
         * @param silent whether to refresh UI controls (defaults to false)
         *
         * @returns {*}
         */
        setValue: function(val, silent)
        {
            var self = this;

            var values = [];

            var handled = false;
            if (Alpaca.isEmpty(val) || val === "")
            {
                handled = true;
            }
            else if (Alpaca.isString(val))
            {
                if (self.options.multiple)
                {
                    // Use custom split function, if defined
                    if (self.options.split && Alpaca.isFunction(self.options.split))
                    {
                        values = self.options.split(val);
                    }
                    else
                    {
                        values = val.split(",");
                    }

                    for (var i = 0; i < values.length; i++)
                    {
                        values[i] = values[i].trim();
                        values[i] = {
                            "text": values[i],
                            "value": values[i]
                        };
                    }
                }
                else
                {
                    values.push({
                        "text": val,
                        "value": val
                    });
                }

                handled = true;
            }
            else if (Alpaca.isBoolean(val))
            {
                if (val)
                {
                    values.push({
                        "text": "",
                        "value": true
                    });
                }

                handled = true;
            }
            else if (Alpaca.isNumber(val))
            {
                values.push({
                    "text": "" + val,
                    "value": val
                });

                handled = true;
            }
            else if (Alpaca.isArray(val))
            {
                for (var i = 0; i < val.length; i++)
                {
                    if (Alpaca.isString(val[i])) {
                        values.push({
                            "text": "" + val[i],
                            "value": val[i]
                        });
                    } else if (Alpaca.isNumber(val[i])) {
                        values.push({
                            "text": "" + val[i],
                            "value": val[i]
                        });
                    } else {
                        values.push(self.convertDataExternalToInternal(val[i]));
                    }
                }

                handled = true;
            }
            else if (Alpaca.isObject(val))
            {
                values.push(self.convertDataExternalToInternal(val));

                handled = true;
            }

            if (!handled)
            {
                throw new Error("could not import data: " + val);
            }

            this.data = values;

            if (!silent)
            {
                self.afterSetValue();
            }
        },

        afterSetValue: function()
        {

        },

        /**
         * Finds if the value of this field is empty.
         *
         * @return {Boolean} True if the field value is empty, false otherwise.
         */
        isEmpty: function()
        {
            return this.data.length === 0;
        },

        /**
         * Validate against enum property.
         *
         * @returns {Boolean} True if the element value is part of the enum list, false otherwise.
         */
        _validateEnum: function()
        {
            var self = this;

            var _enum = self.getEnum();
            if (!_enum)
            {
                return true;
            }

            if (!this.isRequired() && self.data.length === 0)
            {
                return true;
            }

            var isValid = true;

            for (var i = 0; i < self.data.length; i++)
            {
                var inArray = Alpaca.inArray(_enum, self.data[i].value);
                if (!inArray)
                {
                    isValid = false;
                    break;
                }
            }

            return isValid;
        },

        /**
         * Validates if number of items has been less than minItems.
         * @returns {Boolean} true if number of items has been less than minItems
         */
        _validateMinItems: function()
        {
            if (this.schema.minItems && this.schema.minItems >= 0)
            {
                if (this.data.length < this.schema.minItems)
                {
                    return false;
                }
            }

            return true;
        },

        /**
         * Validates if number of items has been over maxItems.
         * @returns {Boolean} true if number of items has been over maxItems
         */
        _validateMaxItems: function()
        {
            if (this.schema.maxItems && this.schema.maxItems >= 0)
            {
                if (this.data.length > this.schema.maxItems)
                {
                    return false;
                }
            }

            return true;
        },

        /**
         * @see Alpaca.ContainerField#handleValidate
         */
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateMaxItems();
            valInfo["tooManyItems"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("tooManyItems"), [this.schema.maxItems]),
                "status": status
            };

            status = this._validateMinItems();
            valInfo["notEnoughItems"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("notEnoughItems"), [this.schema.minItems]),
                "status": status
            };

            return baseStatus && valInfo["tooManyItems"]["status"] && valInfo["notEnoughItems"]["status"];
        }



        /* builder_helpers */
        ,

        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "enum": {
                        "title": "Enumeration",
                        "description": "List of field value options",
                        "type": "array",
                        "required": true
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "dataSource": {
                        "title": "Option Datasource",
                        "description": "Datasource for generating list of options.  This can be a string or a function.  If a string, it is considered S be a URI to a service that produces a object containing key/value pairs or an array of elements of structure {'text': '', 'value': ''}.  This can also be a function that is called to produce the same list.",
                        "type": "string"
                    },
                    "removeDefaultNone": {
                        "title": "Remove Default None",
                        "description": "If true, the default 'None' option will not be shown.",
                        "type": "boolean",
                        "default": false
                    },
                    "noneLabel": {
                        "title": "None Label",
                        "description": "The label to use for the 'None' option in a list (select, radio or otherwise).",
                        "type": "string",
                        "default": "None"
                    },
                    "hideNone": {
                        "title": "Hide None",
                        "description": "Whether to hide the None option from a list (select, radio or otherwise).  This will be true if the field is required and false otherwise.",
                        "type": "boolean",
                        "default": false
                    },
                    "useDataSourceAsEnum": {
                        "title": "Use Data Source as Enumerated Values",
                        "description": "Whether to constrain the field's schema enum property to the values that come back from the data source.",
                        "type": "boolean",
                        "default": true
                    },
                    "split": {
                        "title": "Split Function",
                        "type": "function",
                        "description": "For multiple select lists. Defines a f(a) for how data strings should be split into individual values. A join function should also be defined which reverses this function."
                    },
                    "join": {
                        "title": "Join Function",
                        "type": "function",
                        "description": "For multiple select lists. Defines a f(a) for how selected options should be combined into a single string. A split function should also be defined which reverses this function."
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
                    "dataSource": {
                        "type": "text"
                    },
                    "removeDefaultNone": {
                        "type": "checkbox",
                        "rightLabel": "Remove Default None"
                    },
                    "noneLabel": {
                        "type": "text"
                    },
                    "hideNone": {
                        "type": "checkbox",
                        "rightLabel": "Hide the 'None' option from the list"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    // Registers additional messages
    Alpaca.registerMessages({
        "noneLabel": "None"
    });

})(jQuery);
