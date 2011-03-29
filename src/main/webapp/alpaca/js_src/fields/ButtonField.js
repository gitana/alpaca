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

            if (this.options && this.options.label) {
                this.label = this.options.label;
            }

            this.buttonStyle = Alpaca.isEmpty(Alpaca.getViewParam('buttonStyle', this)) ? "button" : Alpaca.getViewParam('buttonStyle', this);
        },

        /**
         * @Override
         *
         * Renders an INPUT control into the field container
         */
        renderField: function(onSuccess) {
            // decorate the field container with our class
            $(this.fieldContainer).addClass("alpaca-controlfield-button");

            var controlFieldTemplate = Alpaca.getTemplate("controlFieldButton", this);

            if (controlFieldTemplate) {
                this.field = $.tmpl(controlFieldTemplate, {
                    "id": this.getId(),
                    "type": this.buttonType,
                    "value": this.data,
                    "label": this.label,
                    "options": this.options
                });
                this.field.addClass("alpaca-form-button");
                if (this.buttonStyle == 'button') {
                    this.button = this.field.button({
                        text: true
                    });
                }
                this.injectField(this.field);
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
            return $(this.field).val();
        },

        /**
         * @Override
         *
         * Set value onto the input contorl
         */
        setValue: function(value, stopUpdateTrigger) {
            if (value) {
                $(this.field).val(value);
            } else {
                $(this.field).val("");
            }

            // be sure to call into base method
            this.base(value, stopUpdateTrigger);
        },

        /**
         * @Override
         */
        disable: function() {
            this.field.disabled = true;
        },

        /**
         * @Override
         */
        enable: function() {
            this.field.disabled = false;
        },

        /**
         * @Override
         */
        focus: function() {
            this.field.focus();
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

    Alpaca.registerTemplate("controlFieldButton", '<button type="${type}" id="${id}" {{if options.readonly}}readonly="on"{{/if}} {{if options.formName}}name="${options.formName}"{{/if}} {{if value}}value="${value}"{{/if}} {{each(i,v) options.data}}data-${i}="${v}"{{/each}}>{{if label}}${label}{{else}}{{if value}}${value}{{/if}}{{/if}}</button>');
    Alpaca.registerFieldClass("button", Alpaca.Fields.ButtonField);

})(jQuery);
