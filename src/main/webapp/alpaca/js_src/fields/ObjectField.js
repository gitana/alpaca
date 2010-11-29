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
			if (_this.schema && _this.schema.properties) {
				properties = _this.schema.properties;
			}
			for (var propertyId in properties) {
				var fieldSetting = {};
				if (_this.settings && _this.settings.fields && _this.settings.fields[propertyId]) {
					fieldSetting = _this.settings.fields[propertyId];
				}
				var itemData = null;
				if (_this.data) {
					itemData = _this.data[propertyId];
				}
				_this.addItem(propertyId, fieldSetting, itemData);
			}
			// loop through all items to check their dependencies
			for (var propertyId in properties) {
				if (_this.schema && _this.schema.properties && _this.schema.properties[propertyId]) {
					var itemSchema = _this.schema.properties[propertyId];
					var itemDependencies = itemSchema.dependencies;
					if (itemDependencies) {
						if (Alpaca.isString(itemDependencies)) {
							this.enableDependency(propertyId,itemDependencies);
						} else if (Alpaca.isArray(itemDependencies)) {
							$.each(itemDependencies,function (index, value) {
								_this.enableDependency(propertyId,value);
							})
						}
					}
				}
			}
			this.renderValidationState();
		},
		
		/**
		 * 
		 * @param {Object} propertyId
		 * @param {Object} dependency
		 */
		getDependencyStatus: function (propertyId,dependency) {
			var shouldShow = !Alpaca.isValEmpty(this.childrenByPropertyId[dependency].data);
			var itemDependencySettings = this.childrenByPropertyId[propertyId].settings.dependencies;
			if (shouldShow && itemDependencySettings) {
				if (itemDependencySettings[dependency] && (itemDependencySettings[dependency] != this.childrenByPropertyId[dependency].data)) {
					shouldShow = false;
				}
			}
			return shouldShow;
		},
				
		/**
		 * Displays or hides item depending on status of its dependencies
		 * 
		 * @param {Object} propertyId
		 */
		renderDependency: function(propertyId) {
			var item = this.childrenByPropertyId[propertyId];
			var itemDependencies = item.schema.dependencies;
			if (itemDependencies) {
				if (Alpaca.isString(itemDependencies)) {
					if (this.getDependencyStatus (propertyId,itemDependencies)) {
						item.show();
					} else {
						item.hide();
					}
				} else if (Alpaca.isArray(itemDependencies)) {
					
					var shouldShow = true;
					var _this = this;
					$.each(itemDependencies, function(index, value) {
						shouldShow = shouldShow && _this.getDependencyStatus (propertyId,value);
					});
					
					if (shouldShow) {
						item.show();
					} else {
						item.hide();
					}
				}
			}
		},
		
		/**
		 * Enable item dependency
		 * 
		 * @param {Object} dependency
		 */
		enableDependency: function(propertyId,dependency) {
			if (this.childrenByPropertyId[propertyId]) {
				this.renderDependency(propertyId);
				// do the binding
				var _this = this;
				$(this.childrenByPropertyId[dependency].getEl()).bind("fieldupdate", function(event) {
					_this.renderDependency(propertyId);
				});
			}
		}		
	});
    
    Alpaca.registerFieldClass("object", Alpaca.Fields.ObjectField);
    Alpaca.registerDefaultSchemaFieldMapping("object", "object");
})(jQuery);
