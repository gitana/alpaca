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

            if (self.schema["type"] && self.schema["type"] === "array")
            {
                self.options.multiple = true;
            }

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
        },

        getValue: function()
        {
            var self = this;

            if (self.schema.type === "object")
            {
                return this.data;
            }

            return this.base();
        },


        /**
         * @see Alpaca.Field#setValue
         */
        setValue: function(val)
        {
            var self = this;

            var newScalarVal = self.convertToScalarValue(val);
            var currentScalarVal = self.convertToScalarValue(self.getValue());

            if (Alpaca.isArray(val))
            {
                // if values are different, then set
                if (!Alpaca.compareArrayContent(newScalarVal, currentScalarVal))
                {
                    if (!Alpaca.isEmpty(newScalarVal) && this.control)
                    {
                        this.control.val(newScalarVal);
                    }

                    this.base(val);
                }
            }
            else
            {
                var apply = false;
                if (Alpaca.isEmpty(newScalarVal) && Alpaca.isEmpty(currentScalarVal))
                {
                    apply = true;
                }
                else if (newScalarVal !== currentScalarVal)
                {
                    apply = true;
                }

                if (apply)
                {
                    if (self.control && typeof(newScalarVal) !== "undefined" && newScalarVal !== null)
                    {
                        self.control.val(newScalarVal);
                    }

                    this.base(val);
                }
            }
        },

        /**
         * @see Alpaca.ListField#getEnum
         */
        getEnum: function()
        {
            if (this.schema)
            {
                if (this.schema["enum"])
                {
                    return this.schema["enum"];
                }
                else if (this.schema["type"] && this.schema["type"] === "array" && this.schema["items"] && this.schema["items"]["enum"])
                {
                    return this.schema["items"]["enum"];
                }
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

                model.selectOptions = self.selectOptions;

                callback(model);
            });
        },

        beforeRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                // build out "displayableText"
                var displayableTexts = [];
                var map = {};
                for (var i = 0; i < model.selectOptions.length; i++)
                {
                    map[model.selectOptions[i].value] = model.selectOptions[i].text;
                }

                if (Alpaca.isArray(model.data))
                {
                    for (var i = 0; i < model.data.length; i++)
                    {
                        var text = map[model.data[i]];
                        if (text)
                        {
                            displayableTexts.push(text);
                        }
                    }
                }
                else
                {
                    var text = map[model.data];
                    if (text)
                    {
                        displayableTexts.push(text);
                    }
                }

                model.displayableText = displayableTexts.join(", ");

                callback();

            });
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                // if emptySelectFirst and nothing currently checked, then pick first item in the value list
                // set data and visually select it
                if (Alpaca.isUndefined(self.data) && self.options.emptySelectFirst && self.selectOptions && self.selectOptions.length > 0)
                {
                    self.data = self.selectOptions[0].value;
                }

                // do this little trick so that if we have a default value, it gets set during first render
                // this causes the state of the control
                if (self.data)
                {
                    self.setValue(self.data);
                }

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

                callback();

            });
        },

        /**
         * Validate against enum property.
         *
         * @returns {Boolean} True if the element value is part of the enum list, false otherwise.
         */
        _validateEnum: function()
        {
            var _this = this;

            if (this.schema["enum"])
            {
                var val = this.data;

                if (!this.isRequired() && Alpaca.isValEmpty(val))
                {
                    return true;
                }

                if (this.options.multiple)
                {
                    var isValid = true;

                    if (!val)
                    {
                        val = [];
                    }

                    if (!Alpaca.isArray(val) && !Alpaca.isObject(val))
                    {
                        val = [val];
                    }

                    $.each(val, function(i,v) {

                        var scalarValue = _this.convertToScalarValue(v);

                        var inArray = Alpaca.inArray(_this.schema["enum"], scalarValue);
                        if (!inArray)
                        {
                            isValid = false;
                        }

                    });

                    return isValid;
                }
                else
                {
                    // in case we're an array modeled on a single select, just use the 0th element
                    if (Alpaca.isArray(val)) {
                        val = val[0];
                    }

                    var scalarValue = _this.convertToScalarValue(val);

                    return Alpaca.inArray(this.schema["enum"], scalarValue);
                }
            }
            else
            {
                return true;
            }
        },

        /**
         * @see Alpaca.Field#onChange
         */
        onChange: function(e) {

            var self = this;

            var scalarValue = self.getControlValue();

            self.convertToDataValue(scalarValue, function(err, data) {

                // store back into data element
                self.data = data;

                // store scalar value onto control
                self.control.val(scalarValue);

                // trigger observables and updates
                self.updateObservable();
                self.triggerUpdate();
                self.refreshValidationState();

            });
        },

        /**
         * Validates if number of items has been less than minItems.
         * @returns {Boolean} true if number of items has been less than minItems
         */
        _validateMinItems: function()
        {
            if (this.schema.minItems && this.schema.minItems >= 0)
            {
                if ($(":selected",this.control).length < this.schema.minItems)
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
                if ($(":selected",this.control).length > this.schema.maxItems)
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
                        "title": "Mulitple Selection",
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
