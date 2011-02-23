(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * File field control
     *
     * The following additional settings are permitted:
     *
     * {
     * }
     *
     * This field obeys JSON Schema for:
     *
     * {
     * }
     */
    Alpaca.Fields.FileField = Alpaca.Fields.TextField.extend({
    
        /**
         * @Override
         *
         */
        setup: function() {
            this.base();            
            this.controlFieldTemplate = Alpaca.getTemplate("controlFieldFile", this);
        },
                
        /**
         * @Override
         *
         * Set value onto the input contorl
         */
        setValue: function(value, stopUpdateTrigger) {            
            // be sure to call into base method
        	// We won't be able to actually set the value for file input field so we use the mask input
        	var tmp = this.inputElement;
        	this.inputElement = $('.alpaca-filefield-control',this.fieldContainer);
            this.base(value, stopUpdateTrigger);
            // switch it back to actual file input
        	this.inputElement = tmp;
        },
        
        /**
         * @Override
         */
        postRender: function() {
            // make it stylable
            if (this.inputElement) {
				this.inputElement.customFileInput();
            }
            this.base();
            // apply additional css
			if (this.fieldContainer) {
				this.fieldContainer.addClass("alpaca-controlfield-file");
			}            			
        },
		
		/**
         * @Override
		 */
		getTitle: function() {
			return "File Field";
		},
		
		/**
         * @Override
		 */
		getDescription: function() {
			return "Field for uploading files.";
		},

		/**
         * @Override
         */
        getFieldType: function() {
            return "file";
        }
    });
    
    Alpaca.registerTemplate("controlFieldFile", '<input type="file" id="${id}" {{if options.size}}size="${options.size}"{{/if}} {{if options.readonly}}readonly="on"{{/if}} {{if options.formName}}name="${options.formName}"{{/if}} {{each(i,v) options.data}}data-${i}="${v}"{{/each}}/>');
    Alpaca.registerFieldClass("file", Alpaca.Fields.FileField);
})(jQuery);
