(function($){

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
        setValue: function(data, stopUpdateTrigger){
            if (!data || !Alpaca.isObject(data)) {
                return;
            }
            
            // clear all controls
            Alpaca.each(this.children, function(){
                this.clear();
            });
            
            // set fields
            for (var fieldId in this.childrenById) {
                var _data = Alpaca.traverseObject(data, fieldId);
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
        getValue: function(){
            var o = {};
            
            for (var i = 0; i < this.children.length; i++) {
                var fieldId = this.children[i].getId();
                
                var fieldValue = this.children[i].getValue();
                o[fieldId] = fieldValue;
            }
            
            return o;
        },
        
         renderItemContainer: function(insertAfterId){
            var itemContainerTemplate = Alpaca.getTemplate("itemContainer", this, null, this.mode);
            if (itemContainerTemplate) {
                var containerElem = $.tmpl(itemContainerTemplate, {});
                if (insertAfterId) {
                    $('#' + insertAfterId + '-item-container', this.outerEl).after(containerElem);
                }
                else {
                    containerElem.appendTo(this.fieldContainer);
                }
                return containerElem;
            }
            else {
                return this.outerEl;
            }
        },
		       
        addItem: function(propertyId, fieldSetting, value, insertAfterId){
            var _this = this;
            var itemSchema;
            if (_this.schema && _this.schema.properties && _this.schema.properties[propertyId]) {
                itemSchema = _this.schema.properties[propertyId];
            }
            var containerElem = _this.renderItemContainer(insertAfterId);
            Alpaca(containerElem, value, fieldSetting, itemSchema, function(fieldControl){
                // render
                fieldControl.render(_this.getMode());
                containerElem.attr("id", fieldControl.getId() + "-item-container");
                containerElem.attr("alpaca-id", fieldControl.getId());
                // remember the control
                _this.addChild(fieldControl);
                
                _this.renderValidationState();
            });
        },
        /**
         * To be overridden
         */
        renderField: function(onSuccess){
            var _this = this;
            
			this.prepItemsContainer();
			
            for (var propertyId in _this.data) {
                if (_this.data.hasOwnProperty(propertyId)) {
                    var fieldSetting;
                    if (_this.settings && _this.settings.fields && _this.settings.properties[propertyId]) {
                        fieldSetting = _this.settings.properties[propertyId];
                    }
                    _this.addItem(propertyId, fieldSetting, _this.data[propertyId]);
                }
            }
            
            // call onSuccess handler
            onSuccess();
        },
    });
    
    Alpaca.registerFieldClass("object", Alpaca.Fields.ObjectField);
    Alpaca.registerDefaultSchemaFieldMapping("object", "object");
})(jQuery);
