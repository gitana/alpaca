(function($){

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
    
        setup: function(){
            this.base();
            
            if (!this.settings.rightLabel) {
                this.settings.rightLabel = "";
            }
            
            // We force the optional schema setting since booleans either exist or they don't and both are valid values
            this.schema.optional = true;
            
            // TODO
            this.uncheckedValue = "";
            this.checkedValue = "checked";
        },
        
        renderField: function(onSuccess){
            $(this.fieldContainer).addClass("gitana-checkboxfield");
			
			var controlFieldTemplate = Alpaca.getTemplate("controlFieldCheckbox",this,null,this.mode);

			if (controlFieldTemplate) {
				this.controlElement = $.tmpl(controlFieldTemplate, {
					"id": this.getId(),
					"settings": this.settings
				});
				this.injectField(this.controlElement);
				this.inputElement = $('input[id="'+this.getId()+'"]',this.controlElement);
			}
                        
            if (onSuccess) {
                onSuccess();
            }
        },
        
        initEvents: function(){
            var _this = this;
            
            $(this.inputElement).focus(function(e){
                _this.onFocus(e);
            });
            $(this.inputElement).blur(function(e){
                _this.onBlur(e);
            });
            $(this.inputElement).change(function(e){
                _this.onChange(e);
            });
        },
        
        getValue: function(){
            return $(this.inputElement).attr("checked") ? this.checkedValue : this.uncheckedValue;
        },
        
        setValue: function(value, sendUpdatedEvt){
            var toCheck = false;
            
            if (value == this.checkedValue) {
                toCheck = true;
            }
            
            if (Alpaca.isBoolean(value) && value) {
                toCheck = true;
            }
            
            if (toCheck) {
                this.inputElement.attr({
                    "checked": true
                });
               // this.hiddenElement.val(this.checkedValue);
            }
            else {
                this.inputElement.attr({
                    "checked": false
                });
              //  this.hiddenElement.val(this.uncheckedValue);
            }
        },
        
        disable: function(){
            this.inputElement.disabled = true;
        },
        
        enable: function(){
            this.inputElement.disabled = false;
        }
        
    });

	Alpaca.registerTemplate("controlFieldCheckbox",'<span><input type="checkbox" id="${id}" {{if settings.readonly}}readonly="on"{{/if}} {{if settings.formName}}name="${settings.formName}"{{/if}} {{each settings.data}}data-${fieldId}="${value}"{{/each}}/>{{if settings.rightLabel}}<label for="${id}">${settings.rightLabel}</label>{{/if}}</span>');
    
    Alpaca.registerFieldClass("checkbox", Alpaca.Fields.CheckBoxField);
    Alpaca.registerDefaultSchemaFieldMapping("boolean", "checkbox");
})(jQuery);
