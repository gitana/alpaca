(function($){

    var Alpaca = $.alpaca;
    
    /**
     * Default control for the treatment of a JSON array.
     */
    Alpaca.Fields.ArrayField = Alpaca.ContainerField.extend({
    
        /**
         * @Override
         *
         * Pick apart the array and set onto child fields.
         *
         * Data must be an array.
         */
        setValue: function(data){
            if (!data || !Alpaca.isArray(data)) {
                return;
            }
            
            // clear all controls
            Alpaca.each(this.children, function(){
                this.clear();
            });
            
            // set fields
            for (var i = 0; i < this.children.length; i++) {
                var childField = this.children[i];
                if (data.length < i) {
                    childField.setValue(data[fieldId]);
                }
            }
        },
        
        /**
         * @Override
         *
         * Reconstruct the data object from the child fields.
         */
        getValue: function(){
            var o = [];
            
            for (var i = 0; i < this.children.length; i++) {
                var v = this.children[i].getValue();
                o.push(v);
            }
            
            return o;
        },
        
        getSize: function(){
            return this.children.length;
        },
        
        renderItemContainer: function(insertAfterId){
            var itemContainerTemplate = Alpaca.getTemplate("itemContainer", this, null, this.mode);
            if (itemContainerTemplate) {
                var containerElem = $.tmpl(itemContainerTemplate, {});
                if (insertAfterId) {
                    $('#' + insertAfterId + '-item-container', this.outerEl).after(containerElem);
                }
                else {
                    containerElem.appendTo(this.outerEl);
                }
                return containerElem;
            }
            else {
                return _this.outerEl;
            }
        },
        
        moveItem: function(fromId, isUp){
            var _this = this;
            if (this.childrenById[fromId]) {
                // do the loop
                $.each(this.children, function(index, val){
                    if (val.getId() == fromId) {
                        var toIndex;
                        if (isUp == true) {
                            toIndex = index - 1;
                            if (toIndex < 0) {
                                toIndex = _this.children.length - 1;
                            }
                        }
                        else {
                            toIndex = index + 1;
                            if (toIndex >= _this.children.length) {
                                toIndex = 0;
                            }
                        }
                        if (_this.children[toIndex]) {
                            var toId = _this.children[toIndex].getId();
                            var fromContainer = $('#' + fromId + '-item-container');
                            var toContainer = $('#' + toId + '-item-container');
                            _this.reRenderItem(_this.children[index], toContainer);
                            _this.reRenderItem(_this.children[toIndex], fromContainer);
                            var tmp = _this.children[index];
                            _this.children[index] = _this.children[toIndex];
                            _this.children[toIndex] = tmp;
                            return false;
                        }
                    }
                });
            }
        },
        
        removeItem: function(id){
            this.children = $.grep(this.children, function(val, index){
                return (val.getId() != id);
            });
            delete this.childrenById[id];
            $('#' + id + "-item-container", this.outerEl).remove();
            this.renderValidationState();
        },
        
        renderToolbar: function(containerElem){
            var _this = this;
            var id = containerElem.attr('alpaca-id');
            var fieldControl = this.childrenById[id];
            var itemToolbarTemplate = Alpaca.getTemplate("arrayItemToolbar", this, null, this.mode);
            if (itemToolbarTemplate) {
                var toolbarElem = $.tmpl(itemToolbarTemplate, {
                    "id": id
                });
                if (toolbarElem.attr("id") == null) {
                    toolbarElem.attr("id", id + "-item-toolbar");
                }
                // add actions to toolbar buttons
                if (_this._validateEqualMaxItems()) {
                    $('.alpaca-item-toolbar-add', toolbarElem).removeClass('alpaca-item-toolbar-disabled');
                    $('.alpaca-item-toolbar-add', toolbarElem).click(function(){
                        _this.addItem(containerElem.index() + 1, null, fieldControl.getValue(), id);
                    });
                }
                else {
                    $('.alpaca-item-toolbar-add', toolbarElem).addClass('alpaca-item-toolbar-disabled');
                }
                if (_this._validateEqualMinItems()) {
                    $('.alpaca-item-toolbar-remove', toolbarElem).removeClass('alpaca-item-toolbar-disabled');
                    $('.alpaca-item-toolbar-remove', toolbarElem).click(function(){
                        _this.removeItem(id);
                    });
                }
                else {
                    $('.alpaca-item-toolbar-remove', toolbarElem).addClass('alpaca-item-toolbar-disabled');
                }
                $('.alpaca-item-toolbar-up', toolbarElem).click(function(){
                    _this.moveItem(id, true);
                });
                $('.alpaca-item-toolbar-down', toolbarElem).click(function(){
                    _this.moveItem(id, false);
                });
                toolbarElem.prependTo(containerElem);
            }
            
        },
        
        reRenderItem: function(fieldControl, newContainer){
            fieldControl.container = newContainer;
            fieldControl.render(this.getMode());
            newContainer.attr("id", fieldControl.getId() + "-item-container");
            newContainer.attr("alpaca-id", fieldControl.getId());
            
            $(".alpaca-item-toolbar", newContainer).remove();
        },
        
        addItem: function(index, fieldSetting, value, insertAfterId){
            var _this = this;
            if (_this._validateEqualMaxItems()) {
				var itemSchema;
				if (_this.schema && _this.schema.items) {
					itemSchema = _this.schema.items;
				}
				var containerElem = _this.renderItemContainer(insertAfterId);
				Alpaca(containerElem, value, fieldSetting, itemSchema, function(fieldControl){
					// render
					fieldControl.render(_this.getMode());
					containerElem.attr("id", fieldControl.getId() + "-item-container");
					containerElem.attr("alpaca-id", fieldControl.getId());
					// remember the control
					_this.addChild(fieldControl, index);
					
					containerElem.hover(function(){
						// add control toolbar
						_this.renderToolbar(containerElem);
					}, function(){
						// remove control toolbar
						$(".alpaca-item-toolbar", containerElem).remove();
					});
					_this.renderValidationState();
				});
			}
        },
        /**
         * To be overridden
         */
        renderField: function(onSuccess){
            var _this = this;
            
            $.each(this.data, function(index, value){
                var fieldSetting;
                if (_this.settings && _this.settings.fields && _this.settings.fields[index]) {
                    fieldSetting = _this.settings.fields[index];
                }
                _this.addItem(index, fieldSetting, value);
            });
            // call onSuccess handler
            onSuccess();
        },

        _validateEqualMaxItems: function(){
            if (this.schema.items && this.schema.items.maxItems) {
                if (this.getSize() >= this.schema.items.maxItems) {
                    return false;
                }
            }
            return true;
        },

        _validateEqualMinItems: function(){
            if (this.schema.items && this.schema.items.minItems) {
                if (this.getSize() <= this.schema.items.minItems) {
                    return false;
                }
            }
            return true;
        },
				        
        _validateMinItems: function(){
            if (this.schema.items && this.schema.items.minItems) {
                if (this.getSize() < this.schema.items.minItems) {
                    return false;
                }
            }
            return true;
        },
        
        _validateMaxItems: function(){
            if (this.schema.items && this.schema.items.maxItems) {
                if (this.getSize() > this.schema.items.maxItems) {
                    return false;
                }
            }
            return true;
        },
        
        _validateUniqueItems: function(){
            if (this.schema.items && this.schema.uniqueItems) {
                var hash = {};
                for (var i = 0, l = this.children.length; i < l; ++i) {
                    if (!hash.hasOwnProperty(this.children[i])) {
                        hash[this.children[i]] = true;
                    }
                    else {
                        return false;
                    }
                }
            }
            return true;
        },
        
        handleValidate: function(){
            if (!this._validateMinItems()) {
                return false;
            }
            
            if (!this._validateMaxItems()) {
                return false;
            }
            
            if (!this._validateUniqueItems()) {
                return false;
            }
            
            // hand off to parent to validate
            return this.base();
        },
        /**
         * @Override
         */
        getValidationStateMessage: function(state){
            if (state == Alpaca.STATE_INVALID) {
                if (!this._validateUniqueItems()) {
                    return Alpaca.getMessage("valueNotUnique", this);
                }
                
                if (!this._validateMaxItems()) {
                    return Alpaca.substituteTokens(Alpaca.getMessage("tooManyItems", this), [this.schema.maxItems]);
                }
                
                if (!this._validateMinItems()) {
                    return Alpaca.substituteTokens(Alpaca.getMessage("notEnoughItems", this), [this.schema.minItems]);
                }
            }
            
            return this.base(state);
        }
    });
    
    Alpaca.registerTemplate("arrayItemToolbar", '<div class="alpaca-item-toolbar"><span class="alpaca-item-toolbar-icon alpaca-item-toolbar-add" title="Add"></span><span class="alpaca-item-toolbar-icon alpaca-item-toolbar-remove" title="Remove"></span><span class="alpaca-item-toolbar-icon alpaca-item-toolbar-up" title="Move Up"></span><span class="alpaca-item-toolbar-icon alpaca-item-toolbar-down" title="Move Down"></span></div>');
    
    Alpaca.registerMessages({
        "notEnoughItems": "The minimum number of values is {0}",
        "tooManyItems": "The maximum number of values is {0}",
        "valueNotUnique": "Values are not unique",
        "notAnArray": "This value is not an Array"
    });
    Alpaca.registerFieldClass("array", Alpaca.Fields.ArrayField);
    Alpaca.registerDefaultSchemaFieldMapping("array", "array");
    
})(jQuery);
