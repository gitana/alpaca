(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TextField = Alpaca.ControlField.extend(
    /**
     * @lends Alpaca.Fields.TextField.prototype
     */
    {
        /**
         * @see Alpaca.ControlField#getFieldType
         */
        getFieldType: function()
        {
            return "text";
        },

        /**
         * @see Alpaca.Field#setup
         */
        setup: function()
        {
            this.base();

            /*
            if (!this.options.size) {
                this.options.size = 40;
            }
            */

            // assume html5 input type = "text"
            if (!this.inputType)
            {
                this.inputType = "text";
            }

            if (this.options.inputType)
            {
                this.inputType = this.options.inputType;
            }

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

            if (typeof(this.options.allowOptionalEmpty) === "undefined")
            {
                this.options.allowOptionalEmpty = true;
            }

            // DOM "autocomplete"
            if (this.options.autocomplete && typeof(this.options.autocomplete) === "string")
            {
                if (this.options.autocomplete.toLowerCase() === "on")
                {
                    this.options.autocomplete = true;
                }
                else if (this.options.autocomplete.toLowerCase() === "true")
                {
                    this.options.autocomplete = true;
                }
                else if (this.options.autocomplete.toLowerCase() === "yes")
                {
                    this.options.autocomplete = true;
                }
                else
                {
                    this.options.autocomplete = false;
                }
            }

            if (typeof(this.options.autocomplete) === "undefined")
            {
                this.options.autocomplete = false;
            }

            if (typeof(this.options.disallowEmptySpaces) === "undefined")
            {
                this.options.disallowEmptySpaces = false;
            }

            if (typeof(this.options.disallowOnlyEmptySpaces) === "undefined")
            {
                this.options.disallowOnlyEmptySpaces = false;
            }
        },

        /**
         * @see Alpaca.Field#destroy
         */
        destroy: function()
        {
            this.base();

            // clean up typeahead
            if ( this.control && this.control.typeahead && this.options.typeahead)
            {
                $(this.control).typeahead('destroy');
            }
        },

        /**
         * @see Alpaca.ControlField#postRender
         */
        postRender: function(callback) {

            var self = this;

            this.base(function() {

                if (self.control)
                {
                    // autocomplete
                    self.applyAutocomplete();

                    // mask
                    self.applyMask();

                    // typeahead
                    self.applyTypeAhead();

                    // update max length indicator
                    self.updateMaxLengthIndicator();
                }

                callback();
            });
        },

        applyAutocomplete: function()
        {
            var self = this;

            // autocomplete
            if (typeof(self.options.autocomplete) !== "undefined")
            {
                $(self.field).addClass("alpaca-autocomplete");
                $(self.control).attr("autocomplete", (self.options.autocomplete ? "on" : "off"));

                // CALLBACK: "autocomplete"
                self.fireCallback("autocomplete");
            }
        },

        applyMask: function()
        {
            var self = this;

            // mask it
            if (self.control.mask && self.options.maskString)
            {
                self.control.mask(self.options.maskString);
            }
        },

        applyTypeAhead: function()
        {
            var self = this;

            if (self.control.typeahead && self.options.typeahead && !Alpaca.isEmpty(self.options.typeahead))
            {
                var tConfig = self.options.typeahead.config;
                if (!tConfig) {
                    tConfig = {};
                }

                var tDatasets = self.options.typeahead.datasets;
                if (!tDatasets) {
                    tDatasets = {};
                }

                if (!tDatasets.name) {
                    tDatasets.name = self.getId();
                }

                var tEvents = self.options.typeahead.events;
                if (!tEvents) {
                    tEvents = {};
                }

                // support for each datasets (local, remote, prefetch)
                if (tDatasets.type === "local" || tDatasets.type === "remote" || tDatasets.type === "prefetch")
                {
                    var bloodHoundConfig = {
                        datumTokenizer: function(d) {
                            var tokens = "";
                            for (var k in d) {
                                if (d.hasOwnProperty(k) || d[k]) {
                                    tokens += " " + d[k];
                                }
                            }
                            return Bloodhound.tokenizers.whitespace(tokens);
                        },
                        queryTokenizer: Bloodhound.tokenizers.whitespace
                    };

                    if (tDatasets.type === "local" )
                    {
                        var local = [];

                        if (typeof(tDatasets.source) === "function")
                        {
                            bloodHoundConfig.local = tDatasets.source;
                        }
                        else
                        {
                            // array
                            for (var i = 0; i < tDatasets.source.length; i++)
                            {
                                var localElement = tDatasets.source[i];
                                if (typeof(localElement) === "string")
                                {
                                    localElement = {
                                        "value": localElement
                                    };
                                }

                                local.push(localElement);
                            }

                            bloodHoundConfig.local = local;
                        }

                        if (tDatasets.local)
                        {
                            bloodHoundConfig.local = tDatasets.local;
                        }
                    }

                    if (tDatasets.type === "prefetch")
                    {
                        bloodHoundConfig.prefetch = {
                            url: tDatasets.source
                        };

                        if (tDatasets.filter)
                        {
                            bloodHoundConfig.prefetch.filter = tDatasets.filter;
                        }
                    }

                    if (tDatasets.type === "remote")
                    {
                        bloodHoundConfig.remote = {
                            url: tDatasets.source
                        };

                        if (tDatasets.filter)
                        {
                            bloodHoundConfig.remote.filter = tDatasets.filter;
                        }

                        if (tDatasets.replace)
                        {
                            bloodHoundConfig.remote.replace = tDatasets.replace;
                        }
                    }

                    var engine = new Bloodhound(bloodHoundConfig);
                    engine.initialize();
                    tDatasets.source = engine.ttAdapter();
                }

                // compile templates
                if (tDatasets.templates)
                {
                    for (var k in tDatasets.templates)
                    {
                        var template = tDatasets.templates[k];
                        if (typeof(template) === "string")
                        {
                            tDatasets.templates[k] = Handlebars.compile(template);
                        }
                    }
                }

                // process typeahead
                $(self.control).typeahead(tConfig, tDatasets);

                // listen for "autocompleted" event and set the value of the field
                $(self.control).on("typeahead:autocompleted", function(event, datum) {
                    self.setValue(datum.value);
                    $(self.control).change();
                });

                // listen for "selected" event and set the value of the field
                $(self.control).on("typeahead:selected", function(event, datum) {
                    self.setValue(datum.value);
                    $(self.control).change();
                });

                // custom events
                if (tEvents)
                {
                    if (tEvents.autocompleted) {
                        $(self.control).on("typeahead:autocompleted", function(event, datum) {
                            tEvents.autocompleted(event, datum);
                        });
                    }
                    if (tEvents.selected) {
                        $(self.control).on("typeahead:selected", function(event, datum) {
                            tEvents.selected(event, datum);
                        });
                    }
                }

                // when the input value changes, change the query in typeahead
                // this is to keep the typeahead control sync'd with the actual dom value
                // only do this if the query doesn't already match
                var fi = $(self.control);
                $(self.control).change(function() {

                    var value = $(this).val();

                    var newValue = $(fi).typeahead('val');
                    if (newValue !== value)
                    {
                        $(fi).typeahead('val', newValue);
                    }

                });

                // some UI cleanup (we don't want typeahead to restyle)
                $(self.field).find("span.twitter-typeahead").first().css("display", "block"); // SPAN to behave more like DIV, next line
                $(self.field).find("span.twitter-typeahead input.tt-input").first().css("background-color", "");
            }
        },

        prepareControlModel: function(callback)
        {
            var self = this;

            this.base(function(model) {

                model.inputType = self.inputType;

                callback(model);
            });
        },

        updateMaxLengthIndicator: function()
        {
            var self = this;

            var errState = false;

            var message = "";
            if (!Alpaca.isEmpty(self.schema.maxLength) && self.options.showMaxLengthIndicator)
            {
                var val = self.getValue() || "";

                var diff = self.schema.maxLength - val.length;
                if (diff >= 0)
                {
                    message = "You have " + diff + " characters remaining";
                }
                else
                {
                    message = "Your message is too long by " + (diff*-1) + " characters";
                    errState = true;
                }

                var indicator = $(self.field).find(".alpaca-field-text-max-length-indicator");
                if (indicator.length === 0)
                {
                    indicator = $("<p class='alpaca-field-text-max-length-indicator'></p>");
                    $(self.control).after(indicator);
                }

                $(indicator).html(message);
                $(indicator).removeClass("err");
                if (errState)
                {
                    $(indicator).addClass("err");
                }
            }

        },

        /**
         * @see Alpaca.Fields.ControlField#getControlValue
         */
        getControlValue: function()
        {
            var self = this;

            var value = this._getControlVal(true);

            if (self.control.mask && self.options.maskString)
            {
                // get unmasked value
                var fn = $(this.control).data($.mask.dataName);
                if (fn)
                {
                    value = fn();
                    value = self.ensureProperType(value);
                }
            }

            return value;
        },

        /**
         * @see Alpaca.Field#setValue
         */
        setValue: function(value)
        {
            if (this.control && this.control.length > 0)
            {
                if (Alpaca.isEmpty(value))
                {
                    this.control.val("");
                }
                else
                {
                    this.control.val(value);
                }
            }

            // be sure to call into base method
            this.base(value);

            // if applicable, update the max length indicator
            this.updateMaxLengthIndicator();
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

                try {
                    var elemLen = el.value ? el.value.length : 0;
                    el.selectionStart = elemLen;
                    el.selectionEnd = elemLen;
                }
                catch (e) {
                    // field type doesn't support selection start and end
                }

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

            // if applicable, update the max length indicator
            self.updateMaxLengthIndicator();

            // trigger "fieldkeyup"
            $(this.field).trigger("fieldkeyup");
        }



        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Field#getTitle
         */
        getTitle: function() {
            return "Single-Line Text";
        },

        /**
         * @see Alpaca.Field#getDescription
         */
        getDescription: function() {
            return "Text field for single-line text.";
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
                    "size": {
                        "title": "Field Size",
                        "description": "Field size.",
                        "type": "number",
                        "default":40
                    },
                    "maskString": {
                        "title": "Mask Expression",
                        "description": "Expression for the field mask. Field masking will be enabled if not empty.",
                        "type": "string"
                    },
                    "placeholder": {
                        "title": "Field Placeholder",
                        "description": "Field placeholder.",
                        "type": "string"
                    },
                    "typeahead": {
                        "title": "Type Ahead",
                        "description": "Provides configuration for the $.typeahead plugin if it is available.  For full configuration options, see: https://github.com/twitter/typeahead.js"
                    },
                    "allowOptionalEmpty": {
                        "title": "Allow Optional Empty",
                        "description": "Allows this non-required field to validate when the value is empty"
                    },
                    "inputType": {
                        "title": "HTML5 Input Type",
                        "description": "Allows for the override of the underlying HTML5 input type.  If not specified, an assumed value is provided based on the kind of input control (i.e. 'text', 'date', 'email' and so forth)",
                        "type": "string"
                    },
                    "data": {
                        "title": "Data attributes for the underlying DOM input control",
                        "description": "Allows you to specify a key/value map of data attributes that will be added as DOM attribuets for the underlying input control.  The data attributes will be added as data-{name}='{value}'.",
                        "type": "object"
                    },
                    "autocomplete": {
                        "title": "HTML autocomplete attribute for the underlying DOM input control",
                        "description": "Allows you to specify the autocomplete attribute for the underlying input control whether or not field should have autocomplete enabled.",
                        "type": "string"
                    },
                    "disallowEmptySpaces": {
                        "title": "Disallow Empty Spaces",
                        "description": "Whether to disallow the entry of empty spaces in the text",
                        "type": "boolean",
                        "default": false
                    },
                    "disallowOnlyEmptySpaces": {
                        "title": "Disallow Only Empty Spaces",
                        "description": "Whether to disallow the entry of only empty spaces in the text",
                        "type": "boolean",
                        "default": false
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
                    "size": {
                        "type": "integer"
                    },
                    "maskString": {
                        "helper": "a - an alpha character;9 - a numeric character;* - an alphanumeric character",
                        "type": "text"
                    },
                    "typeahead": {
                        "type": "object"
                    },
                    "allowOptionalEmpty": {
                        "type": "checkbox"
                    },
                    "inputType": {
                        "type": "text"
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
    Alpaca.registerFieldClass("text", Alpaca.Fields.TextField);
    Alpaca.registerDefaultSchemaFieldMapping("string", "text");

})(jQuery);
