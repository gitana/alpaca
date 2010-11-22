(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Abstract Button class
     */
    Alpaca.Fields.ButtonField = Alpaca.ControlField.extend({
    
        /**
         * @Override
         *
         * Sets up any default values for this field.
         */
        setup: function() {
            this.base();
            
            if (this.options && this.options.form) {
                this.form = this.options.form;
                // now remove it from the options to avoid infinite loop
                delete this.options.form;
            }
            
            if (this.options && this.options.buttonType) {
                this.buttonType = this.options.buttonType;
            } else {
                this.buttonType = "button";
            }
        },
        
        /**
         * @Override
         *
         * Renders an INPUT control into the field container
         */
        renderField: function(onSuccess) {
            // decorate the field container with our class
            $(this.fieldContainer).addClass("alpaca-buttonfield");
            
            var controlFieldTemplate = Alpaca.getTemplate("controlFieldButton", this, null, this.mode);
            
            if (controlFieldTemplate) {
                this.inputElement = $.tmpl(controlFieldTemplate, {
                    "id": this.getId(),
                    "type": this.buttonType,
                    "value": this.data,
                    "settings": this.settings
                });
				this.inputElement.addClass("alpaca-form-button");				 
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
        getValue: function() {
            return $(this.inputElement).val();
        },
        
        /**
         * @Override
         *
         * Set value onto the input contorl
         */
        setValue: function(value, stopUpdateTrigger) {
            if (value) {
                $(this.inputElement).val(value);
            } else {
                $(this.inputElement).val("");
            }
            
            // be sure to call into base method
            this.base(value, stopUpdateTrigger);
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
        onClick: function(e) {
        }
    });
    
    Alpaca.registerTemplate("controlFieldButton", '<input type="${type}" id="${id}" {{if settings.readonly}}readonly="on"{{/if}} {{if settings.formName}}name="${settings.formName}"{{/if}} {{if value}}value="${value}"{{/if}} {{each settings.data}}data-${fieldId}="${value}"{{/each}}/>');
    Alpaca.registerFieldClass("button", Alpaca.Fields.ButtonField);
    
})(jQuery);
