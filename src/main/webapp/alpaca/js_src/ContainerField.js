(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Abstract Container Field
     *
     * Extends Field to provide for parenting of child fields.
     *
     * Custom field implementation should extend this if they intend to be containers of subcontrols - examples include
     * tree controls, list controls and more.
     *
     * {
     *    collapsible: <boolean>
     *    collapsed: <boolean>
     * }
     */
    Alpaca.ContainerField = Alpaca.Field.extend({
    
        /**
         * @Override
         *
         */
        setMode: function(mode) {
            this.base();
            this.template = Alpaca.getTemplate("fieldSet", this, null, mode);
        },
        /**
         * @Override
         *
         * Override so that we can set up containers to hold subfields.
         * We also check for valid data type.
         */
        setup: function() {
            this.base();
            
            // holders of references to children
            this.children = [];
            this.childrenById = [];
        },
        
        /**
         * Helper method to register child fields of this field.
         */
        addChild: function(child, index) {
            if (index) {
                this.children.splice(index, 0, child);
            } else {
                this.children.push(child);
            }
            this.childrenById[child.getId()] = child;
            
            child.parent = this;
        },
        
        /**
         * @Override
         *
         * Initialize events
         */
        initEvents: function() {
            var _this = this;
            
            // if collapsible
            if (this.settings.collapsible) {
                $(this.legend).click(function(e) {
                    _this.toggleCollapse();
                });
            }
        },
        
        toggleCollapse: function() {
            if ($(this.fieldset).hasClass("alpaca-Expanded")) {
                $(this.fieldset).removeClass("alpaca-Expanded");
                $(this.fieldset).addClass("alpaca-Collapsed");
            } else {
                $(this.fieldset).removeClass("alpaca-Collapsed");
                $(this.fieldset).addClass("alpaca-Expanded");
            }
        },
        
        /**
         * @Override
         *
         * Handle validation
         */
        handleValidate: function() {
            // validate all of the fields, one at a time
            var response = true;
            
            Alpaca.each(this.children, function() {
            
                this.renderValidationState();
                
                var state = this.getValidationState();
                if (state == Alpaca.STATE_REQUIRED || state == Alpaca.STATE_INVALID) {
                    response = false;
                }
            });
            
            return response;
        },
        
        /**
         * @Override
         *
         * Clear
         */
        clear: function(stopUpdateTrigger) {
            // clear all the kiddies
            Alpaca.each(this.children, function() {
                this.clear(false);
            });
            
            // trigger update all at once
            if (!stopUpdateTrigger) {
                this.triggerUpdate();
            }
        },
        
        /**
         * @Override
         *
         * Destroy
         */
        destroy: function() {
            Alpaca.each(this.children, function() {
                this.destroy();
            });
            
            // destroy ourselves
            this.base();
        },
        
        
        /**
         * Renders item container
         */
        renderItemContainer: function(insertAfterId) {
			var _this = this;
            var itemContainerTemplate = Alpaca.getTemplate("itemContainer", this, null, this.mode);
            if (itemContainerTemplate) {
                var containerElem = $.tmpl(itemContainerTemplate, {});
				if (containerElem.attr('data-replace') == 'true') {
					return _this.fieldContainer;
				} else {
					if (insertAfterId) {
						$('#' + insertAfterId + '-item-container', this.outerEl).after(containerElem);

					} else {
						containerElem.appendTo(this.fieldContainer);
					}
				}
                return containerElem;
            } else {
                return _this.fieldContainer;
            }
        },
        
        /**
         * @Override
         *
         */
        renderField: function(onSuccess) {
            if ($('.alpaca-fieldset-legend', this.outerEl).length) {
                this.labelDiv = $('.alpaca-fieldset-legend', this.outerEl);
            }
            
            if ($('.alpaca-items-container', this.outerEl).length) {
                this.fieldContainer = $('.alpaca-items-container', this.outerEl);
            } else {
                this.fieldContainer = this.outerEl;
            }
            
            this.renderItems();
            
            if (onSuccess) {
                onSuccess();
            }
        },
        
        /**
         * To be overriden
         */
        renderItems: function(onSuccess) {
        },
    
    });
    
})(jQuery);
