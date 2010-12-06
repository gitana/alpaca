(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Abstract Field class
     *
     * Defines a field which contains a value and core functions.
     * These functions are left empty and are intended to be implemented in inheriting classes.
     *
     * Provides support for templated rendering.
     *
     * This takes in an options block which look like this:
     *
     * {
     *    id: <id>,                     				field id (optional)
     *    type: <type>,                 				field type (optional) - "text" if not specified
     *    schema: schema,              					field schema (optional)
     *    settings: settings            				field settings (optional) - {} if not specified
     * }
     *
     * The settings block consists of the following:
     *
     * SETTINGS
     * {
     *    fieldClass: [<string>]                        optional - additional css classes to apply
     *    validate: <boolean>			        		optional - whether to validate on change (true)
     *    disabled: <boolean>                           optional - whether to initialize as disabled (false)
     *    displayMessages: <boolean>                    optional - whether to display message (true)
     * }
     *
     * JSON SCHEMA:
     *
     * This class obeys JSON schema for:
     *
     * {
     *    optional: <boolean>							[optional] (false)
     *    default: <any>                                [optional]
     * }
     */
    Alpaca.Field = Base.extend({
    
        /**
         * Constructor
         *
         * @param container The DOM element to which this field is bound.
         * @param data The data bound to this field.
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
        constructor: function(container, data, options, schema, view) {
            // mark that we are initializing
            this.initializing = true;
            
            // container
            this.container = container;
            
            // parent
            this.parent = null;
            this.data = data;
            this.options = options;
            this.schema = schema;
            
            // check if this field rendering is single-level or not
            this.singleLevelRendering = false;
            
            if (view) {
                this.setView(view);
            } else {
                this.setView(Alpaca.defaultView);
            }
            
            // things we can draw off the options
            if (!this.options) {
                this.options = {};
            }
            this.id = this.options.id;
            this.type = this.options.type;
            if (this.options.template) {
                this.setTemplate(this.options.template);
            }
            
            // setup defaults
            if (!this.id) {
                this.id = Alpaca.generateId();
            }
            if (!this.schema) {
                this.schema = {};
            }
            if (!this.options.label && this.schema.title) {
                this.options.label = this.schema.title;
            }
            if (!this.options.helper && this.schema.description) {
                this.options.helper = this.schema.description;
            }
            
            // data
            if (!this.data && this.schema["default"]) {
                this.data = this.schema["default"];
            }
            
            // validation status
            this.validation = {};
            
            // backup data
            this.backupData = Alpaca.cloneObject(this.data);
        },
        
        /**
         * Sets up default rendition template from view
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
                this.setTemplate(Alpaca.getTemplate("field", this));
            }
        },
        
        /**
         * Sets up any default values for this field.
         */
        setup: function() {
        
            if (!this.initializing) {
                this.data = this.getValue();
            }
            
            // if we have already created backup settings, restore from them
            /*
             if (this.backupSettings) {
             this.settings = Alpaca.cloneObject(this.backupSettings);
             } else {
             this.backupSettings = Alpaca.cloneObject(this.settings);
             }
             */
            this.setDefaultTemplate();
            
            // JSON SCHEMA
            if (Alpaca.isUndefined(this.schema.required)) {
                this.schema.required = false;
            }
            
            // SETTINGS             
            if (Alpaca.isUndefined(this.options.validate)) {
                this.options.validate = true;
            }
            
            if (Alpaca.isUndefined(this.options.disabled)) {
                this.options.disabled = false;
            }
            
            // MESSAGES                        
            if (Alpaca.isUndefined(this.options.showMessages)) {
                this.options.showMessages = true;
            }
        },
        
        /**
         * Binds the data into the field.  Called at the very end of construction.
         */
        bindData: function() {
            if (this.data) {
                this.setValue(this.data, true);
            }
        },
        
        /**
         * Renders this field into the container.
         * Creates an outerEl which is bound into the container.
         */
        render: function(view) {
            if (view) {
                this.setView(view);
            }
            this.setup();
            this._render();
        },
        
        /**
         * Internal method for processing the render.
         */
        _render: function() {
            var _this = this;
            
            // remove the previous outerEl if it exists
            if (this.getEl()) {
                this.getEl().remove();
            }
            
            // check if it needs to be wrapped in a form
            if (this.options.form) {
                this.options.form.viewType = this.viewType;
                var form = this.form;
                if (!form) {
                    form = new Alpaca.Form(this.container, this.options.form);
                }
                form.render(function(form) {
                    // load the appropriate template and render it
                    _this._processRender(form.formFieldsContainer, function() {
                    
                        // bind our field dom element into the container
                        $(_this.getEl()).appendTo(form.formFieldsContainer);
                        
                        // bind the top field to the form
                        form.topField = _this;
                        
                        _this.form = form;
                        
                        // allow any post-rendering facilities to kick in
                        _this.postRender();
                    });
                });
            } else {
                // load the appropriate template and render it
                this._processRender(this.container, function() {
                
                    // bind our field dom element into the container
                    $(_this.getEl()).appendTo(_this.container);
                    
                    // allow any post-rendering facilities to kick in
                    _this.postRender();
                });
            }
        },
        
        /**
         * Responsible for fetching any templates needed so as to render the
         * current mode for this field.
         *
         * Once completed, the onSuccess method is called.
         */
        _processRender: function(parentEl, onSuccess) {
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
        },
        
        /**
         * Renders the loaded template
         */
        _renderLoadedTemplate: function(parentEl, templateString, onSuccess) {
            // render field template
            var renderedDomElement = $.tmpl(templateString, {
                "id": this.getId(),
                "options": this.options,
                "data": this.data,
                "view": this.getView()
            }, {});
            renderedDomElement.appendTo($(parentEl));
            this.setEl(renderedDomElement);
            
            if (!this.singleLevelRendering) {
                this.renderField(onSuccess);
            }
        },
        
        /**
         * Called after the rendering is complete as a way to make final modifications to the
         * dom elements that were produced.
         */
        postRender: function() {
            // for edit or create mode
            // injects Ids
            if (this.getEl().attr("id") == null) {
                this.getEl().attr("id", this.getId() + "-field-outer");
            }
            if (this.getEl().attr("alpaca-field-id") == null) {
                this.getEl().attr("alpaca-field-id", this.getId());
            }
            // Support for custom CSS class for the field
            var fieldClass = this.options["fieldClass"];
            if (fieldClass) {
                $(this.getEl()).addClass(fieldClass);
            }
            // optional
            if (this.options.required) {
                $(this.getEl()).addClass("alpaca-field-required");
            } else {
                $(this.getEl()).addClass("alpaca-field-optional");
            }
            
            // after render
            if (this.options.disabled) {
                this.disable();
            }
            // bind data
            if (this.getViewType() && this.getViewType() == 'edit') {
                this.bindData();
            }
            // initialize events (after part of the dom)
            if (this.getViewType() && this.getViewType() != 'view') {
                this.initEvents();
            }
            
            // finished initializing
            this.initializing = false;
            
            // final call to update validation state
            if (this.getViewType() != 'view') {
                this.renderValidationState();
            }
		},
        
        /**
         * Retrieves the rendering element
         */
        getEl: function() {
            return $(this.outerEl);
        },
        
        /**
         * Sets the rendering element
         */
        setEl: function(outerEl) {
            this.outerEl = outerEl;
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
         * Returns true if this field is the top level one.
         */
        isTopLevel: function() {
            return Alpaca.isEmpty(this.parent);
        },
        /**
         * Returns the value of the field
         */
        getValue: function() {
            return this.data;
        },
        
        /**
         * Sets the value of the field
         */
        setValue: function(value, stopUpdateTrigger) {
            this.data = value;
            
            // set corresponding style
            this.renderValidationState();
            
            if (!stopUpdateTrigger) {
                this.triggerUpdate();
            }
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
         * Gets current view
         */
        getView: function() {
            return this.view;
        },
        
        /**
         * Sets view
         */
        setView: function(view) {
            if (Alpaca.isString(view) && !Alpaca.isEmpty(Alpaca.views[view])) {
                // view id
                this.view = view;
            } else {
                // actual view object
                this.view = view;
            }
            this.viewType = Alpaca.getViewType(this.view);
        },
        
        /**
         * Gets current view type
         */
        getViewType: function() {
            return this.viewType;
        },
        
        /**
         * Renders a validation state message below the field.
         */
        displayMessage: function(messages) {
            // remove the message element if it exists
            var _this = this;
            $("#[id^='" + _this.getId() + "-field-message']", _this.getEl()).remove();
            // add message and generate it
            if (messages) {
                $.each(messages, function(index, message) {
                    if (message.length > 0) {
                        var messageTemplate = Alpaca.getTemplate("controlFieldMessage", _this);
                        if (messageTemplate) {
                            _this.messageElement = $.tmpl(messageTemplate, {
                                "message": message
                            });
                            _this.messageElement.addClass("alpaca-field-message");
                            _this.messageElement.attr("id", _this.getId() + '-field-message-' + index);
                            // check to see if we have a message container rendered
                            if ($('.alpaca-field-message-container', _this.getEl()).length) {
                                _this.messageElement.appendTo($('.alpaca-field-message-container', _this.getEl()));
                            } else {
                                _this.messageElement.appendTo(_this.getEl());
                            }
                        }
                    }
                });
            }
        },
        
        /**
         * Makes sure that the DOM of the rendered field reflects the validation state
         * of the field.
         */
        renderValidationState: function() {
            if (this.options.validate) {
                // remove all previous markers
                $(this.getEl()).removeClass("alpaca-field-invalid");
                $(this.getEl()).removeClass("alpaca-field-valid");
                
                // this runs validation
                if (this.validate()) {
                    $(this.getEl()).addClass("alpaca-field-valid");
                } else {
                    $(this.getEl()).addClass("alpaca-field-invalid");
                }
                
                // Allow for the message to change
                if (this.options.showMessages) {
                    if (!this.initializing) {
                        var messages = [];
                        for (var messageId in this.validation) {
                            if (!this.validation[messageId]["status"]) {
                                messages.push(this.validation[messageId]["message"]);
                            }
                        }
                        this.displayMessage(messages);
                    }
                }
                // Revalidate parents
                if (this.parent && this.parent.renderValidationState) {
                    this.parent.renderValidationState();
                }
            }
        },
        
        /**
         * Validates this field and returns whether it is in a valid state.
         */
        validate: function() {
            // skip out if we haven't yet bound any data into this control
            // the control can still be considered to be initializing
            var status = true;
            if (!this.initializing && this.options.validate) {
                status = this.handleValidate();
            }
            return status;
        },
        
        /**
         * To be overridden for additional validations
         *
         * Performs validation
         */
        handleValidate: function() {
            var valInfo = this.validation;
            valInfo["notOptional"] = {
                "message": "",
                "status": this._validateOptional()
            };
            if (!this._validateOptional()) {
                valInfo["notOptional"]["message"] = Alpaca.getMessage("notOptional", this);
            }
            valInfo["disallowValue"] = {
                "message": "",
                "status": this._validateDisallow()
            };
            if (!this._validateDisallow()) {
                var text = this.schema["disallow"].join(',');
                valInfo["disallowValue"]["message"] = Alpaca.substituteTokens(Alpaca.getMessage("disallowValue", this), [text]);
            }
            return valInfo["notOptional"]["status"] && valInfo["disallowValue"]["status"];
        },
        
        /**
         * Checks whether validation is optional
         */
        _validateOptional: function() {
            if (this.isEmpty() && this.schema.required) {
                return false;
            }
            return true;
        },
        
        /**
         * Checks whether validation is optional
         */
        _validateDisallow: function() {
            var val = this.getValue();
            
            if (!Alpaca.isEmpty(this.schema.disallow)) {
                var disallow = this.schema.disallow;
                if (Alpaca.isArray(disallow)) {
                    var isAllowed = true;
                    $.each(disallow, function(index, value) {
                        if (Alpaca.compareObject(val, value)) {
                            isAllowed = false;
                        }
                    });
                    return isAllowed;
                } else {
                    return !Alpaca.compareObject(val, disallow);
                }
            }
            
            return true;
        },
        
        /**
         * Triggers any event handlers that want to listen to an update event for this field
         */
        triggerUpdate: function() {
            $(this.getEl()).trigger("fieldupdate");
        },
        
        /**
         * Disable the field
         */
        disable: function() {
            // OVERRIDE
        },
        
        /**
         * Enable the field
         */
        enable: function() {
            // OVERRIDE
        },
        
        /**
         * Focus the field
         */
        focus: function() {
            // OVERRIDE
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
         * Hide the field
         */
        print: function() {
            if (this.container.printArea) {
                this.container.printArea();
            }
        },
        
        /**
         * Reload the field
         */
        reload: function() {
            this.initializing = true;
            this.render();
        },
        
        /**
         * Clear the field.
         *
         * This resets the field to its original value (this.data)
         */
        clear: function(stopUpdateTrigger) {
            var newValue = null;
            
            if (this.data) {
                newValue = this.data;
            }
            
            if (newValue == null) {
                newValue = null;
            }
            
            this.setValue(newValue, stopUpdateTrigger);
        },
        
        /**
         * True if the field is empty
         */
        isEmpty: function() {
            return Alpaca.isValEmpty(this.getValue());
        },
        
        /**
         * True if this field is valid.
         */
        isValid: function() {
            return $.isEmptyObject(this.validation);
        },
        
        /**
         * Initialize events
         */
        initEvents: function() {
            var _this = this;
            // trigger control level handlers for things that happen to input element
            $(this.inputElement).change(function(e) {
                _this.onChange(e);
            });
            
            $(this.inputElement).focus(function(e) {
                _this.onFocus(e);
            });
            
            $(this.inputElement).blur(function(e) {
                _this.onBlur(e);
            });
        },
        
        /**
         * Highlights the entire field
         */
        onFocus: function(e) {
            $(this.getEl()).removeClass("alpaca-field-empty");
            $(this.getEl()).addClass("alpaca-field-focused");
        },
        
        /**
         * Unhighlights the entire field
         */
        onBlur: function(e) {
            $(this.getEl()).removeClass("alpaca-field-focused");
            
            // set class from state
            this.renderValidationState();
        },
        
        /**
         * Field value changed
         */
        onChange: function(e) {
            // store back into data element
            this.data = this.getValue();
            this.triggerUpdate();
        }        
    });
    
    // Registers additonal messages
    Alpaca.registerMessages({
        "disallowValue": "{0} are disallowed values.",
        "notOptional": "This field is not optional."
    });
    
    /**
     * Information about the arguments for this field
     * This isn't used at runtime
     * It's used with the form builder.
     */
    Alpaca.Field.groupSettings = [{
        name: "id",
        label: "ID",
        type: "string",
        description: "The ID to use for this field.  If not specified, an ID will automatically be generated.",
        optional: true,
        defaultValue: "An automatically generated ID"
    }, {
        name: "type",
        label: "Type",
        type: "string",
        description: "The ID of the field type to instantiate (i.e. 'text')",
        optional: true,
        defaultValue: "textfield"
    }, {
        name: "template",
        label: "Template",
        type: "string",
        description: "URL or text of the template to use to render this field",
        optional: true,
        defaultValue: "Stock template"
    }, {
        name: "validate",
        label: "Process Validation?",
        type: "boolean",
        description: "Whether to process validation for this field",
        optional: true,
        defaultValue: true
    }, {
        name: "fielClass",
        label: "Field CSS Class",
        type: "string",
        description: "Custom CSS class name to apply to the field element",
        optional: true,
        defaultValue: null
    }, {
        name: "disabled",
        label: "Disabled",
        type: "boolean",
        description: "Whether the field is disabled upon rendering",
        optional: true,
        defaultValue: false
    }];
    
})(jQuery);
