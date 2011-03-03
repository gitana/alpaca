/**
 * Select control
 */
(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * List field
     */
    Alpaca.Fields.SelectField = Alpaca.Fields.ListField.extend({
    
        /**
         * @Override
         *
         * Return the value of the input control
         */
        getValue: function() {
			if (this.inputElement) {
				return this.inputElement.val();
			}
        },
        
        /**
         * @Override
         *
         * Return the value of the input control
         */
        setValue: function(val, stopUpdateTrigger) {
            if (Alpaca.isArray(val)) {
				if (!Alpaca.compareArrayContent(val,this.getValue())) {
					this.base(val, stopUpdateTrigger);
				}			
			} else {
				if (val != this.getValue()) {
					this.base(val, stopUpdateTrigger);
				}
			}
        },
        
        /**
         * @Override
         *
         * Render list control into the field container
         */
        renderField: function(onSuccess) {
            
            var controlFieldTemplate;
			
			if (this.options.multiple && Alpaca.isArray(this.data)) {
				controlFieldTemplate = Alpaca.getTemplate("controlFieldSelectMultiple", this);
			} else {
				controlFieldTemplate = Alpaca.getTemplate("controlFieldSelect", this);
			}
            
            if (controlFieldTemplate) {
                this.inputElement = $.tmpl(controlFieldTemplate, {
                    "id": this.getId(),
                    "options": this.options,
					"required": this.schema.required,
                    "selectOptions": this.selectOptions,
                    "data": this.data
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
			if (this.fieldContainer) {
				this.fieldContainer.addClass('alpaca-controlfield-select');
			}
        },				
        
        /**
         * @Override
         *
         * Handler for change event
         */
        onChange: function(e) {
            this.base(e);
            
            var _this = this;
            
            Alpaca.later(25, this, function() {
                var v = _this.getValue();
                _this.setValue(v, false);
				_this.renderValidationState();
            });			
        },
		
        /**
         * @Override
         */
		getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(),{
				"properties": {
					"multiple": {
						"title": "Mulitple Selection",
						"description": "Allow multiple selection if true",
						"type": "boolean",
						"default": false
					},
					"size": {
						"title": "Displayed Options",
						"description": "Number of options to be shown",
						"type": "number"
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
					"multiple": {
						"rightLabel": "Allow mulitple selection ?",
						"helper": "Allow multiple selection if checked",
						"type": "checkbox"
					},
					"size": {
						"type": "integer"
					}
				}
			});
        }, 		
		
		/**
         * @Override
		 */
		getTitle: function() {
			return "Dropdown Select";
		},
		
		/**
         * @Override
		 */
		getDescription: function() {
			return "Dropdown select field.";
		},

		/**
         * @Override
         */
        getFieldType: function() {
            return "select";
        }	
    
    });
    
    Alpaca.registerTemplate("controlFieldSelect", '<select id="${id}" {{if options.readonly}}readonly="on"{{/if}} {{if options.multiple}}multiple{{/if}} {{if options.size}}size="${options.size}"{{/if}} {{if options.name}}name="${options.name}"{{/if}}>{{if !required}}<option value="">None</option>{{/if}}{{each(i,value) selectOptions}}<option value="${value}" {{if value == data}}selected="selected"{{/if}}>${text}</option>{{/each}}/></select>');
    Alpaca.registerTemplate("controlFieldSelectMultiple", '<select id="${id}" {{if options.readonly}}readonly="on"{{/if}} {{if options.multiple}}multiple{{/if}} {{if options.size}}size="${options.size}"{{/if}} {{if options.name}}name="${options.name}"{{/if}}>{{if !required}}<option value="">None</option>{{/if}}{{each(i,value) selectOptions}}<option value="${value}" {{each(j,val) data}}{{if value == val}}selected="selected"{{/if}}{{/each}}>${text}</option>{{/each}}/></select>');
    Alpaca.registerFieldClass("select", Alpaca.Fields.SelectField);
    
})(jQuery);
