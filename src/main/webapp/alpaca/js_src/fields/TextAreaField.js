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
            
            if (!this.options.rows) {
                this.options.rows = 5;
            }
            
            if (!this.options.cols) {
                this.options.cols = 40;
            }
			
			this.controlFieldTemplate = Alpaca.getTemplate("controlFieldTextarea", this);
        },
        
        /**
         * @Override
         */
        postRender: function() {
            this.base();
            // apply additional css
            $(this.fieldContainer).addClass("alpaca-textareafield");
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
    
    Alpaca.registerTemplate("controlFieldTextarea", '<textarea id="${id}" {{if options.rows}}rows="${options.rows}"{{/if}} {{if options.cols}}cols="${options.cols}"{{/if}} {{if options.readonly}}readonly="on"{{/if}} {{if options.formName}}name="${options.formName}"{{/if}} {{each options.data}}data-${fieldId}="${value}"{{/each}}/>');
    Alpaca.registerFieldClass("textarea", Alpaca.Fields.TextAreaField);
    
})(jQuery);
