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

            /**
             * Auto assign data if we have data and the field is required and removeDefaultNone is either unspecified or true
             */
            if (self.isRequired() && !self.data)
            {
                if ((self.options.removeDefaultNone === true))
                {
                    var enumValues = self.getEnum();
                    if (enumValues && enumValues.length > 0)
                    {
                        self.data = enumValues[0];
                    }
                }
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
        },

        prepareControlModel: function(callback)
        {
            var self = this;

            this.base(function(model) {

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

        /**
         * @see Alpaca.Field#getValue
         */
        convertValue: function(val)
        {
            var _this = this;

            if (Alpaca.isArray(val))
            {
                $.each(val, function(index, itemVal) {
                    $.each(_this.selectOptions, function(index2, selectOption) {

                        if (selectOption.value === itemVal)
                        {
                            val[index] = selectOption.value;
                        }

                    });
                });
            }
            else
            {
                $.each(this.selectOptions, function(index, selectOption) {

                    if (selectOption.value === val)
                    {
                        val = selectOption.value;
                    }

                });
            }
            return val;
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

                        callback();

                    });
                }
                else
                {
                    callback();
                }

            });
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
                        "description": "Datasource for generating list of options.  This can be a string or a function.  If a string, it is considered to be a URI to a service that produces a object containing key/value pairs or an array of elements of structure {'text': '', 'value': ''}.  This can also be a function that is called to produce the same list.",
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
