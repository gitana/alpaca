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
		 */
		setDefaultTemplate: function() {
			// check if the full template has been provided
			var fullTemplate = Alpaca.getTemplate("full", this);
			if (fullTemplate) {
				this.setTemplate(fullTemplate);
				this.singleLevelRendering = true;
			} else {
				this.setTemplate(Alpaca.getTemplate("fieldSet", this));
			}
		},
		
		/**
         * @Override
         *
         * Override so that we can set up containers to hold subfields.
         * We also check for valid data type.
         */
        setup: function() {
			this.base();
			
			if (this.settings.collapsible != false) {
				this.settings.collapsible = true;
			}
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
            if (this.labelDiv) {
				if (this.settings.collapsible) {
					this.labelDiv.addClass("legend-expanded");
//					$('<b class="alpaca-fieldset-legend-collapsed">\u25B6</b>  ').prependTo(this.labelDiv);
					this.labelDiv.click(function() {
						$(this).toggleClass("legend-collapsed");
						$(this).toggleClass("legend-expanded");
						$(this).nextAll(".alpaca-fieldset-helper").slideToggle(500);
						$(this).nextAll(".alpaca-items-container").slideToggle(500);
					});
				}
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
            
            //return response;
			
			//TODO: Still need to think about how to better handle validation of container field.
			return true;
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
            var itemContainerTemplate = Alpaca.getTemplate("itemContainer", this);
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
            
			if (!this.singleLevelRendering) {
				this.renderItems();
			}
            
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
