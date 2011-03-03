(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Check box field control
     *
     * The following additional settings are permitted:
     *
     * {
     *    rightLabel: <string>                          text to show to the right of the checkbox
     *    formName: <string>                            http post form name
     * }
     */
    Alpaca.Fields.CheckBoxField = Alpaca.ControlField.extend({
    
        /**
         * @Override
         *
         */
        setup: function() {
            this.base();
            
            if (!this.options.rightLabel) {
                this.options.rightLabel = "";
            }           
        },
        
        /**
         * @Override
         *
         */
        renderField: function(onSuccess) {
            var controlFieldTemplate = Alpaca.getTemplate("controlFieldCheckbox", this, null, this.mode);
            
            if (controlFieldTemplate) {
				this.inputElement = $.tmpl(controlFieldTemplate, {
					"id": this.getId(),
					"options": this.options
				});
				this.injectField(this.inputElement);
				this.inputElement = $('input[id="' + this.getId() + '"]', this.inputElement);
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
			if (this.fieldContainer) {
				this.fieldContainer.addClass('alpaca-controlfield-checkbox');
			}
        },		

        /**
         * @Override
         *
         */
        getValue: function() {
            return this.inputElement.attr("checked") ? this.inputElement.attr("checked") : false;
        },
        
        /**
         * @Override
         *
         */
        setValue: function(value, stopUpdateTrigger) {          
            if (value) {
                this.inputElement.attr({
                    "checked": true
                });
            } else {
                this.inputElement.attr({
                    "checked": false
                });
            }
            // be sure to call into base method
            this.base(value, stopUpdateTrigger);
        },
        
        /**
         * @Override
         *
         */
        disable: function() {
            this.inputElement.disabled = true;
        },
        
        /**
         * @Override
         *
         */
        enable: function() {
            this.inputElement.disabled = false;
        },
		
        /**
         * @Override
         */
		getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(),{
				"properties": {
					"rightLabel": {
						"title": "Option Label",
						"description": "Option label",
						"type": "string"
					}
				}
			});
		},

        /**
         * @Override
         */
		getOptionsForOptions: function() {
            return Alpaca.merge(this.base(),{
				"fields": {
					"rightLabel": {
						"type": "text"
					}
				}
			});
		},
				
		/**
         * @Override
		 */
		getTitle: function() {
			return "Checkbox Field";
		},
		
		/**
         * @Override
		 */
		getDescription: function() {
			return "Checkbox Field.";
		},

		/**
         * @Override
         */
        getType: function() {
            return "boolean";
        },

		/**
         * @Override
         */
        getFieldType: function() {
            return "checkbox";
        }
        
    });
    
    Alpaca.registerTemplate("controlFieldCheckbox", '<span><input type="checkbox" id="${id}" {{if options.readonly}}readonly="on"{{/if}} {{if options.name}}name="${options.name}"{{/if}} {{each(i,v) options.data}}data-${i}="${v}"{{/each}}/>{{if options.rightLabel}}<label for="${id}">${options.rightLabel}</label>{{/if}}</span>');
    
    Alpaca.registerFieldClass("checkbox", Alpaca.Fields.CheckBoxField);
    Alpaca.registerDefaultSchemaFieldMapping("boolean", "checkbox");
})(jQuery);
