/**
 * Radio control
 */
(function($){

    var Alpaca = $.alpaca;
    
    /**
     * List field
     */
    Alpaca.Fields.RadioField = Alpaca.Fields.ListField.extend({
    
        /**
         * @Override
		 *	
         * Sets up any default values for this field.
         */
        setup: function(){
            this.base();
            
            if (this.options.name) {
				this.name = this.options.name;
			}
			else {
				this.name = this.getId()+"-name";
			}
        },
		        
        /**
         * @Override
         *
         * Return the value of the input control
         */
        getValue: function(){
            return $('input:radio[name='+this.name+']:checked',this.inputElement).val();
        },
        
        /**
         * @Override
         *
         * Return the value of the input control
         */
        setValue: function(val, stopUpdateTrigger){
            if (val != this.getValue()) {
                this.base(val, stopUpdateTrigger);
            }
        },
        
        /**
         * @Override
         *
         * Render list control into the field container
         */
        renderField: function(onSuccess){            
            var controlFieldTemplate = Alpaca.getTemplate("controlFieldRadio", this, null, this.mode);
            
            if (controlFieldTemplate) {
                this.inputElement = $.tmpl(controlFieldTemplate, {
                    "id": this.getId(),
                    "options": this.options,
                    "selectOptions": this.selectOptions,
                    "required":this.schema.required,
					"name": this.name,
                    "data": this.data
                });
                if ($("input:radio:checked",this.inputElement).length == 0) {
                	$("input:radio:first",this.inputElement).attr("checked","checked");
                }
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
				this.fieldContainer.addClass('alpaca-controlfield-radio');
			}
        },        
        
        /**
         * @Override
         *
         * Handler for click event
         */
        onClick: function(e){
            this.base(e);
            
            var _this = this;
            
            Alpaca.later(25, this, function(){
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
					"name": {
						"title": "Field name",
						"description": "Field name",
						"type": "string",
						"readonly": true
					}
				}
			});
        },
        
		/**
         * @Override
		 */
		getTitle: function() {
			return "Radio Group Field";
		},
		
		/**
         * @Override
		 */
		getDescription: function() {
			return "Radio Group Field.";
		},

		/**
         * @Override
         */
        getFieldType: function() {
            return "radio";
        }	
        
    });
    
    Alpaca.registerTemplate("controlFieldRadio", '<div id="${id}" class="alpaca-controlfield-radio">{{if !required}}<input type="radio" {{if options.readonly}}readonly="on"{{/if}} name="${name}" value=""/><span class="alpaca-controlfield-radio-label">None</span>{{/if}}{{each selectOptions}}<input type="radio" {{if options.readonly}}readonly="on"{{/if}} name="${name}" value="${value}" {{if value == data}}checked="checked"{{/if}}/><span class="alpaca-controlfield-radio-label">${text}</span>{{/each}}</div>');
    Alpaca.registerFieldClass("radio", Alpaca.Fields.RadioField);
    
})(jQuery);
