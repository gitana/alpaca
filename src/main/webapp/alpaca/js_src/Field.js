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
     *    id: <id>,                                     field id (optional)
     *    type: <type>,                                 field type (optional) - "text" if not specified
     *    schema: schema,                                  field schema (optional)
     *    settings: settings                            field settings (optional) - {} if not specified
     * }
     *
     * The settings block consists of the following:
     *
     * SETTINGS
     * {
     *    fieldClass: [<string>]                        optional - additional css classes to apply
     *    validate: <boolean>                            optional - whether to validate on change (true)
     *    disabled: <boolean>                           optional - whether to initialize as disabled (false)
     *    displayMessages: <boolean>                    optional - whether to display message (true)
     * }
     *
     * JSON SCHEMA:
     *
     * This class obeys JSON schema for:
     *
     * {
     *    optional: <boolean>                            [optional] (false)
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

            //TODO: this needs to be removed.
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

            if (Alpaca.isEmpty(this.options.readonly) && !Alpaca.isEmpty(this.schema.readonly)) {
                this.options.readonly = this.schema.readonly;
            }

            // data
            if (Alpaca.isValEmpty(this.data) && this.schema["default"]) {
                this.data = this.schema["default"];
            }

            // default path
            this.path = "/";

            // validation status
            this.validation = {};

            // backup data
            this.backupData = Alpaca.cloneObject(this.data);

        },

        /**
         *
         */
        getDefaultFieldTemplateId : function () {
            return "controlField";
        },

        /**
         * Sets up default rendition template from view
         */
        setDefaultTemplate: function() {
            var globalTemplate = Alpaca.getViewParam('globalTemplate', this);
            if (Alpaca.getTemplate(globalTemplate, this)) {
                globalTemplate = Alpaca.getTemplate(globalTemplate, this);
            }
            var layoutTemplate = Alpaca.getLayout("template", this);
            // Check to see if it is a template reference
            if (Alpaca.getTemplate(layoutTemplate, this)) {
                layoutTemplate = Alpaca.getTemplate(layoutTemplate, this);
            }
            if (globalTemplate) {
                this.setTemplate(globalTemplate);
                this.singleLevelRendering = true;
            } else if (layoutTemplate) {
                this.setTemplate(layoutTemplate);
            } else {
                this.setTemplate(Alpaca.getTemplate(this.getDefaultFieldTemplateId(), this));
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
            if (!Alpaca.isEmpty(this.data)) {
                this.setValue(this.data, true);
            }
        },

        /**
         * Renders this field into the container.
         * Creates an outerEl which is bound into the container.
         */
        render: function(view, callback) {
            if (view && (Alpaca.isString(view) || Alpaca.isObject(view))) {
                this.setView(view);
            } else {
                if (Alpaca.isEmpty(callback) && Alpaca.isFunction(view)) {
                    callback = view;
                }
            }
            this.setup();
            this._render(callback);
        },

        /**
         * Internal method for processing the render.
         */
        _render: function(callback) {
            var _this = this;

            // remove the previous outerEl if it exists
            if (this.getEl()) {
                this.getEl().remove();
            }

            // check if it needs to be wrapped in a form
            if (this.options.renderForm) {
                this.options.form.viewType = this.viewType;
                var form = this.form;
                if (!form) {
                    form = new Alpaca.Form(this.container, this.options.form);
                }
                form.render(function(form) {
                    // load the appropriate template and render it
                    _this._processRender(form.formFieldsContainer, function() {

                        // bind our field dom element into the container
                        _this.getEl().appendTo(form.formFieldsContainer);

                        // bind the top field to the form
                        form.topControl = _this;

                        if (_this.viewType && _this.viewType != 'view') {
                            form.initEvents();
                        }

                        _this.form = form;

                        // allow any post-rendering facilities to kick in
                        _this.postRender();

                        // callback
                        if (callback && Alpaca.isFunction(callback)) {
                            callback(_this);
                        }

                    });
                });
            } else {
                // load the appropriate template and render it
                this._processRender(this.container, function() {

                    // bind our field dom element into the container
                    _this.getEl().appendTo(_this.container);

                    // allow any post-rendering facilities to kick in
                    _this.postRender();

                    // callback
                    if (callback && Alpaca.isFunction(callback)) {
                        callback(_this);
                    }
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
                "schema": this.schema,
                "data": this.data,
                "view": this.getView(),
                "path": this.path
            }, {});
            renderedDomElement.appendTo(parentEl);
            this.setEl(renderedDomElement);

            if (!this.singleLevelRendering) {
                this.renderField(onSuccess);
            } else {
                if (onSuccess) {
                    onSuccess(this);
                }
            }
        },

        /**
         * Called after the rendering is complete as a way to make final modifications to the
         * dom elements that were produced.
         */
        postRender: function() {
            // add classes
            this.getEl().addClass("ui-widget alpaca-field");

            // for edit or create mode
            // injects Ids
            if (this.getEl().attr("id") == null) {
                this.getEl().attr("id", this.getId() + "-field-outer");
            }
            if (this.getEl().attr("alpaca-field-id") == null) {
                this.getEl().attr("alpaca-field-id", this.getId());
            }
            // optional
            if (this.schema.required) {
                this.getEl().addClass("alpaca-field-required");
            } else {
                this.getEl().addClass("alpaca-field-optional");
            }

            // readonly
            if (this.options.readonly) {
                this.getEl().addClass("alpaca-field-readonly");
                $(':input', this.getEl()).attr('readonly', 'on');
                $('select', this.getEl()).attr('disabled', 'on');
                $(':radio', this.getEl()).attr('disabled', 'on');
                $(':checkbox', this.getEl()).attr('disabled', 'on');
            }

            // Support for custom CSS class for the field
            var fieldClass = this.options["fieldClass"];
            if (fieldClass) {
                this.getEl().addClass(fieldClass);
            }

            // Support for custom styles provided by custom view
            var customStyles = Alpaca.getStyles(this);

            if (customStyles) {
                for (var styleClass in customStyles) {
                    $(styleClass, this.container).css(customStyles[styleClass]);
                }
            }

            // add required field style
            if (this.labelDiv && this.schema.required) {
                $('<span class="ui-icon ui-icon-star"></span>').prependTo(this.labelDiv);
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

            // for create view, hide all readonly fields
            if (!Alpaca.getViewParam('displayReadonly', this)) {
                $('.alpaca-field-readonly', this.getEl()).hide();
            }

            // field level post render
            if (this.options.postRender) {
                this.options.postRender(this);
            }

        },

        /**
         * Retrieves the rendering element
         */
        getEl: function() {
            return this.outerEl;
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
            //this.renderValidationState();
            /*
             if (!stopUpdateTrigger) {
             this.triggerUpdate();
             }
             */
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
        displayMessage: function(messages, beforeStatus) {
            // remove the message element if it exists
            var _this = this;
            if (beforeStatus == false) {
                $("#[id^='" + _this.getId() + "-field-message']", _this.getEl()).remove();
            }
            // add message and generate it
            if (messages && messages.length > 0) {
                $.each(messages, function(index, message) {
                    if (message.length > 0) {
                        var messageTemplate = Alpaca.getTemplate("controlFieldMessage", _this);
                        if (messageTemplate) {
                            _this.messageElement = $.tmpl(messageTemplate, {
                                "message": message
                            });
                            //_this.messageElement.addClass("alpaca-field-message");
                            _this.messageElement.addClass("ui-state-error-text alpaca-controlfield-message");
                            _this.messageElement.attr("id", _this.getId() + '-field-message-' + index);
                            // check to see if we have a message container rendered
                            if ($('.alpaca-controlfield-message-container', _this.getEl()).length) {
                                _this.messageElement.appendTo($('.alpaca-controlfield-message-container', _this.getEl()));
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
                this.getEl().removeClass("alpaca-field-invalid ui-state-error");
                //this.getEl().removeClass("alpaca-field-invalid");
                this.getEl().removeClass("alpaca-field-valid");

                var beforeStatus = this.isValid();

                // this runs validation
                if (this.validate()) {
                    this.getEl().addClass("alpaca-field-valid");
                } else {
                    //this.getEl().addClass("alpaca-field-invalid");
                    this.getEl().addClass("ui-state-error alpaca-field-invalid");
                }

                var afterStatus = this.isValid();

                // Allow for the message to change
                if (this.options.showMessages) {
                    if (!this.initializing) {
                        var messages = [];
                        for (var messageId in this.validation) {
                            if (!this.validation[messageId]["status"]) {
                                messages.push(this.validation[messageId]["message"]);
                            }
                        }
                        this.displayMessage(messages, beforeStatus);
                    }
                }
                // Revalidate parents if validation state changed
                if (beforeStatus != afterStatus && this.parent && this.parent.renderValidationState) {
                    this.parent.renderValidationState();
                }

                this._validateCustomValidator();
            }
        },

        /**
         * Updates validation based on provide valinfo. This function is for user provided validator.
         *
         * @param valId
         * @param valInfo
         */
        updateValidationState: function(valId, valInfo) {
            if (this.options.validate) {

                var beforeStatus = this.isValid();
                // Push the message
                this.validation[valId] = valInfo;

                if (valInfo && !valInfo.status) {
                    this.getEl().removeClass("alpaca-field-valid");
                    this.getEl().addClass("ui-state-error alpaca-field-invalid");
                }

                // Push the message
                this.validation[valId] = valInfo;

                // Allow for the message to change
                if (this.options.showMessages) {
                    if (!this.initializing) {
                        var messages = [];
                        for (var messageId in this.validation) {
                            if (!this.validation[messageId]["status"]) {
                                messages.push(this.validation[messageId]["message"]);
                            }
                        }
                        this.displayMessage(messages, beforeStatus);
                    }
                }
                // Revalidate parents if validation state changed

                if (this.isValid() && this.parent && this.parent.renderValidationState) {
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

            var status = this._validateOptional();
            valInfo["notOptional"] = {
                "message": status ? "" : Alpaca.getMessage("notOptional", this),
                "status": status
            };

            status = this._validateDisallow();
            valInfo["disallowValue"] = {
                "message": status ? "" : Alpaca.substituteTokens(Alpaca.getMessage("disallowValue", this), [this.schema["disallow"].join(',')]),
                "status": status
            };

            //this._validateCustomValidator();

            return valInfo["notOptional"]["status"] && valInfo["disallowValue"]["status"];
        },

        /**
         * Validates user provided validator.
         */
        _validateCustomValidator: function() {
            var _this = this;
            if (this.options.validator && Alpaca.isFunction(this.options.validator)) {
                this.options.validator(this, function(valInfo) {
                    _this.updateValidationState('customValidator', valInfo);
                });
            }
        },

        /**
         * Checks whether validation is optional
         */
        _validateOptional: function() {
            if (this.schema.required && this.isEmpty()) {
                return false;
            }
            return true;
        },

        /**
         * Checks whether the value is allowed
         */
        _validateDisallow: function() {
            if (!Alpaca.isValEmpty(this.schema.disallow)) {
                var val = this.getValue();
                var disallow = this.schema.disallow;
                if (Alpaca.isArray(disallow)) {
                    var isAllowed = true;
                    $.each(disallow, function(index, value) {
                        if ((Alpaca.isObject(val) || Alpaca.isArray(val)) && Alpaca.isString(value)) {
                            value = $.parseJSON(value);
                        }
                        if (Alpaca.compareObject(val, value)) {
                            isAllowed = false;
                        }
                    });
                    return isAllowed;
                } else {
                    if ((Alpaca.isObject(val) || Alpaca.isArray(val)) && Alpaca.isString(disallow)) {
                        disallow = $.parseJSON(disallow);
                    }
                    return !Alpaca.compareObject(val, disallow);
                }
            }

            return true;
        },

        /**
         * Triggers any event handlers that want to listen to an update event for this field
         */
        triggerUpdate: function() {
            this.getEl().trigger("fieldupdate");
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
         * Hide the field
         */
        hide: function() {
            this.getEl().css({
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


            if (this.callback != null) {
                this.callback(this, this.renderedCallback);
            } else {
                this.render(this.renderedCallback);
            }

            //this.render();
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
        isValid: function(checkChildren) {
            if ($.isEmptyObject(this.validation)) {
                return true;
            } else {
                for (var key in this.validation) {
                    if (!this.validation[key].status) {
                        return false;
                    }
                }
                if (this.children && checkChildren) {
                    for (var i = 0; i < this.children.length; i++) {
                        var child = this.children[i];
                        if (!child.isValid(checkChildren)) {
                            return false;
                        }
                    }
                }
                return true;
            }
        },

        /**
         * Initialize events
         */
        initEvents: function() {
            var _this = this;
            // trigger control level handlers for things that happen to input element
            this.field.change(function(e) {
                _this.onChange(e);
            });

            this.field.focus(function(e) {
                _this.onFocus(e);
            });

            this.field.blur(function(e) {
                _this.onBlur(e);
            });
        },

        /**
         * Highlights the entire field
         */
        onFocus: function(e) {
            this.getEl().removeClass("alpaca-field-empty");
            this.getEl().addClass("alpaca-field-focused");
        },

        /**
         * Unhighlights the entire field
         */
        onBlur: function(e) {
            this.getEl().removeClass("alpaca-field-focused");

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
        },

        /**
         * Gets field control via path
         *
         * @param path
         */
        getControlByPath: function(path) {
            var parentControl = this;
            if (path) {
                var pathArray = path.split('/');
                for (var i = 0; i < pathArray.length; i++) {
                    if (!Alpaca.isValEmpty(pathArray[i])) {
                        if (parentControl && parentControl.childrenByPropertyId) {
                            //check to see if we need to add the properties field
                            if (parentControl.childrenByPropertyId[pathArray[i]]) {
                                parentControl = parentControl.childrenByPropertyId[pathArray[i]];
                            } else {
                                return null;
                            }
                        } else {
                            return null;
                        }
                    } else {
                        return null;
                    }
                }
                return parentControl;
            }
        },

        // Utility Functions for Form Builder		
        /**
         * Returns field type
         */
        getFieldType: function() {

        },

        /**
         * Returns schema type
         */
        getType: function() {

        },

        /**
         * Returns true if it is a container
         */
        isContainer: function() {
            return false;
        },

        /**
         * Returns field title
         */
        getTitle: function() {

        },

        /**
         * Returns field description
         */
        getDescription: function() {

        },

        /**
         * Returns schema of the schema
         */
        getSchemaOfSchema: function() {
            var schemaOfSchema = {
                "title": this.getTitle(),
                "description": this.getDescription(),
                "type": "object",
                "properties": {
                    "title": {
                        "title": "Title",
                        "description": "Property short description",
                        "type": "string"
                    },
                    "description": {
                        "title": "Description",
                        "description": "Property detailed description",
                        "type": "string"
                    },
                    "readonly": {
                        "title": "Readonly",
                        "description": "Property will be read only if true",
                        "type": "boolean",
                        "default": false
                    },
                    "required": {
                        "title": "Required",
                        "description": "Property value must be set if true",
                        "type": "boolean",
                        "default": false
                    },
                    "default": {
                        "title": "Default",
                        "description": "Property default value",
                        "type": "any"
                    },
                    "type": {
                        "title": "Type",
                        "description": "Property data type",
                        "type": "string",
                        "readonly": true
                    },
                    "format": {
                        "title": "Format",
                        "description": "Property data format",
                        "type": "string"
                    },
                    "disallow": {
                        "title": "Disallow",
                        "description": "Disallowed values for the property",
                        "type": "array"
                    },
                    "dependencies": {
                        "title": "Dependencies",
                        "description": "Property Dependencies",
                        "type": "array"
                    }
                }
            };
            if (this.getType && !Alpaca.isValEmpty(this.getType())) {
                schemaOfSchema.properties.type['default'] = this.getType();
                schemaOfSchema.properties.type['enum'] = [this.getType()];
            }
            return schemaOfSchema;
        },

        /**
         * Returns options for the schema
         */
        getOptionsForSchema: function() {
            return {
                "fields": {
                    "title": {
                        "helper": "Field short description",
                        "type": "text"
                    },
                    "description": {
                        "helper": "Field detailed description",
                        "type": "textarea"
                    },
                    "readonly": {
                        "helper": "Field will be read only if checked",
                        "rightLabel":"Is this field read only ?",
                        "type": "checkbox"
                    },
                    "required": {
                        "helper": "Field value must be set if checked",
                        "rightLabel":"Is this field required ?",
                        "type": "checkbox"
                    },
                    "default": {
                        "helper": "Field default value",
                        "type": "textarea"
                    },
                    "type": {
                        "helper": "Field data type",
                        "type": "text"
                    },
                    "format": {
                        "type": "select",
                        "dataSource": function(field, callback) {
                            for (var key in Alpaca.defaultFormatFieldMapping) {
                                field.selectOptions.push({
                                    "value": key,
                                    "text": key
                                });
                            }
                            if (callback) {
                                callback();
                            }
                        }
                    },
                    "disallow": {
                        "helper": "Disallowed values for the field",
                        "itemLabel":"Value",
                        "type": "array"
                    },
                    "dependencies": {
                        "helper": "Field Dependencies",
                        "multiple":true,
                        "size":3,
                        "type": "select",
                        "dataSource": function (field, callback) {
                            if (field.parent && field.parent.schemaParent && field.parent.schemaParent.parent) {
                                for (var key in field.parent.schemaParent.parent.childrenByPropertyId) {
                                    if (key != field.parent.schemaParent.propertyId) {
                                        field.selectOptions.push({
                                            "value": key,
                                            "text": key
                                        });
                                    }
                                }
                            }
                            if (callback) {
                                callback();
                            }
                        }
                    }
                }
            }
        },
        /**
         * Returns schema of the options
         */
        getSchemaOfOptions: function() {
            var schemaOfOptions = {
                "title": "Options for " + this.getTitle(),
                "description": this.getDescription() + " (Options)",
                "type": "object",
                "properties": {
                    "renderForm": {},
                    "form":{},
                    "id": {
                        "title": "Field Id",
                        "description": "Unique field id. Auto-generated if not provided.",
                        "type": "string"
                    },
                    "type": {
                        "title": "Field Type",
                        "description": "Field type",
                        "type": "string",
                        "default": this.getFieldType(),
                        "readonly": true
                    },
                    "validate": {
                        "title": "Validation",
                        "description": "Field validation is required if true",
                        "type": "boolean",
                        "default": true
                    },
                    "showMessages": {
                        "title": "Show Messages",
                        "description": "Display validation messages if true",
                        "type": "boolean",
                        "default": true
                    },
                    "disabled": {
                        "title": "Disabled",
                        "description": "Field disabled if true",
                        "type": "boolean",
                        "default": false
                    },
                    "label": {
                        "title": "Label",
                        "description": "Field label",
                        "type": "string"
                    },
                    "helper": {
                        "title": "Helper",
                        "description": "Field help message",
                        "type": "string"
                    },
                    "fieldClass": {
                        "title": "Style Class",
                        "description": "Additional field style class",
                        "type": "string"
                    }
                }
            };
            if (this.isTopLevel()) {
                schemaOfOptions.properties.renderForm = {
                    "title": "Render Form",
                    "description": "Render form tag as container for rest of fields.",
                    "type": "boolean",
                    "default": false
                };

                schemaOfOptions.properties.form = {
                    "title": "Form",
                    "description": "Options for form",
                    "type": "object",
                    "dependencies" : "renderForm",
                    "properties": {
                        "attributes": {
                            "title": "Form Attributes",
                            "description": "Form attributes",
                            "type": "object",
                            "properties": {
                                "id": {
                                    "title": "Id",
                                    "description": "Unique form id. Auto-generated if not provided.",
                                    "type": "string"
                                },
                                "action": {
                                    "title": "Action",
                                    "description": "Form submission endpoint",
                                    "type": "string"
                                },
                                "method": {
                                    "title": "Method",
                                    "description": "Form submission method",
                                    "enum":["post","get"],
                                    "type": "string"
                                },
                                "name": {
                                    "title": "Name",
                                    "description": "Form name",
                                    "type": "string"
                                }
                            }
                        },
                        "buttons": {
                            "title": "Button Options",
                            "description": "Button options",
                            "type": "object",
                            "properties": {
                                "submit": {
                                    "title": "Submit Button",
                                    "description": "Render submit button.",
                                    "type": "boolean",
                                    "default": true
                                },
                                "reset": {
                                    "title": "Reset Button",
                                    "description": "Render reset button.",
                                    "type": "boolean",
                                    "default": true
                                },
                                "save": {
                                    "title": "Save Button",
                                    "description": "Render save button.",
                                    "type": "boolean"
                                },
                                "reload": {
                                    "title": "Reload Button",
                                    "description": "Render reload button.",
                                    "type": "boolean"
                                },
                                "print": {
                                    "title": "Print Button",
                                    "description": "Render print button.",
                                    "type": "boolean"
                                },
                                "switchView": {
                                    "title": "View Switch Button",
                                    "description": "Render view switch button.",
                                    "type": "boolean"
                                }
                            }
                        }
                    }
                }
            } else {
                delete schemaOfOptions.properties.renderForm;
                delete schemaOfOptions.properties.form;
            }

            return schemaOfOptions;
        },

        /**
         * Returns options for the options
         */
        getOptionsForOptions: function() {
            var optionsForOptions = {
                "type": "object",
                "fields": {
                    "id": {
                        "type": "text",
                        "readonly": true
                    },
                    "type": {
                        "type": "text"
                    },
                    "validate": {
                        "rightLabel":"Is validation enforced ?",
                        "type": "checkbox"
                    },
                    "showMessages": {
                        "rightLabel":"Show validation messages ?",
                        "type": "checkbox"
                    },
                    "disabled": {
                        "rightLabel":"Disable this field ?",
                        "type": "checkbox"
                    },
                    "label": {
                        "type": "text"
                    },
                    "helper": {
                        "type": "textarea"
                    },
                    "fieldClass": {
                        "type": "text"
                    }
                }
            };
            if (this.isTopLevel()) {
                optionsForOptions.fields.renderForm = {
                    "type": "checkbox",
                    "rightLabel": "Yes"
                };
                optionsForOptions.fields.form = {
                    "type": "object",
                    "dependencies" : {
                        "renderForm" : true
                    },
                    "fields": {
                        "attributes": {
                            "type": "object",
                            "fields": {
                                "id": {
                                    "type": "text",
                                    "readonly": true
                                },
                                "action": {
                                    "type": "text"
                                },
                                "method": {
                                    "type": "select"
                                },
                                "name": {
                                    "type": "text"
                                }
                            }
                        },
                        "buttons": {
                            "type": "object",
                            "fields": {
                                "submit": {
                                    "rightLabel": "Yes",
                                    "type": "checkbox"
                                },
                                "reset": {
                                    "rightLabel": "Yes",
                                    "type": "checkbox"
                                },
                                "save": {
                                    "rightLabel": "Yes",
                                    "type": "checkbox"
                                },
                                "reload": {
                                    "rightLabel": "Yes",
                                    "type": "checkbox"
                                },
                                "print": {
                                    "rightLabel": "Yes",
                                    "type": "checkbox"
                                },
                                "viewSwitch": {
                                    "rightLabel": "Yes",
                                    "type": "checkbox"
                                }
                            }
                        }
                    }
                }
            }

            return optionsForOptions;
        }
    });

    // Registers additonal messages
    Alpaca.registerMessages({
        "disallowValue": "{0} are disallowed values.",
        "notOptional": "This field is not optional."
    });

})(jQuery);
