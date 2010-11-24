(function($){

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
            
            if (!this.settings.size) {
                this.settings.size = 40;
            }
        },
		
		/**
         * @Override
         *
         * Renders an INPUT control into the field container
         */
        renderField: function(onSuccess){
            var controlFieldTemplate = Alpaca.getTemplate("controlFieldText", this);
            
            if (controlFieldTemplate) {
                this.inputElement = $.tmpl(controlFieldTemplate, {
                    "id": this.getId(),
                    "settings": this.settings
                });
				this.inputElement.addClass("alpaca-textfield");
                this.injectField(this.inputElement);
            }
            
            if (onSuccess) {
                onSuccess();
            }
        },
        
        /**
         * @Override
         *
         * Return the value of the input control
         */
        getValue: function(){
            return $(this.inputElement).val();
        },
        
        /**
         * @Override
         *
         * Set value onto the input contorl
         */
        setValue: function(value, stopUpdateTrigger){
            if (value) {
                $(this.inputElement).val(value);
            }
            else {
                $(this.inputElement).val("");
            }
            
            // be sure to call into base method
            this.base(value, stopUpdateTrigger);
        },
        
        /**
         * @Override
         */
        handleValidate: function(){
            if (!this._validatePattern()) {
                return false;
            }
            
            if (!this._validateMaxLength()) {
                return false;
            }
            
            if (!this._validateMinLength()) {
                return false;
            }
            return this.base();
        },
        
        _validatePattern: function(){
            var val = this.getValue();
            
            // JSON SCHEMA - regular expression pattern
            if (this.schema.pattern) {
                if (!val.match(this.schema.pattern)) {
                    return false;
                }
            }
            
            return true;
        },
        
        _validateMinLength: function(){
            var val = this.getValue();
            
            if (!Alpaca.isEmpty(val)) {
				// JSON SCHEMA - minLength
				if (this.schema.minLength) {
					if (val.length < this.schema.minLength) {
						return false;
					}
				}
			}
            return true;
        },
        
        _validateMaxLength: function(){
            var val = this.getValue();
            
            if (!Alpaca.isEmpty(val)) {
				// JSON SCHEMA - maxLength
				if (this.schema.maxLength) {
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
        disable: function(){
            this.inputElement.disabled = true;
        },
        
        /**
         * @Override
         */
        enable: function(){
            this.inputElement.disabled = false;
        },
        
        /**
         * @Override
         */
        focus: function(){
            this.inputElement.focus();
        },
        
        /**
         * @Override
         */
        getValidationStateMessage: function(state){
            if (state == Alpaca.STATE_INVALID) {
                if (!this._validateMinLength()) {
                    return Alpaca.substituteTokens(Alpaca.getMessage("stringTooShort", this), [this.schema.minLength]);
                }
                
                if (!this._validateMaxLength()) {
                    return Alpaca.substituteTokens(Alpaca.getMessage("stringTooLong", this), [this.schema.maxLength]);
                }
            }
            
            return this.base(state);
        }
        
    });
    
    Alpaca.registerTemplate("controlFieldText", '<input type="text" id="${id}" {{if settings.size}}size="${settings.size}"{{/if}} {{if settings.readonly}}readonly="on"{{/if}} {{if settings.formName}}name="${settings.formName}"{{/if}} {{each(i,v) settings.data}}data-${i}="${v}"{{/each}}/>');
    Alpaca.registerMessages({
        "stringTooShort": "This field should contain at least {0} numbers or characters",
        "stringTooLong": "This field should contain at most {0} numbers or characters"
    });
    Alpaca.registerFieldClass("text", Alpaca.Fields.TextField);
    Alpaca.registerDefaultSchemaFieldMapping("string", "text");
})(jQuery);
