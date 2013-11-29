(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["alpaca/Alpaca", "jquery"], factory);
    } else {
        factory(window.Alpaca, window.$);
    }
}(this, function (Alpaca, $) {

    /**
     * @lends Alpaca.Fields.AnyField.prototype
     *
     * @constructs
     * @augments Alpaca.ControlField
     *
     * @class Basic field control for JSON schema any type. This control should be used with additional options parameter
     * for combo fields. Without options parameter it will simply render a text field.
     */
    Alpaca.Fields.AnyField = Alpaca.ControlField.extend({

        /**
         * @see Alpaca.Field#setup
         */
        setup: function() {
            this.base();

            this.controlFieldTemplateDescriptor = this.view.getTemplateDescriptor("controlFieldAny");
        },

        /**
         * @see Alpaca.ControlField#renderField
         */
        renderField: function(onSuccess) {

            if (this.controlFieldTemplateDescriptor) {
                this.field = this.view.tmpl(this.controlFieldTemplateDescriptor, {
                    "id": this.getId(),
                    "name": this.name,
                    "options": this.options
                });
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
            return this.field.val();
        },

        /**
         * @see Alpaca.Field#setValue
         */
        setValue: function(value) {
            if (Alpaca.isEmpty(value)) {
                this.field.val("");
            } else {
                this.field.val(value);
            }
            // be sure to call into base method
            this.base(value);
        },

        /**
         * @see Alpaca.ControlField#handleValidate
         */
        handleValidate: function() {
            var baseStatus = this.base();
            return baseStatus;
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
        },//__BUILDER_HELPERS

        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ControlField#getOptionsForSchema
         */
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ControlField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                }
            });
        },

        /**
         * @see Alpaca.Field#getTitle
         */
        getTitle: function() {
            return "Any Field";
        },

        /**
         * @see Alpaca.Field#getDescription
         */
        getDescription: function() {
            return "Any field.";
        },

        /**
         * @see Alpaca.Field#getType
         */
        getType: function() {
            return "any";
        },

        /**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function() {
            return "any";
        }//__END_OF_BUILDER_HELPERS
    });

    Alpaca.registerTemplate("controlFieldAny", '<input type="text" id="${id}" size="40" {{if options.readonly}}readonly="readonly"{{/if}} {{if name}}name="${name}"{{/if}} {{each(i,v) options.data}}data-${i}="${v}"{{/each}}/>');
    Alpaca.registerFieldClass("any", Alpaca.Fields.AnyField);
    Alpaca.registerDefaultSchemaFieldMapping("any", "any");

    return Alpaca.Fields.AnyField;

}));
