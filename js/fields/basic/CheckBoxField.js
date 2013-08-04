(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.CheckBoxField = Alpaca.ControlField.extend(
        /**
         * @lends Alpaca.Fields.CheckBoxField.prototype
         */
        {
            /**
             * @constructs
             * @augments Alpaca.ControlField
             *
             * @class Checkbox control for JSON schema boolean type.
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

                if (!this.options.rightLabel) {
                    this.options.rightLabel = "";
                }
            },

            /**
             * Handler for the event that the checkbox is clicked.
             *
             * @param e Event.
             */
            onClick: function(e) {
                this.renderValidationState();
            },

            /**
             * @see Alpaca.ControlField#renderField
             */
            renderField: function(onSuccess) {

                var _this = this;

                var controlFieldTemplateDescriptor = this.view.getTemplateDescriptor("controlFieldCheckbox");

                if (controlFieldTemplateDescriptor) {
                    this.field = _this.view.tmpl(controlFieldTemplateDescriptor, {
                        "id": this.getId(),
                        "name": this.name,
                        "options": this.options
                    });
                    this.injectField(this.field);
                    this.field = $('input[id="' + this.getId() + '"]', this.field);

                    // do this little trick so that if we have a default value, it gets set during first render
                    // this causes the checked state of the control to update
                    if (this.data) {
                        this.setValue(true);
                    }
                }

                if (onSuccess) {
                    onSuccess();
                }
            },

            /**
             * @see Alpaca.ControlField#postRender
             */
            postRender: function() {
                this.base();
                if (this.fieldContainer) {
                    this.fieldContainer.addClass('alpaca-controlfield-checkbox');
                }
            },

            /**
             * @see Alpaca.Field#getValue
             */
            getValue: function() {
                //return this.field.attr("checked") ? true : false;
                return Alpaca.checked(this.field);
            },

            /**
             * @see Alpaca.Field#setValue
             */
            setValue: function(value) {
                // convert string value to boolean
                if (Alpaca.isString(value)) {
                    value = (value === "true");
                }

                Alpaca.checked(this.field, value);

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
            },//__BUILDER_HELPERS

            /**
             * @private
             * @see Alpaca.ControlField#getSchemaOfOptions
             */
            getSchemaOfOptions: function() {
                return Alpaca.merge(this.base(), {
                    "properties": {
                        "rightLabel": {
                            "title": "Option Label",
                            "description": "Optional right-hand side label for checkbox field.",
                            "type": "string"
                        }
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
                        "rightLabel": {
                            "type": "text"
                        }
                    }
                });
            },

            /**
             * @see Alpaca.Field#getTitle
             */
            getTitle: function() {
                return "Checkbox Field";
            },

            /**
             * @see Alpaca.Field#getDescription
             */
            getDescription: function() {
                return "Checkbox Field for boolean data.";
            },

            /**
             * @see Alpaca.Field#getType
             */
            getType: function() {
                return "boolean";
            },

            /**
             * @see Alpaca.Field#getFieldType
             */
            getFieldType: function() {
                return "checkbox";
            }//__END_OF_BUILDER_HELPERS

        });

    Alpaca.registerTemplate("controlFieldCheckbox", '<span><input type="checkbox" id="${id}" {{if options.readonly}}readonly="readonly"{{/if}} {{if name}}name="${name}"{{/if}} {{each(i,v) options.data}}data-${i}="${v}"{{/each}}/>{{if options.rightLabel}}<label for="${id}">${options.rightLabel}</label>{{/if}}</span>');

    Alpaca.registerFieldClass("checkbox", Alpaca.Fields.CheckBoxField);
    Alpaca.registerDefaultSchemaFieldMapping("boolean", "checkbox");
})(jQuery);
