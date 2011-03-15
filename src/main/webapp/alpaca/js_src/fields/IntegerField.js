(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Integer field control
     *
     * The following additional settings are permitted:
     *
     * {
     *    min: <number>                                  minimum value
     *    max: <number>                                  maximum value
     * }
     *
     * This field obeys JSON Schema for:
     *
     * {
     *    minimum: <number>,							[optional]
     *    maximum: <number>,							[optional]
     *    minimumCanEqual: <boolean>,					[optional]
     *    maximumCanEqual: <boolean>,					[optional]
     *    divisibleBy: <number>                         [optional]
     * }
     */
    Alpaca.Fields.IntegerField = Alpaca.Fields.NumberField.extend({
    
        /**
         * @Override
         *
         */
        getValue: function() {
            var textValue = this.inputElement.val();
            return parseInt(textValue);
        },
		
		/**
         * @Override
         */
        onChange: function(e) {
            this.base();
			if (this.slider) {
				this.slider.slider( "value", this.getValue() );
			}
        },
        
        /**
         * @Override
         */
        postRender: function() {
            this.base();
			var _this = this;
            if (this.options.slider) {
                if (this.schema.maximum && this.schema.minimum) {
                    this.inputElement.after('<div id="slider"></div>');
					this.slider =$('#slider',this.inputElement.parent()).slider({
                        value: this.getValue(),
                        min: this.schema.minimum,
                        max: this.schema.maximum,
                        slide: function(event, ui) {
                            _this.setValue(ui.value);
							_this.renderValidationState();
                        }
                    });                    
                }
            }
			if (this.fieldContainer) {
				this.fieldContainer.addClass('alpaca-controlfield-integer');
			}
        },

        /**
         * @Override
         *
         */
        handleValidate: function() {
        
            var baseStatus = this.base();
            
            var valInfo = this.validation;
            
            if (!valInfo["stringNotANumber"]["status"]) {
                valInfo["stringNotANumber"]["message"] = Alpaca.getMessage("stringNotAnInteger", this);
            }
            
            return baseStatus;
        },
        
        /**
         * Validates if it is a number
         */
        _validateNumber: function() {
            var textValue = this.inputElement.val();
			
			if (Alpaca.isValEmpty(textValue)) {
                return true;
            }
			
            var floatValue = this.getValue();
            
            // quick check to see if what they entered was a number
            if (isNaN(floatValue)) {
                return false;
            }
            
            // check if valid number format
            if (!textValue.match(/^([\+\-]?([1-9]\d*)|0)$/)) {
                return false;
            }
            
            return true;
        },
        
        /**
         * @Override
         */
        getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "minimum": {
                        "title": "Minimum",
                        "description": "Minimum value of the property",
                        "type": "integer"
                    },
                    "maximum": {
                        "title": "Maximum",
                        "description": "Maximum value of the property",
                        "type": "integer"
                    },
                    "divisibleBy": {
                        "title": "Divisible By",
                        "description": "Property value must be divisible by this number",
                        "type": "integer"
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
                    "minimum": {
                        "helper": "Minimum value of the field",
                        "type": "integer"
                    },
                    "maximum": {
                        "helper": "Maximum value of the field",
                        "type": "integer"
                    },
                    "divisibleBy": {
                        "helper": "Property value must be divisible by this number",
                        "type": "integer"
                    }
                }
            });
        }, 
		
        /**
         * @Override
         */
		getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(),{
				"properties": {
					"slider": {
						"title": "Slider",
						"description": "Generate slider control if true",
						"type": "boolean",
						"default": false
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
					"slider": {
						"rightLabel": "Slider control ?",
						"helper": "Generate slider control if selected",
						"type": "checkbox"
					}
				}
			});
		},		       
        /**
         * @Override
         */
        getTitle: function() {
            return "Integer Field";
        },
        
        /**
         * @Override
         */
        getDescription: function() {
            return "Integer Field.";
        },

		/**
         * @Override
         */
        getType: function() {
            return "integer";
        },
        
        /**
         * @Override
         */
        getFieldType: function() {
            return "integer";
        }
    });
    
    // Additional Registrations
    Alpaca.registerMessages({
        "stringNotAnInteger": "This value is not an integer."
    });
    Alpaca.registerFieldClass("integer", Alpaca.Fields.IntegerField);
    Alpaca.registerDefaultSchemaFieldMapping("integer", "integer");
})(jQuery);
