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
			if (this.fieldContainer) {
				this.fieldContainer.addClass('alpaca-controlfield-textarea');
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
        },
		
		/**
         * @Override
		 */
		getTitle: function() {
			return "Multi-Line Text";
		},
		
		/**
         * @Override
		 */
		getDescription: function() {
			return "Textare field for multiple line text.";
		},
		
        /**
         * @Override
         */
		getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(),{
				"properties": {
					"rows": {
						"title": "Rows",
						"description": "Number of rows",
						"type": "number",
						"default": 5
					},
					"cols": {
						"title": "Columns",
						"description": "Number of columns",
						"type": "number",
						"default": 40
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
					"rows": {
						"type": "integer"
					},
					"cols": {
						"type": "integer"
					}
				}
			});
		},
		
		/**
         * @Override
         */
        getFieldType: function() {
            return "textarea";
        }	
        
    });
    
    Alpaca.registerTemplate("controlFieldTextarea", '<textarea id="${id}" {{if options.rows}}rows="${options.rows}"{{/if}} {{if options.cols}}cols="${options.cols}"{{/if}} {{if options.readonly}}readonly="on"{{/if}} {{if options.formName}}name="${options.formName}"{{/if}} {{each options.data}}data-${fieldId}="${value}"{{/each}}/>');
    Alpaca.registerFieldClass("textarea", Alpaca.Fields.TextAreaField);
    
})(jQuery);
