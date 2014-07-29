(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.CheckBoxField = Alpaca.ControlField.extend(
        /**
         * @lends Alpaca.Fields.CheckBoxField.prototype
         */
        {
            /**
             * @constructs
             * @augments Alpaca.ControlField
             *
             * @class Checkbox control for JSON schema boolean type.
             *
             * @param {Object} container Field container.
             * @param {Any} data Field data.
             * @param {Object} options Field options.
             * @param {Object} schema Field schema.
             * @param {Object|String} view Field view.
             * @param {Alpaca.Connector} connector Field connector.
             * @param {Function} errorCallback Error callback.
             */
            constructor: function(container, data, options, schema, view, connector, errorCallback) {
                this.base(container, data, options, schema, view, connector, errorCallback);
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
                    if (_this.schema.type == "array")
                    {
                        _this.options.multiple = true;
                    }
                    else if (typeof(_this.schema["enum"]) != "undefined" || 
			     (typeof(_this.schema.items) != "undefined" &&
                             typeof(_this.schema.items["enum"]) != "undefined"))
                    {
                        _this.options.multiple = true;
                    }
                }

                _this.checkboxOptions = [];
                if (_this.options.multiple)
                {
                    $.each(_this.getEnum(), function(index, value) {

                        var text = value;

                        if (_this.options.fields && _this.options.fields.item && _this.options.fields.item.optionsLabels)
                        {
                            if (!Alpaca.isEmpty(_this.options.fields.item.optionsLabels[index]))
                            {
                                text = _this.options.fields.item.optionsLabels[index];
                            }
                            else if (!Alpaca.isEmpty(_this.options.fields.item.optionsLabels[value]))
                            {
                                text = _this.options.fields.item.optionsLabels[value];
                            }
                        }else if (_this.options.optionLabels)
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

		//look for enum as per typical JSON schema specifications
                if (this.schema && this.schema.items && this.schema.items["enum"])
                {
                    array = this.schema.items["enum"];
                }else if(this.schema && this.schema["enum"]){
		//the simplified aplaca way
                    array = this.schema["enum"];			
		}

                return array;
            },

            /**
             * Handler for the event that the checkbox is clicked.
             *
             * @param e Event.
             */
            onClick: function(e) {
                this.refreshValidationState();
            },

            /**
             * @see Alpaca.ControlField#renderField
             */
            renderField: function(onSuccess) {

                var _this = this;

                var controlFieldTemplateDescriptor = null;

                // either use the single template or the multiple template
                if (this.options.multiple) {
                    controlFieldTemplateDescriptor = this.view.getTemplateDescriptor("controlFieldCheckboxMultiple");
                } else {
                    controlFieldTemplateDescriptor = this.view.getTemplateDescriptor("controlFieldCheckbox");
                }

                if (controlFieldTemplateDescriptor)
                {
                    this.field = _this.view.tmpl(controlFieldTemplateDescriptor, {
                        "id": this.getId(),
                        "name": this.name,
                        "options": this.options,
                        "checkboxOptions": _this.checkboxOptions
                    });
                    this.injectField(this.field);
                    //this.field = $('input[id="' + this.getId() + '"]', this.field);

                    // do this little trick so that if we have a default value, it gets set during first render
                    // this causes the checked state of the control to update
                    if (this.data && typeof(this.data) != "undefined")
                    {
                        this.setValue(this.data);
                    }
                }

                if (onSuccess) {
                    onSuccess();
                }
            },

            /**
             * @see Alpaca.ControlField#postRender
             */
            postRender: function(callback) {

                var self = this;

                this.base(function() {

                    if (self.fieldContainer) {
                        self.fieldContainer.addClass('alpaca-controlfield-checkbox');
                    }

                    // whenever the state of one of our input:checkbox controls is changed (either via a click or programmatically),
                    // we signal to the top-level field to fire up a change
                    //
                    // this allows the dependency system to recalculate and such
                    //
                    $(self.field).find("input:checkbox").change(function(evt) {
                        $(self.field).trigger("change");
                    });

                    callback();
                });
            },

            /**
             * @see Alpaca.Field#getValue
             */
            getValue: function() {

                var self = this;

                var value = null;

                if (!self.options.multiple)
                {
                    // single scalar value
                    var input = $(self.field).find("input");
                    if (input.length > 0)
                    {
                        value = Alpaca.checked($(input[0]));
                    }
                }
                else
                {
                    // multiple values
                    var values = [];
                    for (var i = 0; i < self.checkboxOptions.length; i++)
                    {
                        var input = $(self.field).find("input[data-checkbox-index='" + i + "']");
                        if (Alpaca.checked(input))
                        {
                            var v = $(input).attr("data-checkbox-value");
                            values.push(v);
                        }
                    }

                    // determine how we're going to hand this value back

                    // if type == "array", we just hand back the array
                    // if type == "string", we build a comma-delimited list
                    if (self.schema.type == "array")
                    {
                        value = values;
                    }
                    else if (self.schema.type == "string")
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

                    var input = $(self.field).find("input");
                    if (input.length > 0)
                    {
                        Alpaca.checked($(input[0]), value);
                    }
                };

                var applyMultiValue = function(values)
                {
                    // allow for comma-delimited strings
                    if (typeof(values) == "string")
                    {
                        values = values.split(",");
                    }

                    // trim things to remove any excess white space
                    for (var i = 0; i < values.length; i++)
                    {
                        values[i] = Alpaca.trim(values[i]);
                    }

                    // walk through values and assign into appropriate inputs
                    for (var i = 0; i < values.length; i++)
                    {
                        var input = $(self.field).find("input[data-checkbox-value='" + values[i] + "']");
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
                    if (typeof(value) == "boolean")
                    {
                        applyScalarValue(value);
                        applied = true;
                    }
                    else if (typeof(value) == "string")
                    {
                        applyScalarValue(value);
                        applied = true;
                    }
                }
                else
                {
                    // multiple value mode

                    if (typeof(value) == "string")
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

                if (!applied)
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
                if (!self.schema.required && Alpaca.isValEmpty(val))
                {
                    return true;
                }

                // if val is a string, convert to array
                if (typeof(val) == "string")
                {
                    val = val.split(",");
                }
		
                return Alpaca.anyEquality(val, self.getEnum());
            },

            /**
             * @see Alpaca.Field#disable
             */
            disable: function() {

                $(this.field).find("input").each(function() {
                    $(this).disabled = true;
                });

            },

            /**
             * @see Alpaca.Field#enable
             */
            enable: function() {

                $(this.field).find("input").each(function() {
                    $(this).disabled = false;
                });

            },//__BUILDER_HELPERS

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
            },

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
             * @see Alpaca.Field#getType
             */
            getType: function() {
                return "boolean";
            },

            /**
             * @see Alpaca.Field#getFieldType
             */
            getFieldType: function() {
                return "checkbox";
            }//__END_OF_BUILDER_HELPERS

        });

    Alpaca.registerTemplate("controlFieldCheckbox", '<span id="${id}">{{if options.rightLabel}}<label class="alpaca-controlfield-label" for="${id}_checkbox">{{/if}}<input id="${id}_checkbox" type="checkbox" {{if options.readonly}}readonly="readonly"{{/if}} {{if name}}name="${name}"{{/if}} {{each(i,v) options.data}}data-${i}="${v}"{{/each}}/>{{if options.rightLabel}}${options.rightLabel}</label>{{/if}}</span>');
    Alpaca.registerTemplate("controlFieldCheckboxMultiple", '<span id="${id}">{{each(i,o) checkboxOptions}}<span><label class="alpaca-controlfield-label" for="${id}_checkbox_${i}"><input type="checkbox" id="${id}_checkbox_${i}" {{if options.readonly}}readonly="readonly"{{/if}} {{if name}}name="${name}"{{/if}} data-checkbox-value="${o.value}" data-checkbox-index="${i}" />${text}</label></span>{{/each}}</span>');

    Alpaca.registerFieldClass("checkbox", Alpaca.Fields.CheckBoxField);
    Alpaca.registerDefaultSchemaFieldMapping("boolean", "checkbox");
})(jQuery);
