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
            var fullTemplate = Alpaca.getLayout("full", this);
            var layoutTemplate = Alpaca.getLayout("layout", this);
            if (fullTemplate) {
                this.setTemplate(fullTemplate);
                this.singleLevelRendering = true;
            } else if (layoutTemplate /*&& this.isTopLevel()*/) {
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
            
            var collapsible = true;
            
            if (!Alpaca.isEmpty(Alpaca.getViewParam('collapsible', this))) {
                collapsible = Alpaca.getViewParam('collapsible', this);
            }
            
            if (!Alpaca.isEmpty(this.options.collapsible)) {
                collapsible = this.options.collapsible;
            }
            
            this.options.collapsible = collapsible;
            
            var legendStyle = "button";
            
            if (!Alpaca.isEmpty(Alpaca.getViewParam('legendStyle', this))) {
                legendStyle = Alpaca.getViewParam('legendStyle', this);
            }
            
/*
            if (!Alpaca.isEmpty(this.options.legendStyle)) {
                legendStyle = this.options.legendStyle;
            }
*/
            
            this.options.legendStyle = legendStyle;
            
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
                    
                    var initIcon = 'ui-icon-circle-arrow-s';
                    
                    if (!Alpaca.isEmpty(this.options.collapsed) && this.options.collapsed) {
                        initIcon = 'ui-icon-circle-arrow-e';
                        this.labelDiv.nextAll(".alpaca-fieldset-helper").slideToggle(500);
                        this.labelDiv.nextAll(".alpaca-fieldset-items-container").slideToggle(500);
                    }
                    
                    if (this.options.legendStyle == 'link') {
                        $('<span class="ui-icon ' + initIcon + '" style="float:left;margin-right:0.3em;"></span>').prependTo(this.labelDiv);
                        this.labelDiv.click(function() {
                            $(this).toggleClass("legend-collapsed");
                            $(this).toggleClass("legend-expanded");
                            $('.ui-icon', this).toggleClass("ui-icon-circle-arrow-e").toggleClass("ui-icon-circle-arrow-s");
                            $(this).nextAll(".alpaca-fieldset-helper").slideToggle(500);
                            $(this).nextAll(".alpaca-fieldset-items-container").slideToggle(500);
                        });
                    }
                    
                    if (this.options.legendStyle == 'button') {
                    
                        this.labelDiv.button({
                            icons: {
                                primary: initIcon
                            }
                        }).click(function() {
                            $(this).toggleClass("legend-collapsed");
                            $(this).toggleClass("legend-expanded");
                            $('.ui-icon', this).toggleClass("ui-icon-circle-arrow-e").toggleClass("ui-icon-circle-arrow-s");
                            $(this).nextAll(".alpaca-fieldset-helper").slideToggle(500);
                            $(this).nextAll(".alpaca-fieldset-items-container").slideToggle(500);
                        });
                    }
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
        renderItemContainer: function(insertAfterId, parent, propertyId) {
            var itemContainerTemplate = Alpaca.getTemplate("fieldSetItemContainer", this);
            if (itemContainerTemplate) {
                var containerElem = $.tmpl(itemContainerTemplate, {});
                if (containerElem.attr('data-replace') == 'true') {
                    return this.fieldContainer;
                } else {
                    if (insertAfterId) {
                        $('#' + insertAfterId + '-item-container', this.outerEl).after(containerElem);
                    } else {
                    
                        var appendToContainer = this.fieldContainer;
                        
                        var bindings = Alpaca.getLayout("bindings", this);
                        if (bindings) {
                            var binding = bindings[propertyId];
                            if (binding && $('#' + binding, appendToContainer).length > 0) {
                                appendToContainer = $('#' + binding, appendToContainer);
                            }
                        }
                        
                        /*
                         if (parent && parent.isTopLevel() && parent.view.templates && parent.view.templates.bindings) {
                         var binding = parent.view.templates.bindings[propertyId];
                         if (binding && $('#' + binding, appendToContainer).length > 0) {
                         appendToContainer = $('#' + binding, appendToContainer);
                         }
                         }
                         */
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
        
            this.outerEl.addClass('ui-widget-content');
            
            var labelDiv = $('.alpaca-fieldset-legend', this.outerEl);
            
            if (labelDiv.length) {
                this.labelDiv = labelDiv;
            }
            
            var fieldContainer = $('.alpaca-fieldset-items-container', this.outerEl);
            if (fieldContainer.length) {
                this.fieldContainer = fieldContainer;
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
        
		/**
		 * @Override
		 */
		isContainer: function() {
        	return true;
        },
		
        /**
         * @Override
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "collapsible": {
                        "title": "Collapsible",
                        "description": "Field set is collapsible if true",
                        "type": "boolean",
                        "default": true
                    },
                    "collapsed": {
                        "title": "Collapsed",
                        "description": "Field set is initially collapsibled if true",
                        "type": "boolean",
                        "default": false
                    },
                    "legendStyle": {
                        "title": "Legend Style",
                        "description": "Field set legend style",
                        "type": "string",
						"enum":["button","link"],
                        "default": "button"
                    }
                }
            });
        },

        /**
         * @Override
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "collapsible": {
                        "rightLabel": "Field set collapsible ?",
                        "helper": "Field set is collapsible if checked",
                        "type": "checkbox"
                    },
                    "collapsed": {
                        "rightLabel": "Field set initially collapsed ?",
                        "description": "Field set is initially collapsed if checked",
                        "type": "checkbox"
                    },
					"legendStyle": {
						"type":"select"
					}
                }
            });
        }		
        
    });
    
})(jQuery);
