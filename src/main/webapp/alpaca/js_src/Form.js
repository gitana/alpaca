(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Form Field class
     */
    Alpaca.Form = Base.extend({
    
        /**
         * Constructor
         *
         * @param container The DOM element to which this form field is bound.
         * @param options (optional)
         *
         * Options consists of:
         *
         * {
         *    viewType: <string>,           view type (auto-populated)
         *    attributes: <object>,         form options (optional)
         *    buttons: <object>             form button options (optional)
         * }
         */
        constructor: function(container, options) {
            var _this = this;
            
            // container
            this.container = container;
            
            // parent
            this.parent = null;
            
            // options
            this.options = options;
            
            if (this.options.attributes) {
                this.attributes = this.options.attributes;
            } else {
                this.attributes = {};
            }
            
            if (this.attributes.id) {
                this.id = this.attributes.id;
            } else {
                this.id = Alpaca.generateId();
                this.attributes.id = this.id;
            }
            
            this.viewType = options.viewType;
            
            // set default options for buttons
            if (this.options.buttons) {
                this.buttonOptions = this.options.buttons;
            } else {
                this.buttonOptions = {};
            }
            
            if (Alpaca.isEmpty(this.buttonOptions.hideSubmitButton)) {
                this.buttonOptions.hideSubmitButton = false;
            }
            if (Alpaca.isEmpty(this.buttonOptions.hideSaveButton)) {
                this.buttonOptions.hideSaveButton = false;
            }
            if (Alpaca.isEmpty(this.buttonOptions.hideReloadButton)) {
                this.buttonOptions.hideReloadButton = false;
            }
            if (Alpaca.isEmpty(this.buttonOptions.hidePrintButton)) {
                this.buttonOptions.hidePrintButton = false;
            }
            if (Alpaca.isEmpty(this.buttonOptions.hideResetButton)) {
                this.buttonOptions.hideResetButton = false;
            }
            if (Alpaca.isEmpty(this.buttonOptions.hideSwitchViewButton)) {
                this.buttonOptions.hideSwitchViewButton = false;
            }
			            
            // set a view
            this.view = Alpaca.defaultView;
            
            // maintain a list for all buttons
            this.buttons = [];
        },
        
        /**
         * Renders this field into the container.
         * Creates an outerEl which is bound into the container.
         */
        render: function(onSuccess) {
            var _this = this;
            
            this.template = Alpaca.getTemplate("form", this);
            
            // remove the previous outerEl if it exists
            if (this.outerEl) {
                this.outerEl.remove();
            }
            
            // load the appropriate template and render it
            this.processRender(this.container, function() {
                // bind our field dom element into the container
                _this.outerEl.appendTo(_this.container);
                
                // add default class
                _this.outerEl.addClass("alpaca-form");
                
                // add buttons
                _this.addButtons();
                                
                // execute callback
                if (onSuccess) 
                    onSuccess(_this);
            });
        },
        
        /**
         * Responsible for fetching any templates needed so as to render the
         * current mode for this field.
         *
         * Once completed, the onSuccess method is called.
         */
        processRender: function(parentEl, onSuccess) {
            var _this = this;
            
            // lookup the template we should use to render
            var template = this.getTemplate();
            
            // if we have a template to load, load it and then render
            if (Alpaca.isUri(template)) {
                // load template from remote location
                $.ajax({
                    url: template,
                    type: 'get',
                    success: function(templateString) {
                        _this._renderLoadedTemplate(parentEl, templateString, onSuccess);
                    },
                    error: function(error) {
                        alert(error);
                    }
                });
            } else {
                // we already have the template, so just render it
                this._renderLoadedTemplate(parentEl, template, onSuccess);
            }
            
            if (onSuccess) 
                onSuccess();
        },
        
        /**
         * Renders the loaded template
         */
        _renderLoadedTemplate: function(parentEl, templateString, onSuccess) {
			var context = {
				id: this.getId(),
				options: this.options,
				view: this.view
			};
			var renderedDomElement = $.tmpl(templateString, context, {});
			renderedDomElement.appendTo(parentEl);
			
			this.outerEl = renderedDomElement;
			
			if (Alpaca.isEmpty(this.outerEl.attr("id"))) {
				this.outerEl.attr("id", this.getId() + "-form-outer");
			}
			if (Alpaca.isEmpty(this.outerEl.attr("alpaca-field-id"))) {
				this.outerEl.attr("alpaca-field-id", this.getId());
			}
			
			// get container for forms
			if ($('.alpaca-form-fields-container', this.outerEl)) {
				this.formFieldsContainer = $('.alpaca-form-fields-container', this.outerEl);
			} else {
				this.formFieldsContainer = this.outerEl;
			}
			
			// add all provided attributes
			this.formField = $('form', this.container);
			if (this.formField) {
				this.formField.attr(this.attributes);
			}
			
		},
        
        /**
         * Adds buttons
         */
        addButtons: function() {
            var _this = this;
            if ($('.alpaca-form-buttons-container', this.outerEl)) {
                this.formButtonsContainer = $('.alpaca-form-buttons-container', this.outerEl);
            } else {
                this.formButtonsContainer = this.outerEl;
            }
							
            if (!this.buttonOptions.hidePrintButton) {            
                Alpaca(this.formButtonsContainer, "", {
                    "type": "alpacaprintbutton",
                    "form": this
                }, {}, function(fieldControl) {
                    fieldControl.render();
                    _this.buttons.push(fieldControl);
                });
            }

            if (!this.buttonOptions.hideSwitchViewButton) {            
                Alpaca(this.formButtonsContainer, "", {
                    "type": "alpacaswitchviewbutton",
                    "form": this
                }, {}, function(fieldControl) {
                    fieldControl.render();
                    _this.buttons.push(fieldControl);
                });
            }			          
                        
             if (!this.options.hideReloadButton && this.viewType != 'view') {
			 	Alpaca(this.formButtonsContainer, "", {
			 		"type": "alpacareloadbutton",
			 		"form": this
			 	}, {}, function(fieldControl) {
			 		fieldControl.render();
			 		_this.buttons.push(fieldControl);
			 	});
			 }

            if (!this.buttonOptions.hideSaveButton && this.viewType != 'view') {
                Alpaca(this.formButtonsContainer, "", {
                    "type": "gitanasavebutton",
                    "form": this
                }, {}, function(fieldControl) {
                    fieldControl.render();
                    _this.buttons.push(fieldControl);
                });
            }
			
            if (!this.buttonOptions.hideSubmitButton && this.viewType != 'view') {
				Alpaca(this.formButtonsContainer, "Submit", {
					"type": "button",
					"buttonType": "submit",
					"form": this
				}, {}, function(fieldControl) {
					fieldControl.render();
					_this.buttons.push(fieldControl);
				});
			}
			
            if (!this.buttonOptions.hideResetButton && this.viewType != 'view') {
                Alpaca(this.formButtonsContainer, "Reset", {
                    "type": "button",
                    "buttonType": "reset",
                    "form": this
                }, {}, function(fieldControl) {
                    // render
                    fieldControl.render();
                    _this.buttons.push(fieldControl);
                });
            }
			
			this.formButtonsContainer.addClass("ui-widget-header ui-corner-all");
        },
        
        /**
         * Retrieve the rendering element
         */
        getEl: function() {
            return this.outerEl;
        },
        
        /**
         * Returns the id of the field
         */
        getId: function() {
            return this.id;
        },
        
        getType: function() {
            return this.type;
        },
        
        /**
         * Returns this field's parent field.
         */
        getParent: function() {
            return this.parent;
        },
        
        /**
         * Return the value of the field
         */
        getValue: function() {
            return this.topField.getValue();
        },
        
        /**
         * Sets the value of the field
         */
        setValue: function(value, stopUpdateTrigger) {
            this.topField.setValue(value, stopUpdateTrigger);
        },
        
        /**
         * Initializes events
         */
        initEvents: function() {
            var _this = this;
			if (this.formField) {
				var v = this.getValue();				
				$(this.formField).submit(v,function(e) {
					_this.onSubmit(e);
				});
			}
        },
		
		/**
		 * Handles form submit events
		 * 
		 * @param {Object} e
		 */
		onSubmit: function(e) {
			if (this.submitHandler) {
				this.submitHandler(e);
			}
		},
		
		/**
		 * Registers custom submit handler
		 * 
		 * @param {Object} func
		 */
		registerSubmitHandler: function (func) {
			if (Alpaca.isFunction(func)) {
				this.submitHandler = func;
			}
		},
        
        /**
         * Makes sure that the DOM of the rendered field reflects the validation state
         * of the field.
         */
        renderValidationState: function() {
            this.topField.renderValidationState();
        },
        
        /**
         * Disable the field
         */
        disable: function() {
            this.topField.disable();
        },
        
        /**
         * Enable the field
         */
        enable: function() {
            this.topField.enable();
        },
        
        /**
         * Focus the field
         */
        focus: function() {
            this.topField.forcus();
        },
        
        /**
         * Purge any event listeners
         * Remove the field from the DOM
         */
        destroy: function() {
            this.getEl().remove();
        },
        
        /**
         * Show the field
         */
        show: function() {
            this.getEl().css({
                "display": ""
            });
        },
        
        /**
         * Hides the field
         */
        hide: function() {
            this.getEl().css({
                "display": "none"
            });
        },
        
        /**
         * Clears the field.
         *
         * This resets the field to its original value (this.data)
         */
        clear: function(stopUpdateTrigger) {
            this.topField.clear(stopUpdateTrigger);
        },
        
        /**
         * Checks if top field is empty
         */
		isEmpty: function() {
            return this.topField.isEmpty();
        },
        
        /**
         * Returns the field template
         */
        getTemplate: function() {
            return this.template;
        },
        
        /**
         * Sets the field template
         */
        setTemplate: function(template) {
            // if template is a function, evaluate it to get a string
            if (Alpaca.isFunction(template)) {
                template = template();
            }
            // trim for good measure
            template = $.trim(template);
            
            this.template = template;
        }
    });
    
})(jQuery);
