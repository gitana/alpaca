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
            
            // We force the optional schema setting since booleans either exist or they don't and both are valid values
            this.schema.optional = true;            
        },
        
        /**
         * @Override
         *
         */
        renderField: function(onSuccess) {
            $(this.fieldContainer).addClass("alpaca-checkboxfield");
            
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
         *
         */
        getValue: function() {
            return $(this.inputElement).attr("checked") ? $(this.inputElement).attr("checked") : false;
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
        }
        
    });
    
    Alpaca.registerTemplate("controlFieldCheckbox", '<span><input type="checkbox" id="${id}" {{if options.readonly}}readonly="on"{{/if}} {{if options.formName}}name="${options.formName}"{{/if}} {{each options.data}}data-${fieldId}="${value}"{{/each}}/>{{if options.rightLabel}}<label for="${id}">${options.rightLabel}</label>{{/if}}</span>');
    
    Alpaca.registerFieldClass("checkbox", Alpaca.Fields.CheckBoxField);
    Alpaca.registerDefaultSchemaFieldMapping("boolean", "checkbox");
})(jQuery);
