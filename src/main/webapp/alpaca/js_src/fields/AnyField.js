(function($) {

    var Alpaca = $.alpaca;

    /**
     * Basic any field control
     */
    Alpaca.Fields.AnyField = Alpaca.ControlField.extend({

        /**
         * @Override
         *
         */
        setup: function() {
            this.base();

            this.controlFieldTemplate = Alpaca.getTemplate("controlFieldAny", this);
        },

        /**
         * @Override
         *
         * Renders an INPUT control into the field container
         */
        renderField: function(onSuccess) {

            if (this.controlFieldTemplate) {
                this.field = $.tmpl(this.controlFieldTemplate, {
                    "id": this.getId(),
                    "options": this.options
                });
                this.injectField(this.field);
            }

            if (onSuccess) {
                onSuccess();
            }
        },

        /**
         * @Override
         */
        postRender: function() {
            this.base();
        },


        /**
         * @Override
         *
         * Return the value of the input control
         */
        getValue: function() {
            return this.field.val();
        },

        /**
         * @Override
         *
         * Set value onto the input contorl
         */
        setValue: function(value, stopUpdateTrigger) {
            if (Alpaca.isEmpty(value)) {
                this.field.val("");
            } else {
                this.field.val(value);
            }

            // be sure to call into base method
            this.base(value, stopUpdateTrigger);
        },

        /**
         * @Override
         */
        handleValidate: function() {
            var baseStatus = this.base();
            return baseStatus;
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
        getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                }
            });
        },

        /**
         * @Override
         */
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                }
            });
        },

        /**
         * @Override
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                }
            });
        },

        /**
         * @Override
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                }
            });
        },

        /**
         * @Override
         */
        getTitle: function() {
            return "Any Field";
        },

        /**
         * @Override
         */
        getDescription: function() {
            return "Any field.";
        },

        /**
         * @Override
         */
        getType: function() {
            return "any";
        },

        /**
         * @Override
         */
        getFieldType: function() {
            return "any";
        }

    });

    Alpaca.registerTemplate("controlFieldAny", '<input type="text" id="${id}" size="40" {{if options.readonly}}readonly="on"{{/if}} {{if options.name}}name="${options.name}"{{/if}} {{each(i,v) options.data}}data-${i}="${v}"{{/each}}/>');
    Alpaca.registerFieldClass("any", Alpaca.Fields.AnyField);
    Alpaca.registerDefaultSchemaFieldMapping("any", "any");
})(jQuery);
