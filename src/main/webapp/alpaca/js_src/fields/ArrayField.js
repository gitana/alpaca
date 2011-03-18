(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Default control for the treatment of a JSON array.
     */
    Alpaca.Fields.ArrayField = Alpaca.ContainerField.extend({
    
        /**
         * @Override
         *
         */
        setup: function() {
            this.base();
            if (Alpaca.isEmpty(this.data)) {
                return;
            }
            if (!Alpaca.isArray(this.data)) {
                if (!Alpaca.isString(this.data)) {
                    return;
                } else {
                    try {
                        this.data = $.parseJSON(this.data);
                        if (!Alpaca.isArray(this.data)) {
                            return;
                        }
                    } catch (e) {
                        this.data = [this.data];
                    }
                }
            }
          
            this.options.toolbarStyle = Alpaca.isEmpty(Alpaca.getViewParam('toolbarStyle', this))?"button":Alpaca.getViewParam('toolbarStyle', this);			
        },
        
        /**
         * @Override
         *
         * Pick apart the array and set onto child fields.
         *
         * Data must be an array.
         */
        setValue: function(data) {
        
            if (!data || !Alpaca.isArray(data)) {
                return;
            }
            
            // clear all controls
            //Alpaca.each(this.children, function() {
            //    this.clear();
            //});
            
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
        getValue: function() {
            var o = [];
            
            for (var i = 0; i < this.children.length; i++) {
                var v = this.children[i].getValue();
                o.push(v);
            }
            
            return o;
        },
        
        /**
         * Returns number of children
         */
        getSize: function() {
            return this.children.length;
        },
        
        /**
         * Moves item up or down
         * @param {Object} fromId
         * @param {Object} isUp
         */
        moveItem: function(fromId, isUp) {
            var _this = this;
            if (this.childrenById[fromId]) {
                // do the loop
                $.each(this.children, function(index, val) {
                    if (val.getId() == fromId) {
                        var toIndex;
                        if (isUp == true) {
                            toIndex = index - 1;
                            if (toIndex < 0) {
                                toIndex = _this.children.length - 1;
                            }
                        } else {
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
        
        /**
         * Removes item
         * @param {Object} id
         */
        removeItem: function(id) {
            if (this._validateEqualMinItems()) {
                this.children = $.grep(this.children, function(val, index) {
                    return (val.getId() != id);
                });
                delete this.childrenById[id];
                $('#' + id + "-item-container", this.outerEl).remove();
                this.renderValidationState();
                
                this.updateToolbarItemsStatus();
            }
        },
        
        /**
         * Updates status of toolbar item
         */
        updateToolbarItemsStatus: function() {
            var _this = this;
            // add actions to toolbar buttons
            if (_this._validateEqualMaxItems()) {
                $('.alpaca-fieldset-array-item-toolbar-add', this.outerEl).each(function(index) {
                    //$(this).removeClass('alpaca-fieldset-array-item-toolbar-disabled');
                    $(this).button("enable");
                });
            } else {
                $('.alpaca-fieldset-array-item-toolbar-add', this.outerEl).each(function(index) {
                    //$(this).addClass('alpaca-fieldset-array-item-toolbar-disabled');
                    $(this).button("disable");
                });
            }
            if (_this._validateEqualMinItems()) {
                $('.alpaca-fieldset-array-item-toolbar-remove', this.outerEl).each(function(index) {
                    //$(this).removeClass('alpaca-fieldset-array-item-toolbar-disabled');
                    $(this).button("enable");
                });
            } else {
                $('.alpaca-fieldset-array-item-toolbar-remove', this.outerEl).each(function(index) {
                    //$(this).addClass('alpaca-fieldset-array-item-toolbar-disabled');
                    $(this).button("disable");
                });
            }
            if (this.getSize() == 0) {
                this.renderArrayToolbar(this.outerEl);
            } else {
                /*
				if ($('.alpaca-fieldset-array-toolbar', this.outerEl)) {
                    $('.alpaca-fieldset-array-toolbar', this.outerEl).remove();
                }
                */
				if (this.arrayToolbar) {
					this.arrayToolbar.remove();
				}
            }
            // update counter
            $('.alpaca-item-label-counter', this.outerEl).each(function(index) {
                $(this).html(index + 1);
            });
        },
        
        /**
         * Renders item toolbar
         * @param {Object} containerElem
         */
        renderToolbar: function(containerElem) {
            var _this = this;
            var id = containerElem.attr('alpaca-id');
            var fieldControl = this.childrenById[id];
            var itemToolbarTemplate = Alpaca.getTemplate("arrayItemToolbar", this);
            if (itemToolbarTemplate) {
                var toolbarElem = $.tmpl(itemToolbarTemplate, {
                    "id": id
                });
                if (toolbarElem.attr("id") == null) {
                    toolbarElem.attr("id", id + "-item-toolbar");
                }
                // add actions to toolbar buttons
                /*
                 $('.alpaca-fieldset-array-item-toolbar-add', toolbarElem).removeClass('alpaca-fieldset-array-item-toolbar-disabled');
                 $('.alpaca-fieldset-array-item-toolbar-add', toolbarElem).click(function() {
                 var newContainerElem= _this.addItem(containerElem.index() + 1, null, fieldControl.getValue(), id);
                 _this.enrichElements(newContainerElem);
                 });
                 $('.alpaca-fieldset-array-item-toolbar-remove', toolbarElem).removeClass('alpaca-fieldset-array-item-toolbar-disabled');
                 $('.alpaca-fieldset-array-item-toolbar-remove', toolbarElem).click(function() {
                 _this.removeItem(id);
                 });
                 $('.alpaca-fieldset-array-item-toolbar-up', toolbarElem).click(function() {
                 _this.moveItem(id, true);
                 });
                 $('.alpaca-fieldset-array-item-toolbar-down', toolbarElem).click(function() {
                 _this.moveItem(id, false);
                 });
                 */
                $('.alpaca-fieldset-array-item-toolbar-add', toolbarElem).button({
                    text: false,
                    icons: {
                        primary: "ui-icon-circle-plus"
                    }
                }).click(function() {
					var currentItemVal = fieldControl.getValue();
                    var newContainerElem = _this.addItem(containerElem.index() + 1, null, Alpaca.isValEmpty(currentItemVal)?null:fieldControl.getValue(), id);
                    _this.enrichElements(newContainerElem);
                    //return false;
                });
                $('.alpaca-fieldset-array-item-toolbar-remove', toolbarElem).button({
                    text: false,
                    icons: {
                        primary: "ui-icon-circle-minus"
                    }
                }).click(function() {
                    _this.removeItem(id);
                    //return false;
                });
                $('.alpaca-fieldset-array-item-toolbar-up', toolbarElem).button({
                    text: false,
                    icons: {
                        primary: "ui-icon-circle-arrow-n"
                    }
                }).click(function() {
                    _this.moveItem(id, true);
                    //return false;
                });
                $('.alpaca-fieldset-array-item-toolbar-down', toolbarElem).button({
                    text: false,
                    icons: {
                        primary: "ui-icon-circle-arrow-s"
                    }
                }).click(function() {
                    _this.moveItem(id, false);
                    //return false;
                });
                toolbarElem.hide().prependTo(containerElem);
                containerElem.hover(function() {
                    $('.alpaca-fieldset-array-item-toolbar', this).show();
                }, function() {
                    $('.alpaca-fieldset-array-item-toolbar', this).hide();
                });
            }
            
        },
        
        /**
         * Renders array toolbar
         * @param {Object} containerElem
         */
        renderArrayToolbar: function(containerElem) {
            var _this = this;
            var id = containerElem.attr('alpaca-id');
            var itemToolbarTemplate = Alpaca.getTemplate("arrayToolbar", this);
            if (itemToolbarTemplate) {
                var toolbarElem = $.tmpl(itemToolbarTemplate, {
                    "id": id
                });
                if (toolbarElem.attr("id") == null) {
                    toolbarElem.attr("id", id + "-array-toolbar");
                }
                // add actions to toolbar buttons
				if (this.options.toolbarStyle == "link") {				
					$('.alpaca-fieldset-array-toolbar-add', toolbarElem).click(function() {
						var newContainerElem = _this.addItem(0, null, "", id);
						 _this.enrichElements(newContainerElem);
					});					
				} else {
					$('.alpaca-fieldset-array-toolbar-add', toolbarElem).button({
						icons: {
							primary: "ui-icon-circle-plus"
						}
					}).click(function() {
						_this.addItem(0, null, "", id);
						return false;
					}).wrap('<small></small>');
				}
                toolbarElem.appendTo(containerElem);
				this.arrayToolbar = toolbarElem;
            }
        },
        
        /**
         * Re-renders item
         *
         * @param {Object} fieldControl
         * @param {Object} newContainer
         */
        reRenderItem: function(fieldControl, newContainer) {
            fieldControl.container = newContainer;
            fieldControl.render();
            
            newContainer.attr("id", fieldControl.getId() + "-item-container");
            newContainer.attr("alpaca-id", fieldControl.getId());
            
            $(".alpaca-fieldset-array-item-toolbar", newContainer).remove();
            this.renderToolbar(newContainer);
            this.enrichElements(newContainer);
        },
        
        /**
         * Adds item
         *
         * @param {Object} index
         * @param {Object} fieldSetting
         * @param {Object} value
         * @param {Object} insertAfterId
         */
        addItem: function(index, fieldSetting, value, insertAfterId) {
            var _this = this;
            if (_this._validateEqualMaxItems()) {
                var itemSchema;
                if (_this.schema && _this.schema.items) {
                    itemSchema = _this.schema.items;
                }
                var containerElem = _this.renderItemContainer(insertAfterId);
                Alpaca(containerElem, value, fieldSetting, itemSchema, this.getView(), function(fieldControl) {
                    // render
                    fieldControl.parent = _this;
                    // setup item path
                    fieldControl.path = _this.path + "[" + index + "]";
                    fieldControl.render();
                    containerElem.attr("id", fieldControl.getId() + "-item-container");
                    containerElem.attr("alpaca-id", fieldControl.getId());
                    // render item label if needed
                    if (_this.options && _this.options.itemLabel) {
                        var itemLabelTemplate = Alpaca.getTemplate("itemLabel", _this);
                        var itemLabelElem = $.tmpl(itemLabelTemplate, {
                            "options": _this.options,
                            "index": index ? index + 1 : 1,
                            "id": _this.id
                        });
                        itemLabelElem.prependTo(containerElem);
                    }
                    // remember the control
                    _this.addChild(fieldControl, index);
                    _this.renderToolbar(containerElem);
                    _this.renderValidationState();
                });
                
                this.updateToolbarItemsStatus(this.outerEl);
                return containerElem;
            }
        },
        
        /**
         * Enriches styles for dynamic elements (jQuery Mobile only)
         *
         * @param {Object} containerElem
         */
        enrichElements: function(containerElem) {
            // for jQuery Mobile only
            if (containerElem) {
                if (containerElem.find('[data-role="fieldcontain"]').fieldcontain) {
                    containerElem.find('[data-role="fieldcontain"]').fieldcontain();
                    containerElem.find('[data-role="fieldcontain"]').find("[type='radio'], [type='checkbox']").checkboxradio();
                    containerElem.find('[data-role="fieldcontain"]').find("button, [data-role='button'], [type='button'], [type='submit'], [type='reset'], [type='image']").not(".ui-nojs").button();
                    containerElem.find('[data-role="fieldcontain"]').find("input, textarea").not("[type='radio'], [type='checkbox'], button, [type='button'], [type='submit'], [type='reset'], [type='image']").textinput();
                    containerElem.find('[data-role="fieldcontain"]').find("input, select").filter("[data-role='slider'], [data-type='range']").slider();
                    containerElem.find('[data-role="fieldcontain"]').find("select:not([data-role='slider'])").selectmenu();
                    containerElem.find('[data-role="button"]').buttonMarkup();
                    //containerElem.find('[data-role="controlgroup"]').controlgroup();
                }

            }
        },
        
        /**
         * @Override
         *
         *
         */
        renderItems: function() {
            var _this = this;
            
            if (this.data) {
                $.each(this.data, function(index, value) {
                    var fieldSetting;
                    if (_this.options && _this.options.fields && _this.options.fields["item"]/*[index]*/) {
                        fieldSetting = _this.options.fields["item"]/*[index]*/;
                    }
                    _this.addItem(index, fieldSetting, value);
                });
            }
            this.updateToolbarItemsStatus();
        },
        
        /**
         * Validates if the maxItem has been reached
         */
        _validateEqualMaxItems: function() {
            if (this.schema.items && this.schema.items.maxItems) {
                if (this.getSize() >= this.schema.items.maxItems) {
                    return false;
                }
            }
            return true;
        },
        
        /**
         * Validates if the minItem has been reached
         */
        _validateEqualMinItems: function() {
            if (this.schema.items && this.schema.items.minItems) {
                if (this.getSize() <= this.schema.items.minItems) {
                    return false;
                }
            }
            return true;
        },
        
        /**
         * Validates minItems
         */
        _validateMinItems: function() {
            if (this.schema.items && this.schema.items.minItems) {
                if (this.getSize() < this.schema.items.minItems) {
                    return false;
                }
            }
            return true;
        },
        
        /**
         * Validates maxItems
         */
        _validateMaxItems: function() {
            if (this.schema.items && this.schema.items.maxItems) {
                if (this.getSize() > this.schema.items.maxItems) {
                    return false;
                }
            }
            return true;
        },
        
        /**
         * Validates uniqueItems
         */
        _validateUniqueItems: function() {
            if (this.schema.items && this.schema.uniqueItems) {
                var hash = {};
                for (var i = 0, l = this.children.length; i < l; ++i) {
                    if (!hash.hasOwnProperty(this.children[i])) {
                        hash[this.children[i]] = true;
                    } else {
                        return false;
                    }
                }
            }
            return true;
        },
        
        /**
         * @Override
         *
         * Handles validations
         */
        handleValidate: function() {
            var baseStatus = this.base();
            
            var valInfo = this.validation;
            
            var status = this._validateUniqueItems();
            valInfo["valueNotUnique"] = {
                "message": status ? "" : Alpaca.getMessage("valueNotUnique", this),
                "status": status
            };
            
            status = this._validateMaxItems();
            valInfo["tooManyItems"] = {
                "message": status ? "" : Alpaca.substituteTokens(Alpaca.getMessage("tooManyItems", this), [this.schema.items.maxItems]),
                "status": status
            };
            
            status = this._validateMinItems();
            valInfo["notEnoughItems"] = {
                "message": status ? "" : Alpaca.substituteTokens(Alpaca.getMessage("notEnoughItems", this), [this.schema.items.minItems]),
                "status": status
            };
            
            return baseStatus && valInfo["valueNotUnique"]["status"] && valInfo["tooManyItems"]["status"] && valInfo["notEnoughItems"]["status"];
        },
        
        /**
         * @Override
         */
        getSchemaOfSchema: function() {
			var properties = {
				"properties": {
					"items": {
						"title": "Array Items",
						"description": "Schema of array items",
						"type": "object",
						"properties": {
							"minItems": {
								"title": "Minimum Items",
								"description": "Minimum number of items",
								"type": "number"
							},
							"maxItems": {
								"title": "Maximum Items",
								"description": "Maximum number of items",
								"type": "number"
							},
							"uniqueItems": {
								"title": "Items Unique",
								"description": "Item values should be unique if true",
								"type": "boolean",
								"default": false
							}
						}
					}
				}
			};
			
            if (this.children && this.children[0]) {					
					Alpaca.merge(properties.properties.items.properties,this.children[0].getSchemaOfSchema())					
            }
            
            return Alpaca.merge(this.base(), properties);			
		},
        
        /**
         * @Override
         */
        getOptionsForSchema: function() {
			return Alpaca.merge(this.base(), {
				"fields": {
					"items": {
						"type": "object",
						"fields": {
							"minItems": {
								"type": "integer"
							},
							"maxItems": {
								"type": "integer"
							},
							"uniqueItems": {
								"type": "checkbox"
							}
						}
					}
				}
			});
		},
        /**
         * @Override
         */
        getTitle: function() {
            return "Array Field";
        },
        
        /**
         * @Override
         */
        getDescription: function() {
            return "Array Field.";
        },
        
        /**
         * @Override
         */
        getType: function() {
            return "array";
        },
        
        /**
         * @Override
         */
        getFieldType: function() {
            return "array";
        }
    });
    
    Alpaca.registerTemplate("itemLabel", '{{if options.itemLabel}}<div class="alpaca-controlfield-label"><div>${options.itemLabel}{{if index}} <span class="alpaca-item-label-counter">${index}</span>{{/if}}</div></div>{{/if}}');
    
    
    //    Alpaca.registerTemplate("arrayToolbar", '<div class="alpaca-fieldset-array-toolbar"><span class="alpaca-fieldset-array-toolbar-icon alpaca-fieldset-array-toolbar-add" title="Add"></div>');
    Alpaca.registerTemplate("arrayToolbar", '<span class="ui-widget ui-corner-all alpaca-fieldset-array-toolbar"><button class="alpaca-fieldset-array-toolbar-icon alpaca-fieldset-array-toolbar-add">Add Item</button></span>');
    
    //    Alpaca.registerTemplate("arrayItemToolbar", '<div class="alpaca-fieldset-array-item-toolbar"><span class="alpaca-fieldset-array-item-toolbar-icon alpaca-fieldset-array-item-toolbar-add" title="Add"></span><span class="alpaca-fieldset-array-item-toolbar-icon alpaca-fieldset-array-item-toolbar-remove" title="Remove"></span><span class="alpaca-fieldset-array-item-toolbar-icon alpaca-fieldset-array-item-toolbar-up" title="Move Up"></span><span class="alpaca-fieldset-array-item-toolbar-icon alpaca-fieldset-array-item-toolbar-down" title="Move Down"></span></div>');
    Alpaca.registerTemplate("arrayItemToolbar", '<div class="ui-widget-header ui-corner-all alpaca-fieldset-array-item-toolbar"><button class="alpaca-fieldset-array-item-toolbar-icon alpaca-fieldset-array-item-toolbar-add">Add Item</button><button class="alpaca-fieldset-array-item-toolbar-icon alpaca-fieldset-array-item-toolbar-remove">Remove Item</button><button class="alpaca-fieldset-array-item-toolbar-icon alpaca-fieldset-array-item-toolbar-up">Move Up</button><button class="alpaca-fieldset-array-item-toolbar-icon alpaca-fieldset-array-item-toolbar-down">Move Down</button></div>');
    
    Alpaca.registerMessages({
        "notEnoughItems": "The minimum number of items is {0}",
        "tooManyItems": "The maximum number of items is {0}",
        "valueNotUnique": "Values are not unique",
        "notAnArray": "This value is not an Array"
    });
    Alpaca.registerFieldClass("array", Alpaca.Fields.ArrayField);
    Alpaca.registerDefaultSchemaFieldMapping("array", "array");
    
})(jQuery);
