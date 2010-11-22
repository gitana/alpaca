(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Form Field class
     */
    Alpaca.Form = Base.extend({
    
        /**
         * Constructor
         *
         * @param container The DOM element to which this field is bound.
         * @param options (optional)
         *
         * Options consists of:
         *
         * {
         *    id: <id>,                     field id (optional)
         *    type: <type>,                 field type (optional)
         *    settings: settings            field settings (optional)
         * }
         *
         * @param schema field schema (optional)
         */
        constructor: function(container, options) {
            var _this = this;
            
            // mark that we are initializing
            this.initializing = true;
            
            // container
            this.container = container;
            
            // parent
            this.parent = null;
            this.options = options;
            
            // things we can draw off the options
            this.id = this.options.id;
            
            if (this.options.template) {
                this.setTemplate(this.options.template);
            }
            
            // defaults
            if (!this.id) {
                this.id = Alpaca.generateId();
            }
            
            // maintain a list for all buttons
            this.buttons = [];           
        },
        
        /**
         * Simple method for rendering display view
         */
        view: function() {
            this.render(Alpaca.MODE_VIEW);
        },
        
        /**
         * Simple method for rendering edit view
         */
        edit: function() {
            this.render(Alpaca.MODE_EDIT);
        },
        
        /**
         * Simple method for rendering create view
         */
        create: function() {
            this.render(Alpaca.MODE_CREATE);
        },
        
        /**
         * Renders this field into the container.
         * Creates an outerEl which is bound into the container.
         */
        render: function(mode, onSuccess) {
            var _this = this;
            
            if (!mode) {
                mode = Alpaca.MODE_EDIT;
            }
            this.setMode(mode);
            
            // remove the previous outerEl if it exists
            if (this.outerEl) {
                this.outerEl.remove();
            }
            
            // load the appropriate template and render it
            this.processRender(this.container, function() {
            
                // bind our field dom element into the container
                $(_this.getEl()).appendTo(_this.container);
                
				$(_this.outerEl).addClass("alpaca-form");
				
                // allow any post-rendering facilities to kick in
                // add buttons
                _this.addButtons();
                
                if (_this.getMode() == Alpaca.MODE_EDIT) {
                    // Support for custom CSS class for the form
                    var fieldClass = _this.options["formClass"];
                    if (fieldClass) {
                        $(_this.outerEl).addClass(fieldClass);
                    }
                }
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
                options: this.options
            };
            var renderedDomElement = $.tmpl(templateString, context, {});
            renderedDomElement.appendTo($(parentEl));
            
            this.outerEl = renderedDomElement;
            
            if (this.outerEl.attr("id") == null) {
                this.outerEl.attr("id", this.getId() + "-form-outer");
            }
            if (this.outerEl.attr("alpaca-field-id") == null) {
                this.outerEl.attr("alpaca-field-id", this.getId());
            }
            
            // get container for forms
            if ($('.alpaca-form-fields-container', this.outerEl)) {
                this.formFieldsContainer = $('.alpaca-form-fields-container', this.outerEl);
            } else {
                this.formFieldsContainer = this.outerEl;
            }
        },
        
        addButtons: function() {
            var _this = this;
            if ($('formButtonsContainer', this.outerEl)) {
                this.formButtonsContainer = $('.alpaca-form-buttons-container', this.outerEl);
            } else {
                this.formButtonsContainer = this.outerEl;
            }
            
/*
            Alpaca(this.formButtonsContainer, "Submit", {
                "type": "button",
                "buttonType": "submit",
                "form": this
            }, {}, function(fieldControl) {
                fieldControl.render(_this.getMode());
                _this.buttons.push(fieldControl);
            });
*/            
            Alpaca(this.formButtonsContainer, "", {
                "type": "gitanabutton",
                "form": this
            }, {}, function(fieldControl) {
                fieldControl.render(_this.getMode());
                _this.buttons.push(fieldControl);
            });
			
            Alpaca(this.formButtonsContainer, "", {
                "type": "gitanabutton",
				"action":"reload",
                "form": this
            }, {}, function(fieldControl) {
                fieldControl.render(_this.getMode());
                _this.buttons.push(fieldControl);
            });			

            Alpaca(this.formButtonsContainer, "", {
                "type": "gitanabutton",
				"action":"create",
                "form": this
            }, {}, function(fieldControl) {
                fieldControl.render(_this.getMode());
                _this.buttons.push(fieldControl);
            });
			
			Alpaca(this.formButtonsContainer, "Reset", {
                "type": "button",
                "buttonType": "reset",
                "form": this
            }, {}, function(fieldControl) {
                // render
                fieldControl.render(_this.getMode());
                _this.buttons.push(fieldControl);
            });
        },
        
        /**
         * Retrieve the rendering element
         */
        getEl: function() {
            return $(this.outerEl);
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
            return this.topField.data;
        },
        
        /**
         * Sets the value of the field
         */
        setValue: function(value, stopUpdateTrigger) {
            this.topField.setValue(value, stopUpdateTrigger);
        },
        
        /**
         * Initialize events
         */
        initEvents: function() {
            this.topField.initEvents();
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
            $(this.getEl()).remove();
        },
        
        /**
         * Show the field
         */
        show: function() {
            $(this.getEl()).css({
                "display": ""
            });
        },
        
        /**
         * Hide the field
         */
        hide: function() {
            $(this.getEl()).css({
                "display": "none"
            });
        },
        
        /**
         * Clear the field.
         *
         * This resets the field to its original value (this.data)
         */
        clear: function(stopUpdateTrigger) {
            this.topField(stopUpdateTrigger);
        },
        
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
        },
        
        /**
         * Gets current mode
         */
		getMode: function() {
            return this.mode;
        },
        
		/**
		 * Setups a new mode
		 * 
		 * @param {Object} mode
		 */
        setMode: function(mode) {
            this.mode = mode;
            if (!this.options.template) {
                this.template = Alpaca.getTemplate("form", this, null, mode);
            }
        }
    });
    
})(jQuery);
