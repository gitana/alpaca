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
            
            this.buttonStyle = Alpaca.isEmpty(Alpaca.getViewParam('buttonStyle', this))?"button":Alpaca.getViewParam('buttonStyle', this);
        },
        
        /**
         * @Override
         *
         * Renders an INPUT control into the field container
         */
        renderField: function(onSuccess) {
            // decorate the field container with our class
            $(this.fieldContainer).addClass("alpaca-buttonfield");
            
            var controlFieldTemplate = Alpaca.getTemplate("controlFieldButton", this);
            
            if (controlFieldTemplate) {
                this.inputElement = $.tmpl(controlFieldTemplate, {
                    "id": this.getId(),
                    "type": this.buttonType,
                    "value": this.data,
                    "options": this.options
                });
				this.inputElement.addClass("alpaca-form-button");
				if (this.buttonStyle == 'button') {
					this.button = this.inputElement.button({
						text: true
					});
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
        },
		
		/**
         * @Override
		 */
		getTitle: function() {
			return "Button Field";
		},
		
		/**
         * @Override
		 */
		getDescription: function() {
			return "Common Button Field.";
		},

		/**
         * @Override
         */
        getType: function() {
            return "any";
        }
    });
    
    Alpaca.registerTemplate("controlFieldButton", '<button type="${type}" id="${id}" {{if options.readonly}}readonly="on"{{/if}} {{if options.formName}}name="${options.formName}"{{/if}} {{if value}}value="${value}"{{/if}} {{each(i,v) options.data}}data-${i}="${v}"{{/each}}>{{if value}}${value}{{/if}}</button>');
    Alpaca.registerFieldClass("button", Alpaca.Fields.ButtonField);
    
})(jQuery);
