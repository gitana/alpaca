(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.SelectField = Alpaca.Fields.ListField.extend(
    /**
     * @lends Alpaca.Fields.SelectField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.ListField
         *
         * @class Dropdown list control for list type.
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
         * @see Alpaca.Field#getValue
         */
        getValue: function() {
            if (this.field) {
                return this.base(this.field.val());
            }
        },

        /**
         * @see Alpaca.Field#setValue
         */
        setValue: function(val) {
            if (Alpaca.isArray(val)) {
                if (!Alpaca.compareArrayContent(val, this.getValue())) {
                    this.base(val);
                }
            } else {
                if (val != this.getValue()) {
                    this.base(val);
                }
            }
        },

        /**
         * @private
         */
        _renderField: function(onSuccess) {

            var controlFieldTemplate;

            if (this.options.multiple && Alpaca.isArray(this.data)) {
                controlFieldTemplate = this.view.getTemplate("controlFieldSelectMultiple");
            } else {
                controlFieldTemplate = this.view.getTemplate("controlFieldSelect");
            }

            if (controlFieldTemplate) {
                this.field = $.tmpl(controlFieldTemplate, {
                    "id": this.getId(),
                    "options": this.options,
                    "required": this.schema.required,
                    "selectOptions": this.selectOptions,
                    "data": this.data
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
        postRender: function() {
            this.base();
            if (this.fieldContainer) {
                this.fieldContainer.addClass('alpaca-controlfield-select');
            }
        },

        /**
         * @see Alpaca.Field#onChange
         */
        onChange: function(e) {
            this.base(e);

            var _this = this;

            Alpaca.later(25, this, function() {
                var v = _this.getValue();
                _this.setValue(v);
                _this.renderValidationState();
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.ListField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "multiple": {
                        "title": "Mulitple Selection",
                        "description": "Allow multiple selection if true",
                        "type": "boolean",
                        "default": false
                    },
                    "size": {
                        "title": "Displayed Options",
                        "description": "Number of options to be shown",
                        "type": "number"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.ListField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "multiple": {
                        "rightLabel": "Allow mulitple selection ?",
                        "helper": "Allow multiple selection if checked",
                        "type": "checkbox"
                    },
                    "size": {
                        "type": "integer"
                    }
                }
            });
        },

        /**
         * @see Alpaca.Field#getTitle
         */
        getTitle: function() {
            return "Dropdown Select";
        },

        /**
         * @see Alpaca.Field#getDescription
         */
        getDescription: function() {
            return "Dropdown select field.";
        },

        /**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function() {
            return "select";
        }

    });

    Alpaca.registerTemplate("controlFieldSelect", '<select id="${id}" {{if options.readonly}}readonly="readonly"{{/if}} {{if options.multiple}}multiple{{/if}} {{if options.size}}size="${options.size}"{{/if}} {{if options.name}}name="${options.name}"{{/if}}>{{if !required}}<option value="">None</option>{{/if}}{{each(i,value) selectOptions}}<option value="${value}" {{if value == data}}selected="selected"{{/if}}>${text}</option>{{/each}}/></select>');
    Alpaca.registerTemplate("controlFieldSelectMultiple", '<select id="${id}" {{if options.readonly}}readonly="readonly"{{/if}} {{if options.multiple}}multiple{{/if}} {{if options.size}}size="${options.size}"{{/if}} {{if options.name}}name="${options.name}"{{/if}}>{{if !required}}<option value="">None</option>{{/if}}{{each(i,value) selectOptions}}<option value="${value}" {{each(j,val) data}}{{if value == val}}selected="selected"{{/if}}{{/each}}>${text}</option>{{/each}}/></select>');
    Alpaca.registerFieldClass("select", Alpaca.Fields.SelectField);

})(jQuery);
