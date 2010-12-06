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
            
            if (this.options.formName) {
				this.formName = this.options.formName;
			}
			else {
				this.formName = this.getId()+"-form-name";
			}
        },
		        
        /**
         * @Override
         *
         * Return the value of the input control
         */
        getValue: function(){
            return $('input:radio[name='+this.formName+']:checked',this.inputElement).val();
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
            // decorate the field container with our class
            $(this.fieldContainer).addClass("alpaca-listfield");
            
            var controlFieldTemplate = Alpaca.getTemplate("controlFieldRadio", this, null, this.mode);
            
            if (controlFieldTemplate) {
                this.inputElement = $.tmpl(controlFieldTemplate, {
                    "id": this.getId(),
                    "options": this.options,
                    "selectOptions": this.selectOptions,
					"formName": this.formName,
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
         *
         * Handler for click event
         */
        onClick: function(e){
            this.base(e);
            
            var _this = this;
            
            Alpaca.later(25, this, function(){
                var v = _this.getValue();
                _this.setValue(v, false);
            });
            this.renderValidationState();            
        },
        
    });
    
    Alpaca.registerTemplate("controlFieldRadio", '<div id="${id}">{{each selectOptions}}<input type="radio" {{if options.readonly}}readonly="on"{{/if}} name="${formName}" value="${value}" {{if value == data}}checked="checked"{{/if}}/>${text}{{/each}}</div>');
    Alpaca.registerFieldClass("radio", Alpaca.Fields.RadioField);
    
})(jQuery);
