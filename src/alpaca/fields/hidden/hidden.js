(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["alpaca/Alpaca", "jquery"], factory);
    } else {
        factory(window.Alpaca, window.$);
    }
}(this, function (Alpaca, $) {

    /**
     * @lends Alpaca.Fields.ControlField.prototype
     *
     * @constructs
     * @augments Alpaca.ControlField
     *
     * @class Basic Control for Hidden field
     */
    Alpaca.Fields.HiddenField = Alpaca.ControlField.extend({

        /**
         * @see Alpaca.Field#setup
         */
        setup: function() {
            this.base();

            if (!this.options.size) {
                this.options.size = 40;
            }

            this.controlFieldTemplateDescriptor = this.view.getTemplateDescriptor("controlFieldHidden");
        },

        /**
         * @see Alpaca.ControlField#renderField
         */
        renderField: function(onSuccess) {

            var _this = this;

            if (this.controlFieldTemplateDescriptor) {

                this.field = _this.view.tmpl(this.controlFieldTemplateDescriptor, {
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
         * @see Alpaca.ControlField#postRender
         */
        postRender: function(callback) {

            var self = this;

            this.base(function() {

                if (self.fieldContainer) {
                    self.fieldContainer.addClass('alpaca-controlfield-hidden');
                }

                callback();
            });

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
         * @see Alpaca.Field#getTitle
         */
        getTitle: function() {
            return "Hidden";
        },
        
        /**
         * @see Alpaca.Field#getDescription
         */
        getDescription: function() {
            return "Field for a hidden HTML input";
        },
        
        /**
         * @see Alpaca.Field#getType
         */
        getType: function() {
            return "string";
        },
		
        /**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function() {
            return "hidden";
        }//__END_OF_BUILDER_HELPERS
        
    });

    Alpaca.registerTemplate("controlFieldHidden", '<input type="hidden" id="${id}" {{if name}}name="${name}"{{/if}} {{each(i,v) options.data}}data-${i}="${v}"{{/each}}/>');
    Alpaca.registerFieldClass("hidden", Alpaca.Fields.HiddenField);

    return Alpaca.Fields.HiddenField;

}));
