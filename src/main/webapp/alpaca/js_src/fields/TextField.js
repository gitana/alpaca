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
            
            this.controlFieldTemplate = this.view.getTemplate("controlFieldText");
        },
        
        /**
         * @see Alpaca.ControlField#renderField
         */
        renderField: function(onSuccess) {
        
            if (this.controlFieldTemplate) {
                this.field = $.tmpl(this.controlFieldTemplate, {
                    "id": this.getId(),
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
        postRender: function() {
            this.base();
            // mask it
            if ( this.field && this.options.mask && this.options.maskString) {
                this.field.mask(this.options.maskString);
            }
			if (this.fieldContainer) {
				this.fieldContainer.addClass('alpaca-controlfield-text');
			}			
        },

        
        /**
         * @see Alpaca.Field#getValue
         */
        getValue: function() {
            return this.field.val();
        },
        
        /**
         * @see Alpaca.Field#setValue
         */
        setValue: function(value) {
            if (Alpaca.isEmpty(value)) {
                this.field.val("");
            } else {
                this.field.val(value);
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
				if (!Alpaca.isEmpty(val)) {
					if (val.length < this.schema.minLength) {
						return false;
					}
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
				if (!Alpaca.isEmpty(val)) {
					if (val.length > this.schema.maxLength) {
						return false;
					}
				}
			}
            return true;
        },
        
        /**
         * @see Alpaca.Field#disable
         */
        disable: function() {
            this.field.disabled = true;
        },
        
        /**
         * @see Alpaca.Field#enable
         */
        enable: function() {
            this.field.disabled = false;
        },
        
        /**
         * @see Alpaca.Field#focus
         */
        focus: function() {
            this.field.focus();
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
                        "description": "Property value minimal length",
                        "type": "number"
                    },
                    "maxLength": {
                        "title": "Maximum Length",
                        "description": "Property value maximum length",
                        "type": "number"
                    },
                    "pattern": {
                        "title": "Pattern",
                        "description": "Property value pattern in regular expression",
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
                        "description": "Field size",
                        "type": "number",
						"default":40
                    },
                    "mask": {
                        "title": "Mask",
                        "description": "Enable field mask if true",
                        "type": "boolean"
                    },
                    "maskString": {
                        "title": "Mask Expression",
                        "description": "Expression for field mask",
                        "type": "string"
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
                    "mask": {
                        "helper": "Enable field mask if checked",
						"rightLabel": "Enable field mask?",
                        "type": "checkbox"
                    },
                    "maskString": {
                        "helper": "a - an alpha character;9 - a numeric character;* - an alphanumeric character",
                        "type": "text"
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
        }		
        
    });
    
    Alpaca.registerTemplate("controlFieldText", '<input type="text" id="${id}" {{if options.size}}size="${options.size}"{{/if}} {{if options.readonly}}readonly="readonly"{{/if}} {{if options.name}}name="${options.name}"{{/if}} {{each(i,v) options.data}}data-${i}="${v}"{{/each}}/>');
    Alpaca.registerMessages({
        "invalidPattern": "This field should have pattern {0}",
        "stringTooShort": "This field should contain at least {0} numbers or characters",
        "stringTooLong": "This field should contain at most {0} numbers or characters"
    });
    Alpaca.registerFieldClass("text", Alpaca.Fields.TextField);
    Alpaca.registerDefaultSchemaFieldMapping("string", "text");
})(jQuery);
