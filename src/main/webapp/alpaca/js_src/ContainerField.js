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
			var layoutTemplate = Alpaca.getTemplate("layout", this);
            if (fullTemplate) {
				this.setTemplate(fullTemplate);
				this.singleLevelRendering = true;
			} else if (layoutTemplate && this.isTopLevel()) {
				this.setTemplate(layoutTemplate);				
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
			
			if (this.options.collapsible != false) {
				this.options.collapsible = true;
			}
			// holders of references to children
			this.children = [];
			this.childrenById = [];
			this.childrenByPropertyId = [];
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
 			if (child.propertyId) {
				this.childrenByPropertyId[child.propertyId] = child;
			}           
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
				if (this.options.collapsible) {
					this.labelDiv.addClass("legend-expanded");
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
/*
        handleValidate: function() {
			
            var baseStatus =  this.base();            
            Alpaca.each(this.children, function() {            
                baseStatus = this.validate() && baseStatus;                
            });
            
			return baseStatus;
        },
*/        
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
        renderItemContainer: function(insertAfterId,parent,propertyId) {
            var itemContainerTemplate = Alpaca.getTemplate("itemContainer", this);
            if (itemContainerTemplate) {
                var containerElem = $.tmpl(itemContainerTemplate, {});
				if (containerElem.attr('data-replace') == 'true') {
					return this.fieldContainer;
				} else {
					if (insertAfterId) {
						$('#' + insertAfterId + '-item-container', this.outerEl).after(containerElem);
					} else {
					
						var appendToContainer = this.fieldContainer;
						
						// Only deals with second level elements
						if (parent && parent.isTopLevel() && parent.view.templates && parent.view.templates.bindings) {
							var binding = parent.view.templates.bindings[propertyId];
							if (binding && $('#' + binding, appendToContainer).length > 0) {
								appendToContainer = $('#' + binding, appendToContainer);
							}
						}
												
						containerElem.appendTo(appendToContainer);
					}
				}
                return containerElem;
            } else {
                return this.fieldContainer;
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
        }
    
    });
    
})(jQuery);
