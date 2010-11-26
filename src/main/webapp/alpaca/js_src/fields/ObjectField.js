(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Default control for the treatment of a JSON object.
     */
    Alpaca.Fields.ObjectField = Alpaca.ContainerField.extend({
    
        /**
         * @Override
         *
         * Pick apart the data object and set onto child fields.
         *
         * Data must be an object.
         */
        setValue: function(data, stopUpdateTrigger) {
            if (!data || !Alpaca.isObject(data)) {
                return;
            }
            
            // clear all controls
            Alpaca.each(this.children, function() {
                this.clear();
            });
            
            // set fields
			for (var fieldId in this.childrenById) {
				var propertyId = this.childrenById[fieldId].propertyId;
                var _data = Alpaca.traverseObject(data, propertyId);
                if (_data) {
                    var childField = this.childrenById[fieldId];
                    childField.setValue(_data);
                }
            }
        },
        
        /**
         * @Override
         *
         * Reconstruct the data object from the child fields.
         */
        getValue: function() {
            var o = {};
            
            for (var i = 0; i < this.children.length; i++) {
                var fieldId = this.children[i].getId();
                var propertyId = this.children[i].propertyId;
                var fieldValue = this.children[i].getValue();
                //o[fieldId] = fieldValue;
				o[propertyId] = fieldValue;
            }
            
            return o;
        },

        /**
         * @Override
         *
         * Adds item
         */
        addItem: function(propertyId, fieldSetting, value, insertAfterId) {
            var _this = this;
            var itemSchema;
            if (_this.schema && _this.schema.properties && _this.schema.properties[propertyId]) {
                itemSchema = _this.schema.properties[propertyId];
            }
            var containerElem = _this.renderItemContainer(insertAfterId);
            Alpaca(containerElem, value, fieldSetting, itemSchema, this.getView(), function(fieldControl) {
                // render
                fieldControl.render();
                containerElem.attr("id", fieldControl.getId() + "-item-container");
                containerElem.attr("alpaca-id", fieldControl.getId());
                // add the property Id
                fieldControl.propertyId = propertyId;
                // remember the control
                _this.addChild(fieldControl);
                if (insertAfterId) {
					_this.renderValidationState();
				}
            });
        },
        
        /**
         * @Override
         *
         * Renders all properties
         * 
         * We need to validate data against schema before rendering if schema 
         * is present. 
         * 
         */
        renderItems: function() {
            var _this = this;
			var properties = _this.data;
			if ( _this.schema && _this.schema.properties ) {
				properties =  _this.schema.properties;
			}
            for (var propertyId in properties) {
                if (properties.hasOwnProperty(propertyId)) {
                    var fieldSetting;
                    if (_this.settings && _this.settings.fields && _this.settings.fields[propertyId]) {
                        fieldSetting = _this.settings.fields[propertyId];
                    }
					var itemData = null;
					if (_this.data) {
						itemData = _this.data[propertyId];
					} 
                    _this.addItem(propertyId, fieldSetting, itemData);
                }
            }
			this.renderValidationState();
        },
    });
    
    Alpaca.registerFieldClass("object", Alpaca.Fields.ObjectField);
    Alpaca.registerDefaultSchemaFieldMapping("object", "object");
})(jQuery);
