(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TextField = Alpaca.ControlField.extend(
    /**
     * @lends Alpaca.Fields.TextField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.ControlField
         *
         * @class Basic control for general text.
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
            this.base();
            
            if (!this.options.size) {
                this.options.size = 40;
            }

            this.controlFieldTemplateDescriptor = this.view.getTemplateDescriptor("controlFieldText");
        },

        /**
         * @see Alpaca.Field#destroy
         */
        destroy: function() {

            this.base();

            // clean up typeahead
            if ( this.field && this.field.typeahead && this.options.typeahead) {
                $(this.field).typeahead('destroy');
            }
        },

        /**
         * @see Alpaca.ControlField#renderField
         */
        renderField: function(onSuccess) {

            var _this = this;

            if (this.controlFieldTemplateDescriptor) {

                this.field = _this.view.tmpl(this.controlFieldTemplateDescriptor, {
                    "id": this.getId(),
                    "name": this.name,
                    "options": this.options
                });
                this.injectField(this.field);
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

                if (self.field)
                {
                    // mask it
                    if ( self.field && self.field.mask && self.options.maskString)
                    {
                        self.field.mask(self.options.maskString);
                    }

                    // typeahead?
                    if ( self.field && self.field.typeahead && self.options.typeahead)
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

                        // support for each datasets (local, prefetch, remote)
                        if (tDatasets.type == "local" || tDatasets.type == "remote" || tDatasets.type == "prefetch")
                        {
                            var bloodHoundConfig = {
                                datumTokenizer: function(d) {
                                    return Bloodhound.tokenizers.whitespace(d.value);
                                },
                                queryTokenizer: Bloodhound.tokenizers.whitespace
                            };

                            if (tDatasets.type == "local" )
                            {
                                var local = [];

                                for (var i = 0; i < tDatasets.source.length; i++)
                                {
                                    var localElement = tDatasets.source[i];
                                    if (typeof(localElement) == "string")
                                    {
                                        localElement = {
                                            "value": localElement
                                        };
                                    }

                                    local.push(localElement);
                                }

                                bloodHoundConfig.local = local;
                            }

                            if (tDatasets.type == "prefetch")
                            {
                                bloodHoundConfig.prefetch = {
                                    url: tDatasets.source
                                };

                                if (tDatasets.filter)
                                {
                                    bloodHoundConfig.prefetch.filter = tDatasets.filter;
                                }
                            }

                            if (tDatasets.type == "remote")
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
                                if (typeof(template) == "string")
                                {
                                    tDatasets.templates[k] = Handlebars.compile(template);
                                }
                            }
                        }

                        // process typeahead
                        $(self.field).typeahead(tConfig, tDatasets);

                        // listen for "autocompleted" event and set the value of the field
                        $(self.field).on("typeahead:autocompleted", function(event, datum) {
                            self.setValue(datum.value);
                        });

                        // listen for "selected" event and set the value of the field
                        $(self.field).on("typeahead:selected", function(event, datum) {
                            self.setValue(datum.value);
                        });

                        // custom events
                        if (tEvents)
                        {
                            if (tEvents.autocompleted) {
                                $(self.field).on("typeahead:autocompleted", function(event, datum) {
                                    tEvents.autocompleted(event, datum);
                                });
                            }
                            if (tEvents.selected) {
                                $(self.field).on("typeahead:selected", function(event, datum) {
                                    tEvents.selected(event, datum);
                                });
                            }
                        }

                        // when the input value changes, change the query in typeahead
                        // this is to keep the typeahead control sync'd with the actual dom value
                        // only do this if the query doesn't already match
                        var fi = $(self.field);
                        $(self.field).change(function() {

                            var value = $(this).val();

                            var newValue = $(fi).typeahead('val');
                            if (newValue != value)
                            {
                                $(fi).typeahead('val', newValue);
                            }

                        });
                    }

                    if (self.fieldContainer) {
                        self.fieldContainer.addClass('alpaca-controlfield-text');
                    }
                }

                callback();
            });

        },

        /**
         * @see Alpaca.Field#getValue
         */
        getValue: function() {
            var value = null;
            if (this.field) {
                value = this.field.val();
            } else {
                value = this.base();
            }

            return value;
        },
        
        /**
         * @see Alpaca.Field#setValue
         */
        setValue: function(value) {

            if (this.field)
            {
                if (Alpaca.isEmpty(value)) {
                    this.field.val("");
                } else {
                    this.field.val(value);
                }
            }

            // be sure to call into base method
            this.base(value);
        },
        
        /**
         * @see Alpaca.ControlField#handleValidate
         */
        handleValidate: function() {
            var baseStatus = this.base();
            
            var valInfo = this.validation;
			
			var status =  this._validatePattern();
            valInfo["invalidPattern"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.view.getMessage("invalidPattern"), [this.schema.pattern]),
                "status": status
            };
 
            status = this._validateMaxLength();
			valInfo["stringTooLong"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.view.getMessage("stringTooLong"), [this.schema.maxLength]),
                "status": status
            };

            status = this._validateMinLength();
			valInfo["stringTooShort"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.view.getMessage("stringTooShort"), [this.schema.minLength]),
                "status": status
            };

            return baseStatus && valInfo["invalidPattern"]["status"] && valInfo["stringTooLong"]["status"] && valInfo["stringTooShort"]["status"];
        },
        
        /**
         * Validates against the schema pattern property.
         *
         * @returns {Boolean} True if it matches the pattern, false otherwise.
         */
        _validatePattern: function() {
            if (this.schema.pattern) {
                var val = this.getValue();
                if (val === "" && this.options.allowOptionalEmpty && !this.schema.required) {
                    return true;
                }
                if (Alpaca.isEmpty(val)) {
                    val = "";
                }
                if (!val.match(this.schema.pattern)) {
                    return false;
                }
            }
            
            return true;
        },
        
        /**
         * Validates against the schema minLength property.
         *
         * @returns {Boolean} True if its size is greater than minLength, false otherwise.
         */
        _validateMinLength: function() {
			if (!Alpaca.isEmpty(this.schema.minLength)) {
				var val = this.getValue();
                if (val === "" && this.options.allowOptionalEmpty && !this.schema.required) {
                    return true;
                }
                if (Alpaca.isEmpty(val)) {
                    val = "";
                }
                if (val.length < this.schema.minLength) {
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
        _validateMaxLength: function() {
			if (!Alpaca.isEmpty(this.schema.maxLength)) {
				var val = this.getValue();
                if (val === "" && this.options.allowOptionalEmpty && !this.schema.required) {
                    return true;
                }
                if (Alpaca.isEmpty(val)) {
                    val = "";
                }
                if (val.length > this.schema.maxLength) {
                    return false;
                }
			}
            return true;
        },
        
        /**
         * @see Alpaca.Field#disable
         */
        disable: function() {
            if (this.field)
            {
                this.field.disabled = true;
            }
        },
        
        /**
         * @see Alpaca.Field#enable
         */
        enable: function() {
            if (this.field)
            {
                this.field.disabled = false;
            }
        },
        
        /**
         * @see Alpaca.Field#focus
         */
        focus: function() {
            if (this.field)
            {
                this.field.focus();
            }
        },//__BUILDER_HELPERS
        
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
                    }
                }
            });
        },    

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
         * @see Alpaca.Field#getType
         */
        getType: function() {
            return "string";
        },
		
        /**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function() {
            return "text";
        }//__END_OF_BUILDER_HELPERS
        
    });

    Alpaca.registerTemplate("controlFieldText", '<input type="text" id="${id}" {{if options.placeholder}}placeholder="${options.placeholder}"{{/if}} {{if options.size}}size="${options.size}"{{/if}} {{if options.readonly}}readonly="readonly"{{/if}} {{if name}}name="${name}"{{/if}} {{each(i,v) options.data}}data-${i}="${v}"{{/each}}/>');
    Alpaca.registerMessages({
        "invalidPattern": "This field should have pattern {0}",
        "stringTooShort": "This field should contain at least {0} numbers or characters",
        "stringTooLong": "This field should contain at most {0} numbers or characters"
    });
    Alpaca.registerFieldClass("text", Alpaca.Fields.TextField);
    Alpaca.registerDefaultSchemaFieldMapping("string", "text");
})(jQuery);
