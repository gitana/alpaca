(function($){

    var Alpaca = $.alpaca;

    Alpaca.Fields.RadioField = Alpaca.Fields.ListField.extend(
    /**
     * @lends Alpaca.Fields.RadioField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.ListField
         *
         * @class Radio group control for list type.
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
         * @see Alpaca.Fields.ListField#setup
         */
        setup: function(){
            this.base();
            
            if (this.options.name) {
				this.name = this.options.name;
			}
			else if (!this.name) {
				this.name = this.getId()+"-name";
			}

            // empty select first to false by default
            if (Alpaca.isUndefined(this.options.emptySelectFirst))
            {
                this.options.emptySelectFirst = false;
            }
        },

        /**
         * @see Alpaca.Field#getValue
         */
        getValue: function(){
            var val = this.base($('input:radio[name='+this.name+']:checked',this.field).val());
            $.each(this.selectOptions,function() {
                if (String(this['value']) ==  val) {
                    val = this['value'];
                }
            });
            return val;
        },
        
        /**
         * @see Alpaca.Field#setValue
         */
        setValue: function(val){
            if (val != this.getValue()) {
                $.each($('input:radio[name='+this.name+']',this.field),function() {
                    if ($(this).val() == val) {
                        $(this).attr('checked','checked');
                    } else {
                        $(this).removeAttr('checked');
                    }
                });

                if (this.options.emptySelectFirst) {
                    if ($("input:radio:checked",this.field).length === 0) {
                        $("input:radio:first",this.field).attr("checked","checked");
                    }
                }

                this.base(val);
            }
        },
        
        /**
         * @private
         */
        _renderField: function(onSuccess){

            var _this = this;

            var controlFieldTemplateDescriptor = this.view.getTemplateDescriptor("controlFieldRadio");
            if (controlFieldTemplateDescriptor) {
                this.field = _this.view.tmpl(controlFieldTemplateDescriptor, {
                    "id": this.getId(),
                    "options": this.options,
                    "selectOptions": this.selectOptions,
                    "required":this.schema.required,
					"name": this.name,
                    "data": this.data
                });

                // if emptySelectFirst and nothing currently checked, then pick first item in the value list
                // set data and visually select it
                if (this.options.emptySelectFirst && this.selectOptions && this.selectOptions.length > 0) {

                    this.data = this.selectOptions[0].value;

                    if ($("input:radio:checked",this.field).length === 0) {
                        $("input:radio:first",this.field).attr("checked","checked");
                    }
                }

                // stack radio selectors vertically
                if (this.options.vertical)
                {
                    $(".alpaca-controlfield-radio-item", this.field).css("display", "block");
                }

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
				this.fieldContainer.addClass('alpaca-controlfield-radio');
			}
        },
        
        /**
         * @see Alpaca.ControlField#onClick
         */
        onClick: function(e){
            this.base(e);
            
            var _this = this;
            
            Alpaca.later(25, this, function(){
                var v = _this.getValue();
                _this.setValue(v);
                _this.renderValidationState();
            });
        },//__BUILDER_HELPERS
		
        /**
         * @private
         * @see Alpaca.Fields.ListField#getSchemaOfOptions
         */
		getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(),{
				"properties": {
					"name": {
						"title": "Field name",
						"description": "Field name.",
						"type": "string"
					},
                    "emptySelectFirst": {
                        "title": "Empty Select First",
                        "description": "If the data is empty, then automatically select the first item in the list.",
                        "type": "boolean",
                        "default": false
                    },
                    "vertical": {
                        "title": "Position the radio selector items vertically",
                        "description": "When true, the radio selector items will be stacked vertically and not horizontally",
                        "type": "boolean",
                        "default": false
                    }
				}
			});
        },
        
		/**
         * @see Alpaca.Field#getTitle
		 */
		getTitle: function() {
			return "Radio Group Field";
		},
		
		/**
         * @see Alpaca.Field#getDescription
		 */
		getDescription: function() {
			return "Radio Group Field with list of options.";
		},

		/**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function() {
            return "radio";
        }//__END_OF_BUILDER_HELPERS
        
    });
    
    Alpaca.registerTemplate("controlFieldRadio", '<div id="${id}" class="alpaca-controlfield-radio">{{if !required}}<span class="alpaca-controlfield-radio-item"><input type="radio" {{if options.readonly}}readonly="readonly"{{/if}} name="${name}" value=""/><span class="alpaca-controlfield-radio-label">None</span></span>{{/if}}{{each selectOptions}}<span class="alpaca-controlfield-radio-item"><input type="radio" {{if options.readonly}}readonly="readonly"{{/if}} name="${name}" value="${value}" {{if value == data}}checked="checked"{{/if}}/><span class="alpaca-controlfield-radio-label">${text}</span></span>{{/each}}</div>');
    Alpaca.registerFieldClass("radio", Alpaca.Fields.RadioField);
    
})(jQuery);
