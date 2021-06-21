(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.ContentEditableField = Alpaca.ControlField.extend(
    /**
     * @lends Alpaca.Fields.ContentEditableField.prototype
     */
    {
        /**
         * @see Alpaca.ControlField#getFieldType
         */
        getFieldType: function()
        {
            return "contenteditable";
        },

        /**
         * @see Alpaca.Field#setup
         */
        setup: function()
        {
            this.base();

            // DOM data-* attributes support
            if (!this.options.data)
            {
                this.options.data = {};
            }

            // DOM * attributes support
            if (!this.options.attributes)
            {
                this.options.attributes = {};
            }
        },

        /**
         * @see Alpaca.Field#destroy
         */
        destroy: function()
        {
            this.base();
        },

        /**
         * @see Alpaca.ControlField#postRender
         */
        postRender: function(callback) {

            var self = this;

            this.base(function() {

                if (self.control)
                {
                    // // autocomplete
                    // self.applyAutocomplete();
                    //
                    // // mask
                    // self.applyMask();
                    //
                    // // typeahead
                    // self.applyTypeAhead();
                    //
                    // // update max length indicator
                    // self.updateMaxLengthIndicator();
                }

                callback();
            });
        },

        prepareControlModel: function(callback)
        {
            var self = this;

            this.base(function(model) {

                callback(model);
            });
        },

        /**
         * @see Alpaca.Fields.ControlField#getControlValue
         */
        getControlValue: function()
        {
            var self = this;

            var value = this.control.html();

            return value;
        },

        getValue: function()
        {
            var self = this;

            var value = this.base();

            return value;
        },

        /**
         * @see Alpaca.Field#setValue
         */
        setValue: function(value)
        {
            // be sure to call into base method
            this.base(value);

            this.control.html(value);
        },

        /**
         * @see Alpaca.ControlField#handleValidate
         */
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status =  this._validatePattern();
            valInfo["invalidPattern"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("invalidPattern"), [this.schema.pattern]),
                "status": status
            };

            status = this._validateMaxLength();
            valInfo["stringTooLong"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("stringTooLong"), [this.schema.maxLength]),
                "status": status
            };

            status = this._validateMinLength();
            valInfo["stringTooShort"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("stringTooShort"), [this.schema.minLength]),
                "status": status
            };

            return baseStatus && valInfo["invalidPattern"]["status"] && valInfo["stringTooLong"]["status"] && valInfo["stringTooShort"]["status"];
        },

        /**
         * Validates against the schema pattern property.
         *
         * @returns {Boolean} True if it matches the pattern, false otherwise.
         */
        _validatePattern: function()
        {
            if (this.schema.pattern)
            {
                var val = this.getValue();

                if (val === "" && this.options.allowOptionalEmpty && !this.isRequired())
                {
                    return true;
                }

                if (Alpaca.isEmpty(val))
                {
                    val = "";
                }

                if (typeof(val) === "string")
                {
                    if (!val.match(this.schema.pattern))
                    {
                        return false;
                    }
                }
            }

            return true;
        },

        /**
         * Validates against the schema minLength property.
         *
         * @returns {Boolean} True if its size is greater than minLength, false otherwise.
         */
        _validateMinLength: function()
        {
            if (!Alpaca.isEmpty(this.schema.minLength))
            {
                var val = this.getValue();
                if(val !== val) {
                    // NaN
                    val = "";
                }
                if (val === "" && this.options.allowOptionalEmpty && !this.isRequired())
                {
                    return true;
                }
                if (Alpaca.isEmpty(val))
                {
                    val = "";
                }
                if ((""+val).length < this.schema.minLength)
                {
                    return false;
                }
            }
            return true;
        },

        /**
         * Validates against the schema maxLength property.
         *
         * @returns {Boolean} True if its size is less than maxLength , false otherwise.
         */
        _validateMaxLength: function()
        {
            if (!Alpaca.isEmpty(this.schema.maxLength))
            {
                var val = this.getValue();
                if (val === "" && this.options.allowOptionalEmpty && !this.isRequired())
                {
                    return true;
                }
                if (Alpaca.isEmpty(val))
                {
                    val = "";
                }
                if ((""+val).length > this.schema.maxLength)
                {
                    return false;
                }
            }
            return true;
        },

        /**
         * @see Alpaca.Field#focus
         */
        focus: function(onFocusCallback)
        {
            if (this.control && this.control.length > 0)
            {
                // focuses the control and also positions the input at the end

                var el = $(this.control).get(0);
                el.focus();

                if (onFocusCallback)
                {
                    onFocusCallback(this);
                }

            }
        },

        /**
         * @see Alpaca.Field#getType
         */
        getType: function() {
            return "string";
        },

        /**
         * @see Alpaca.ControlField#onKeyPress
         */
        onKeyPress: function(e)
        {
            var self = this;

            // ignore tab and arrow keys
            if (e.keyCode === 9 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 ) {
                return;
            }

            if (e.keyCode === 8) // backspace
            {
                if (!Alpaca.isEmpty(self.schema.minLength) && (self.options.constrainLengths || self.options.constrainMinLength))
                {
                    var newValue = self.getValue() || "";
                    if (newValue.length <= self.schema.minLength)
                    {
                        // kill event
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                }
            }
            else
            {
                if (!Alpaca.isEmpty(self.schema.maxLength) && (self.options.constrainLengths || self.options.constrainMaxLength))
                {
                    var newValue = self.getValue() || "";
                    if (newValue.length >= self.schema.maxLength)
                    {
                        // kill event
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                }
            }

            if (e.keyCode === 32) // space
            {
                if (self.options.disallowEmptySpaces)
                {
                    // kill event
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            }
        },

        onKeyUp: function(e)
        {
            var self = this;

            /*
            // if applicable, update the max length indicator
            self.updateMaxLengthIndicator();

            // trigger "fieldkeyup"
            $(this.field).trigger("fieldkeyup");

            // adjust value on the fly?
            var adjust = false;
            if (self.schema.format === "uppercase")
            {
                adjust = true;
            }
            else if (self.schema.format === "lowercase")
            {
                adjust = true;
            }
            if (self.options.trim)
            {
                adjust = true;
            }
            if (adjust) {
                var v = self.getValue();
                self.setValue(v);
            }
            */
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Field#getTitle
         */
        getTitle: function() {
            return "Content Editable Block";
        },

        /**
         * @see Alpaca.Field#getDescription
         */
        getDescription: function() {
            return "Content Editable Block";
        },

        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "minLength": {
                        "title": "Minimal Length",
                        "description": "Minimal length of the property value.",
                        "type": "number"
                    },
                    "maxLength": {
                        "title": "Maximum Length",
                        "description": "Maximum length of the property value.",
                        "type": "number"
                    },
                    "pattern": {
                        "title": "Pattern",
                        "description": "Regular expression for the property value.",
                        "type": "string"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ControlField#getOptionsForSchema
         */
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "default": {
                        "helper": "Field default value",
                        "type": "text"
                    },
                    "minLength": {
                        "type": "integer"
                    },
                    "maxLength": {
                        "type": "integer"
                    },
                    "pattern": {
                        "type": "text"
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
                    "allowOptionalEmpty": {
                        "title": "Allow Optional Empty",
                        "description": "Allows this non-required field to validate when the value is empty"
                    },
                    "data": {
                        "title": "Data attributes for the underlying DOM input control",
                        "description": "Allows you to specify a key/value map of data attributes that will be added as DOM attribuets for the underlying input control.  The data attributes will be added as data-{name}='{value}'.",
                        "type": "object"
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
                    "allowOptionalEmpty": {
                        "type": "checkbox"
                    },
                    "data": {
                        "type": "object"
                    }
                }
            });
        }

        /* end_builder_helpers */

    });

    Alpaca.registerMessages({
        "invalidPattern": "This field should have pattern {0}",
        "stringTooShort": "This field should contain at least {0} numbers or characters",
        "stringTooLong": "This field should contain at most {0} numbers or characters"
    });
    Alpaca.registerFieldClass("contenteditable", Alpaca.Fields.ContentEditableField);

})(jQuery);
