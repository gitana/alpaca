(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.ButtonField = Alpaca.ControlField.extend(
    /**
     * @lends Alpaca.Fields.ButtonField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.ControlField
         *
         * @class Default control for form buttons.
         *
         * @param {Object} container Field container.
         * @param {Any} data Field data.
         * @param {Object} options Field options.
         * @param {Object} schema Field schema.
         * @param {Object|String} view Field view.
         * @param {Alpaca.Connector} connector Field connector.
         * @param {Function} errorCallback Error callback.
         */
        constructor: function(container, data, options, schema, view, connector, errorCallback) {
            this.base(container, data, options, schema, view, connector, errorCallback);
        },

        /**
         * @see Alpaca.Field#setup
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

            this.buttonStyle = Alpaca.isEmpty(this.view.buttonStyle) ? "button" : this.view.buttonStyle;
        },

        /**
         * @see Alpaca.ControlField#renderField
         */
        renderField: function(onSuccess) {
            // decorate the field container with our class
            $(this.fieldContainer).addClass("alpaca-controlfield-button");

            var controlFieldTemplate = this.view.getTemplate("controlFieldButton");

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
         * @see Alpaca.Field#getValue
         */
        getValue: function() {
            return $(this.field).val();
        },

        /**
         * @see Alpaca.Field#setValue
         */
        setValue: function(value) {
            if (value) {
                $(this.field).val(value);
            } else {
                $(this.field).val("");
            }

            // be sure to call into base method
            this.base(value);
        },

        /**
         * @see Alpaca.Field#disable
         */
        disable: function() {
            this.field.disabled = true;
        },

        /**
         * @see Alpaca.Field#enable
         */
        enable: function() {
            this.field.disabled = false;
        },

        /**
         * @see Alpaca.Field#focus
         */
        focus: function() {
            this.field.focus();
        },

        /**
         * @see Alpaca.ControlField#onClick
         */
        onClick: function(e) {
        },

        /**
         * @see Alpaca.Field#getTitle
         */
        getTitle: function() {
            return "Button Field";
        },

        /**
         * @see Alpaca.Field#getDescription
         */
        getDescription: function() {
            return "Common Button Field.";
        },

        /**
         * @see Alpaca.Field#getType
         */
        getType: function() {
            return "any";
        }
    });

    Alpaca.registerTemplate("controlFieldButton", '<button type="${type}" id="${id}" {{if options.readonly}}readonly="readonly"{{/if}} {{if options.formName}}name="${options.formName}"{{/if}} {{if value}}value="${value}"{{/if}} {{each(i,v) options.data}}data-${i}="${v}"{{/each}}>{{if label}}${label}{{else}}{{if value}}${value}{{/if}}{{/if}}</button>');
    Alpaca.registerFieldClass("button", Alpaca.Fields.ButtonField);

})(jQuery);
