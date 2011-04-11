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
         */
        constructor: function(container, data, options, schema, view, connector) {
            this.base(container, data, options, schema, view, connector);
        },

        /**
         * @see Alpaca.Fields.ListField#setup
         */
        setup: function(){
            this.base();
            
            if (this.options.name) {
				this.name = this.options.name;
			}
			else {
				this.name = this.getId()+"-name";
			}
        },
		        
        /**
         * @see Alpaca.Field#getValue
         */
        getValue: function(){
            return $('input:radio[name='+this.name+']:checked',this.field).val();
        },
        
        /**
         * @see Alpaca.Field#setValue
         */
        setValue: function(val){
            if (val != this.getValue()) {
                this.base(val);
            }
        },
        
        /**
         * @private
         */
        _renderField: function(onSuccess){            
            var controlFieldTemplate = this.view.getTemplate("controlFieldRadio");
            
            if (controlFieldTemplate) {
                this.field = $.tmpl(controlFieldTemplate, {
                    "id": this.getId(),
                    "options": this.options,
                    "selectOptions": this.selectOptions,
                    "required":this.schema.required,
					"name": this.name,
                    "data": this.data
                });
                if ($("input:radio:checked",this.field).length == 0) {
                	$("input:radio:first",this.field).attr("checked","checked");
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
        },
		
        /**
         * @private
         * @see Alpaca.Fields.ListField#getSchemaOfOptions
         */
		getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(),{
				"properties": {
					"name": {
						"title": "Field name",
						"description": "Field name",
						"type": "string",
						"readonly": true
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
			return "Radio Group Field.";
		},

		/**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function() {
            return "radio";
        }	
        
    });
    
    Alpaca.registerTemplate("controlFieldRadio", '<div id="${id}" class="alpaca-controlfield-radio">{{if !required}}<input type="radio" {{if options.readonly}}readonly="on"{{/if}} name="${name}" value=""/><span class="alpaca-controlfield-radio-label">None</span>{{/if}}{{each selectOptions}}<input type="radio" {{if options.readonly}}readonly="on"{{/if}} name="${name}" value="${value}" {{if value == data}}checked="checked"{{/if}}/><span class="alpaca-controlfield-radio-label">${text}</span>{{/each}}</div>');
    Alpaca.registerFieldClass("radio", Alpaca.Fields.RadioField);
    
})(jQuery);
