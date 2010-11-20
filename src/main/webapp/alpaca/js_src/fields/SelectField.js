/**
 * Select control
 */
(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * List field
     */
    Alpaca.Fields.SelectField = Alpaca.Fields.ListField.extend({
    
        /**
         * @Override
         *
         * Return the value of the input control
         */
        getValue: function() {
            return this.inputElement.val();
        },
        
        /**
         * @Override
         *
         * Return the value of the input control
         */
        setValue: function(val, stopUpdateTrigger) {
            if (val != this.getValue()) {
                this.base(val, stopUpdateTrigger);
            }
        },
        
        /**
         * @Override
         *
         * Render list control into the field container
         */
        renderField: function(onSuccess) {
            // decorate the field container with our class
            $(this.fieldContainer).addClass("alpaca-listfield");
            
            var controlFieldTemplate = Alpaca.getTemplate("controlFieldSelect", this, null, this.mode);
            
            if (controlFieldTemplate) {
                this.inputElement = $.tmpl(controlFieldTemplate, {
                    "id": this.getId(),
                    "settings": this.settings,
                    "selectOptions": this.selectOptions,
                    "data": this.data
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
         * Handler for change event
         */
        onChange: function(e) {
            this.base(e);
            
            var _this = this;
            
            Alpaca.later(25, this, function() {
                var v = _this.getValue();
                _this.setValue(v, false);
            });
        },
    
    });
    
    Alpaca.registerTemplate("controlFieldSelect", '<select id="${id}" {{if settings.readonly}}readonly="on"{{/if}} {{if settings.formName}}name="${settings.formName}"{{/if}}>{{each selectOptions}}<option value="${value}" {{if value == data}}selected="selected"{{/if}}>${text}</option>{{/each}}/></select>');
    Alpaca.registerFieldClass("select", Alpaca.Fields.SelectField);
    
})(jQuery);
