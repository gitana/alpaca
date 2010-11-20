(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Text area field
     *
     * The following additional settings are permitted:
     *
     * {
     *    rows: <number>
     *    cols: <number>
     * }
     */
    Alpaca.Fields.TextAreaField = Alpaca.Fields.TextField.extend({
    
        /**
         * @Override
         *
         */
        setup: function() {
            this.base();
            
            if (!this.settings.rows) {
                this.settings.rows = 5;
            }
            
            if (!this.settings.cols) {
                this.settings.cols = 40;
            }
        },
        
        /**
         * @Override
         *
         * Renders an INPUT control into the field container
         */
        renderField: function(onSuccess) {
            // decorate the field container with our class
            $(this.fieldContainer).addClass("alpaca-textareafield");
            
            
            var controlFieldTemplate = Alpaca.getTemplate("controlFieldTextarea", this, null, this.mode);
            
            if (controlFieldTemplate) {
                this.inputElement = $.tmpl(controlFieldTemplate, {
                    "id": this.getId(),
                    "settings": this.settings
                });
                this.injectField(this.inputElement);
            }
            
            if (onSuccess) {
                onSuccess();
            }
        },
        
        /**
         * @Override
         *
         */
        setValue: function(value, stopUpdateTrigger) {
            $(this.inputElement).val(value);
            
            // be sure to call into base method
            this.base(value, stopUpdateTrigger);
        },
        
        /**
         * @Override
         *
         */
        getValue: function() {
            return $(this.inputElement).val();
        }
        
    });
    
    Alpaca.registerTemplate("controlFieldTextarea", '<textarea id="${id}" {{if settings.rows}}rows="${settings.rows}"{{/if}} {{if settings.cols}}cols="${settings.cols}"{{/if}} {{if settings.readonly}}readonly="on"{{/if}} {{if settings.formName}}name="${settings.formName}"{{/if}} {{each settings.data}}data-${fieldId}="${value}"{{/each}}/>');
    Alpaca.registerFieldClass("textarea", Alpaca.Fields.TextAreaField);
    
})(jQuery);
