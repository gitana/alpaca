(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Basic text field control
     *
     * The following additional settings are permitted:
     *
     * {
     *    size: <number>								size attribute for input element
     *    readonly: <boolean>                           whether to mark the input control as readonly
     *    formName: <string>                            http post form name
     * }
     *
     * This field obeys JSON Schema for:
     *
     * {
     *    minLength: <number>,                          [optional]
     *    maxLength: <number>,                          [optional]
     *    pattern: <string>                             [optional]
     * }
     */
    Alpaca.Fields.TextField = Alpaca.ControlField.extend({
    
        /**
         * @Override
         *
         */
        setup: function() {
            this.base();
            
            if (!this.options.size) {
                this.options.size = 40;
            }
            
            this.controlFieldTemplate = Alpaca.getTemplate("controlFieldText", this);
        },
        
        /**
         * @Override
         *
         * Renders an INPUT control into the field container
         */
        renderField: function(onSuccess) {
        
            if (this.controlFieldTemplate) {
                this.inputElement = $.tmpl(this.controlFieldTemplate, {
                    "id": this.getId(),
                    "options": this.options
                });
                this.injectField(this.inputElement);
            }
            
            if (onSuccess) {
                onSuccess();
            }
        },
        
        /**
         * @Override
         */
        postRender: function() {
            this.base();
            // mask it
            if ( this.inputElement && this.options.mask && this.options.maskString) {
                this.inputElement.mask(this.options.maskString);
            }
			if (this.fieldContainer) {
				this.fieldContainer.addClass('alpaca-controlfield-text');
			}			
        },

        
        /**
         * @Override
         *
         * Return the value of the input control
         */
        getValue: function() {
            return this.inputElement.val();
        },
        
        /**
         * @Override
         *
         * Set value onto the input contorl
         */
        setValue: function(value, stopUpdateTrigger) {
            if (Alpaca.isEmpty(value)) {
                this.inputElement.val("");
            } else {
                this.inputElement.val(value);
            }
            
            // be sure to call into base method
            this.base(value, stopUpdateTrigger);
        },
        
        /**
         * @Override
         */
        handleValidate: function() {
            var baseStatus = this.base();
            
            var valInfo = this.validation;
			
			var status =  this._validatePattern();
            valInfo["invalidPattern"] = {
                "message": status ? "" : Alpaca.substituteTokens(Alpaca.getMessage("invalidPattern", this), [this.schema.pattern]),
                "status": status
            };
 
            status = this._validateMaxLength();
			valInfo["stringTooLong"] = {
                "message": status ? "" : Alpaca.substituteTokens(Alpaca.getMessage("stringTooLong", this), [this.schema.maxLength]),
                "status": status
            };

            status = this._validateMinLength();
			valInfo["stringTooShort"] = {
                "message": status ? "" : Alpaca.substituteTokens(Alpaca.getMessage("stringTooShort", this), [this.schema.minLength]),
                "status": status
            };

            return baseStatus && valInfo["invalidPattern"]["status"] && valInfo["stringTooLong"]["status"] && valInfo["stringTooShort"]["status"];
        },
        
        /**
         * validates against the pattern
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
         * validates against the minLength
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
         * validates against the maxLength
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
         * @Override
         */
        disable: function() {
            this.inputElement.disabled = true;
        },
        
        /**
         * @Override
         */
        enable: function() {
            this.inputElement.disabled = false;
        },
        
        /**
         * @Override
         */
        focus: function() {
            this.inputElement.focus();
        },
        
        /**
         * @Override
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
         * @Override
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
         * @Override
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
         * @Override
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
         * @Override
         */
        getTitle: function() {
            return "Single-Line Text";
        },
        
        /**
         * @Override
         */
        getDescription: function() {
            return "Text field for single-line text.";
        },
        
        /**
         * @Override
         */
        getType: function() {
            return "string";
        },
		
        /**
         * @Override
         */
        getFieldType: function() {
            return "text";
        }		
        
    });
    
    Alpaca.registerTemplate("controlFieldText", '<input type="text" id="${id}" {{if options.size}}size="${options.size}"{{/if}} {{if options.readonly}}readonly="on"{{/if}} {{if options.name}}name="${options.name}"{{/if}} {{each(i,v) options.data}}data-${i}="${v}"{{/each}}/>');
    Alpaca.registerMessages({
        "invalidPattern": "This field should have pattern {0}",
        "stringTooShort": "This field should contain at least {0} numbers or characters",
        "stringTooLong": "This field should contain at most {0} numbers or characters"
    });
    Alpaca.registerFieldClass("text", Alpaca.Fields.TextField);
    Alpaca.registerDefaultSchemaFieldMapping("string", "text");
    Alpaca.registerDefaultSchemaFieldMapping("any", "text");
})(jQuery);
