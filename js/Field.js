(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Field = Base.extend(
    /**
     * @lends Alpaca.Field.prototype
     */
    {
        /**
         * @constructs
         *
         * @class Abstract class that served as base for all Alpaca field classes that provide actual implementation.
         *
         * @param {Object} container Field container.
         * @param {Any} data Field data.
         * @param {Object} options Field options.
         * @param {Object} schema Field schema.
         * @param {Object|String} view Field view.
         * @param {Alpaca.Connector} connector Field connector.
         * @param {Function} errorCallback Error callback.
         */
        constructor: function(container, data, options, schema, view, connector, errorCallback) {
            // mark that we are initializing
            this.initializing = true;

            // container
            this.container = container;

            // parent
            this.parent = null;
            this.data = data;
            this.options = options;
            this.schema = schema;
            this.connector = connector;
            this.errorCallback = errorCallback;

            if (!this.errorCallback) {
                this.errorCallback = function(error) {
                    alert(error.message ? error.message : "Caught some error!");
                }
            }

            // check if this field rendering is single-level or not
            this.singleLevelRendering = false;

            this.view = new Alpaca.View(view, this);

            // things we can draw off the options
            var noOptions = false;
            if (!this.options) {
                this.options = {};
                noOptions = true;
            }
            this.id = this.options.id;
            this.type = this.options.type;

            // setup defaults
            if (!this.id) {
                this.id = Alpaca.generateId();
            }
            var noSchema = false;
            if (!this.schema) {
                this.schema = {};
                noSchema = true;
            }
            if (this.options.label == null && this.schema.title != null) {
                this.options.label = this.schema.title;
            }

            if (this.options.helper == null && this.schema.description != null) {
                this.options.helper = this.schema.description;
            }


            if (Alpaca.isEmpty(this.options.readonly) && !Alpaca.isEmpty(this.schema.readonly)) {
                this.options.readonly = this.schema.readonly;
            }

            // data
            if (Alpaca.isValEmpty(this.data) && !Alpaca.isEmpty(this.schema["default"])) {
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
         * Returns default field template id. It would be "filedSet" for container fields and
         * "controlField" for none-container fields.
         *
         * @returns {String} Default field template id.
         */
        getDefaultFieldTemplateId : function () {
            return "controlField";
        },

        /**
         * Sets up default rendition template from view.
         */
        setDefaultTemplate: function() {
            var globalTemplate = this.view.getGlobalTemplate();
            var layoutTemplate = this.view.getLayout().template;
            if (globalTemplate) {
                this.setTemplate(globalTemplate);
                this.singleLevelRendering = true;
            } else if (layoutTemplate) {
                this.setTemplate(layoutTemplate);
            } else {
                this.setTemplate(this.view.getTemplate(this.getDefaultFieldTemplateId()));
            }
        },

        /**
         * This method will be called right after the field instance is created. It will initialize
         * the field to get it ready for rendition.
         */
        setup: function() {

            if (!this.initializing) {
                this.data = this.getValue();
            }

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
                this.setValue(this.data);
            }
        },

        /**
         * Renders this field into the container and creates a DOM element which is bound into the container.
         *
         * @param {Object|String} view View to be used for rendering field (optional).
         * @param {Function} callback Post-Render callback (optional).
         */
        render: function(view, callback) {
            if (view && (Alpaca.isString(view) || Alpaca.isObject(view))) {
                this.view.setView(view);
            } else {
                if (Alpaca.isEmpty(callback) && Alpaca.isFunction(view)) {
                    callback = view;
                }
            }
            // last try to see if we can populate the label from propertyId
            if (this.options.label == null && this.propertyId) {
                this.options.label = this.propertyId;
            }

            // make a copy of name field
            if (this.options.name) {
                this.name = this.options.name;
            }

            // set default name value if it is not provided through options.
            if (!this.name) {
                // has path?
                if (this.parent && this.parent.name && this.path) {
                    var lastSegment = this.path.substring(this.path.lastIndexOf('/')+1);
                    if (lastSegment.indexOf("[") != -1 && lastSegment.indexOf("]") != -1) {
                        lastSegment = lastSegment.substring(lastSegment.indexOf("[") + 1, lastSegment.indexOf("]"));
                    }
                    if (lastSegment) {
                        this.name = this.parent.name + "_" + lastSegment;
                        this.nameCalculated = true;
                    }
                } else {
                    if (this.path) {
                       this.name = this.path.replace(/\//g,"").replace(/\[/g,"_").replace(/\]/g,"");
                       this.nameCalculated = true;
                    }
                }
            }
            this.setup();
            this._render(callback);
        },

        /**
         * Internal method for processing the render.
         *
         * @private
         * @param {Function} callback Post-render callback.
         */
        _render: function(callback) {
            var _this = this;

            // remove the previous outerEl if it exists
            if (this.getEl()) {
                this.getEl().remove();
            }

            // check if it needs to be wrapped in a form
            if (this.options.renderForm) {
                this.options.form.viewType = /*this.viewType*/this.view.type;
                var form = this.form;
                if (!form) {
                    form = new Alpaca.Form(this.container, this.options.form, this.view.viewObject, this.connector, this.errorCallback);
                }
                form.render(function(form) {
                    // load the appropriate template and render it
                    _this._processRender(form.formFieldsContainer, function() {
                        // bind our field dom element into the container
                        _this.getEl().appendTo(form.formFieldsContainer);
                        // bind the top field to the form
                        form.topControl = _this;
                        if (_this.view.type && _this.view.type != 'view') {
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
         *
         * @private
         *
         * @param {Object} parentEl Field container.
         * @param {Function} onSuccess onSuccess callback.
         */
        _processRender: function(parentEl, onSuccess) {
            var _this = this;

            // lookup the template we should use to render
            var template = this.getTemplate();

            // if we have a template to load, load it and then render
            this.connector.loadTemplate(template, function(loadedTemplate) {
                var tmp = loadedTemplate;
                if ($(tmp)[0] && $(tmp)[0].tagName.toLowerCase() == 'script' && $(tmp).attr('type') == 'text/x-jquery-tmpl') {
                    loadedTemplate = $(tmp).html();
                }
                _this._renderLoadedTemplate(parentEl, loadedTemplate, onSuccess);
            }, function(error) {
                _this.errorCallback(error);
            });
        },

        /**
         * Renders the loaded template.
         *
         * @internal
         *
         * @param {Object} parentEl Field container.
         * @param {String} templateString Template for rendering.
         * @param {Function} onSuccess onSuccess callback.
         */
        _renderLoadedTemplate: function(parentEl, templateString, onSuccess) {
            // render field template
            var renderedDomElement = $.tmpl(templateString, {
                "id": this.getId(),
                "options": this.options,
                "schema": this.schema,
                "data": this.data,
                "view": this.view.viewObject,
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
         * Renders DOM elements for this field.
         *
         * @param onSuccess {Function} onSuccess callback.
         */
        renderField: function(onSuccess) {
        },

        /**
         * Applies style injection function for the provided item key.
         *
         * @param key item key for style injection
         * @param targetDiv target DIV of style injection
         */
        getStyleInjection: function(key,targetDiv) {
            if (this.view.style && Alpaca.styleInjections[this.view.style] && Alpaca.styleInjections[this.view.style][key]) {
                Alpaca.styleInjections[this.view.style][key].call(this,targetDiv);
            }
        },

        /**
         * This method will be called after the field rendition is complete. It is served as a way to make final
         * modifications to the dom elements that were produced.
         */
        postRender: function() {

            // try to avoid adding unnecessary injections for display view.
            if (this.view.type != 'view') {

                // add classes
                this.getStyleInjection('field',this.getEl());

                this.getEl().addClass("alpaca-field");

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
                    $(':input', this.getEl()).attr('readonly', 'readonly');
                    $('select', this.getEl()).attr('disabled', 'disabled');
                    $(':radio', this.getEl()).attr('disabled', 'disabled');
                    $(':checkbox', this.getEl()).attr('disabled', 'disabled');
                }

                // hidden
                if (this.options.hidden) {
                    this.getEl().hide();
                }

                // Support for custom CSS class for the field
                var fieldClass = this.options["fieldClass"];
                if (fieldClass) {
                    this.getEl().addClass(fieldClass);
                }

                // Support for custom styles provided by custom view
                var customStyles = this.view.getStyles();

                if (customStyles) {
                    for (var styleClass in customStyles) {
                        $(styleClass, this.container).css(customStyles[styleClass]);
                    }
                }

                // add required field style
                if (this.labelDiv && this.schema.required) {
                    this.getStyleInjection('required',this.labelDiv);
                }

                // after render
                if (this.options.disabled) {
                    this.disable();
                }
                // bind data
                if (this.view.type && this.view.type == 'edit') {
                    this.bindData();
                }
                // initialize events (after part of the dom)
                if (this.view.type && this.view.type != 'view') {
                    this.initEvents();
                }
            }

            // finished initializing
            this.initializing = false;

            this.hideInitValidationError = Alpaca.isValEmpty(this.options.hideInitValidationError) ? false : this.options.hideInitValidationError;

            // final call to update validation state
            if (this.view.type != 'view') {
                this.renderValidationState();
            }

            this.hideInitValidationError = false;

            // for create view, hide all readonly fields
            if (!this.view.displayReadonly) {
                $('.alpaca-field-readonly', this.getEl()).hide();
            }

            // field level post render
            if (this.options.postRender) {
                this.options.postRender(this);
            }

        },

        /**
         * Retrieves the rendered DOM element.
         *
         * @returns {Object} The rendered DOM element.
         */
        getEl: function() {
            return this.outerEl;
        },

        /**
         * Sets the outer element of the DOM element to be rendered by this field.
         *
         * @param outerEl New outer element for this field.
         */
        setEl: function(outerEl) {
            this.outerEl = outerEl;
        },

        /**
         * Returns the id of the field.
         *
         * @returns Field id.
         */
        getId: function() {
            return this.id;
        },

        /*        getType: function() {
         return this.type;
         },*/

        /**
         * Returns this field's parent.
         *
         * @returns {Alpaca.Field} Field parent.
         */
        getParent: function() {
            return this.parent;
        },

        /**
         * Finds if this field is top level.
         *
         * @returns {Boolean} True if this field is the top level one, false otherwise.
         */
        isTopLevel: function() {
            return Alpaca.isEmpty(this.parent);
        },

        /**
         * Returns the value of this field.
         *
         * @returns {Any} value Field value.
         */
        getValue: function() {
            return this.data;
        },

        /**
         * Sets the value of the field.
         *
         * @param {Any} value Value to be set.
         */
        setValue: function(value) {
            this.data = value;
            this.triggerUpdate();
        },

        /**
         * Resets value to default.
         */
        setDefault: function() {
        },

        /**
         * Returns the field template.
         *
         * @returns {String} Field template.
         */
        getTemplate: function() {
            return this.template;
        },

        /**
         * Sets the field template.
         *
         * @param {String} template Template to be set.
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
         * Renders a validation state message below the field.
         *
         * @param {String} messages Validation state messages.
         * @param {Boolean} beforeStatus Previous validation status.
         */
        displayMessage: function(messages, beforeStatus) {
            // remove the message element if it exists
            var _this = this;
            if (beforeStatus == false) {
                $("[id^='" + _this.getId() + "-field-message']", _this.getEl()).remove();
            }
            // add message and generate it
            if (messages && messages.length > 0) {
                $.each(messages, function(index, message) {
                    if (message.length > 0) {
                        var messageTemplate = _this.view.getTemplate("controlFieldMessage");
                        if (messageTemplate) {
                            _this.messageElement = $.tmpl(messageTemplate, {
                                "message": message
                            });
                            _this.getStyleInjection('errorMessage',_this.messageElement);
                            if (_this.hideInitValidationError) {
                                _this.messageElement.addClass("alpaca-controlfield-message-hidden");
                            } else {
                                _this.messageElement.addClass("alpaca-controlfield-message");
                            }
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
         * Injects styles to the DOM of the rendered field reflects the validation state
         * of the field. If necessary, displays validation messages as well.
         */
        renderValidationState: function() {
            if (this.options.validate) {
                // remove all previous markers
                this.getStyleInjection("removeError",this.getEl());
                this.getEl().removeClass("alpaca-field-invalid alpaca-field-invalid-hidden alpaca-field-valid");

                var beforeStatus = this.isValid();

                // this runs validation
                if (this.validate()) {
                    this.getEl().addClass("alpaca-field-valid");
                } else {
                    //this.getStyleInjection("error",this.getEl());
                    if (!this.hideInitValidationError) {
                        this.getStyleInjection("error",this.getEl());
                        this.getEl().addClass("alpaca-field-invalid");
                    } else {
                        this.getEl().addClass("alpaca-field-invalid-hidden");
                    }
                }

                var afterStatus = this.isValid();

                // Allow for the message to change
                if (this.options.showMessages /*&& !this.hideInitValidationError*/) {
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
                // Re-validate parents if validation state changed
                var forceRevalidation = false;
                var parent = this.parent;
                while (parent) {
                    // if parent has custom validator, it should re-validate.
                    if (parent.options && (parent.options.forceRevalidation || parent.options.validator)) {
                        forceRevalidation = true;
                    }
                    parent = parent.parent;
                }
                if ((beforeStatus != afterStatus && this.parent && this.parent.renderValidationState) || forceRevalidation) {
                    this.parent.renderValidationState();
                }
                this._validateCustomValidator();
            }
        },

        showHiddenMessages: function() {
            var hiddenDiv = $('.alpaca-field-invalid-hidden', this.outerEl);
            hiddenDiv.removeClass('alpaca-field-invalid-hidden');
            this.getStyleInjection('error',hiddenDiv);
            hiddenDiv.addClass('alpaca-field-invalid');
            $('.alpaca-controlfield-message-hidden', this.outerEl).removeClass('alpaca-controlfield-message-hidden').addClass('alpaca-controlfield-message');
        },

        /**
         * Updates validation based on provided validation information. This method is for user provided
         * custom validator only.
         *
         * @param {String} valId Validator id.
         * @param {Object} valInfo Object that contains validation information.
         */
        updateValidationState: function(valId, valInfo) {
            if (this.options.validate) {

                var beforeStatus = this.isValid();
                // Push the message
                this.validation[valId] = valInfo;

                if (valInfo && !valInfo.status) {
                    this.getEl().removeClass("alpaca-field-valid");
                    this.getStyleInjection("error",this.getEl());
                    this.getEl().addClass("alpaca-field-invalid");
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
         *
         * @returns {Boolean} True if value of this field is valid, false otherwise.
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
         * Performs validation.
         */
        handleValidate: function() {
            var valInfo = this.validation;

            var status = this._validateOptional();
            valInfo["notOptional"] = {
                "message": status ? "" : this.view.getMessage("notOptional"),
                "status": status
            };

            status = this._validateDisallow();
            valInfo["disallowValue"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.view.getMessage("disallowValue"), [this.schema["disallow"].join(',')]),
                "status": status
            };

            return valInfo["notOptional"]["status"] && valInfo["disallowValue"]["status"];
        },

        /**
         * Validates using user provided validator.
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
         * Validates against required property.
         *
         * @returns {Boolean} False if this field value is empty but required, true otherwise.
         */
        _validateOptional: function() {
            if (this.schema.required && this.isEmpty()) {
                return false;
            }
            return true;
        },

        /**
         * Checks whether the field value is allowed or not.
         *
         * @returns {Boolean} True if the field value is allowed, false otherwise.
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
         * Triggers any event handlers that listens to the update event of this field.
         */
        triggerUpdate: function() {
            this.getEl().trigger("fieldupdate");
        },

        /**
         * Disables the field.
         */
        disable: function() {
            // OVERRIDE
        },

        /**
         * Enables the field.
         */
        enable: function() {
            // OVERRIDE
        },

        /**
         * Focuses on the field.
         */
        focus: function() {
            // OVERRIDE
        },

        /**
         * Purges any event listeners and remove this field from the DOM.
         */
        destroy: function() {
            this.getEl().remove();
        },

        /**
         * Shows the field.
         */
        show: function() {
            if (this.options && this.options.hidden) {
                return;
            } else {
                this.getEl().css({
                    "display": ""
                });
            }
        },

        /**
         * Hides the field.
         */
        hide: function() {
            this.getEl().css({
                "display": "none"
            });
        },

        /**
         * Prints the field.
         */
        print: function() {
            if (this.container.printArea) {
                this.container.printArea();
            }
        },

        /**
         * Reloads the field.
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
         * Clears the field and resets the field to its original value.
         */
        clear: function() {
            var newValue = null;

            if (this.data) {
                newValue = this.data;
            }

            this.setValue(newValue);
        },

        /**
         * Finds if the value of this field is empty.
         *
         * @return {Boolean} True if the field value is empty, false otherwise.
         */
        isEmpty: function() {
            return Alpaca.isValEmpty(this.getValue());
        },

        /**
         * Finds if this field is valid.
         *
         * @return {Boolean} True if the field is valid, false otherwise.
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
         * Initializes event handling.
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
            // register general event handlers through options
            $.each(this.options, function(key, func) {
                if (Alpaca.startsWith(key,'onField') && Alpaca.isFunction(func)) {
                    var event = key.substring(7).toLowerCase();
                    _this.field.on(event, function(e) {
                        func.call(_this,e);
                    });
                }
            })
        },

        /**
         * Handler for the event that highlights the entire field.
         *
         * @param e Event.
         */
        onFocus: function(e) {
            this.getEl().removeClass("alpaca-field-empty");
            this.getEl().addClass("alpaca-field-focused");
        },

        /**
         * Handler for the event that un-highlights the entire field.
         *
         * @param e Event.
         */
        onBlur: function(e) {
            this.getEl().removeClass("alpaca-field-focused");

            // set class from state
            this.renderValidationState();
        },

        /**
         * Handler for the field value change event.
         *
         * @param e Event.
         */
        onChange: function(e) {
            // store back into data element
            this.data = this.getValue();
            this.triggerUpdate();
        },

        /**
         * Finds a field control by its path.
         *
         * @param {String} path Field control path.
         * @returns {Alpaca.Field} Field control mapped to the path.
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
         * Returns field type.
         *
         * @returns {String} Field type.
         */
        getFieldType: function() {

        },

        /**
         * Returns schema data type.
         *
         * @returns {String} Schema data type.
         */
        getType: function() {

        },//__BUILDER_HELPERS

        /**
         * Finds if this field is a container of other fields.
         *
         * @returns {Boolean} True if it is a container, false otherwise.
         */
        isContainer: function() {
            return false;
        },

        /**
         * Returns field title.
         *
         * @returns {String} Field title.
         */
        getTitle: function() {

        },

        /**
         * Returns field description.
         *
         * @returns {String} Field description.
         */
        getDescription: function() {

        },

        /**
         * Returns JSON schema of the schema properties that are managed by this class.
         *
         * @private
         * @returns {Object} JSON schema of the schema properties that are managed by this class.
         */
        getSchemaOfSchema: function() {
            var schemaOfSchema = {
                "title": this.getTitle(),
                "description": this.getDescription(),
                "type": "object",
                "properties": {
                    "title": {
                        "title": "Title",
                        "description": "Short description of the property.",
                        "type": "string"
                    },
                    "description": {
                        "title": "Description",
                        "description": "Detailed description of the property.",
                        "type": "string"
                    },
                    "readonly": {
                        "title": "Readonly",
                        "description": "Property will be readonly if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "required": {
                        "title": "Required",
                        "description": "Property value must be set if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "default": {
                        "title": "Default",
                        "description": "Default value of the property.",
                        "type": "any"
                    },
                    "type": {
                        "title": "Type",
                        "description": "Data type of the property.",
                        "type": "string",
                        "readonly": true
                    },
                    "format": {
                        "title": "Format",
                        "description": "Data format of the property.",
                        "type": "string"
                    },
                    "disallow": {
                        "title": "Disallow",
                        "description": "List of disallowed values for the property.",
                        "type": "array"
                    },
                    "dependencies": {
                        "title": "Dependencies",
                        "description": "List of property dependencies.",
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
         * Returns Alpaca options for the schema properties that managed by this class.
         *
         * @private
         * @returns {Object} Alpaca options for the schema properties that are managed by this class.
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
         * Returns JSON schema of the Alpaca options that are managed by this class.
         *
         * @private
         * @returns {Object} JSON schema of the Alpaca options that are managed by this class.
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
                        "description": "Field type.",
                        "type": "string",
                        "default": this.getFieldType(),
                        "readonly": true
                    },
                    "validate": {
                        "title": "Validation",
                        "description": "Field validation is required if true.",
                        "type": "boolean",
                        "default": true
                    },
                    "showMessages": {
                        "title": "Show Messages",
                        "description": "Display validation messages if true.",
                        "type": "boolean",
                        "default": true
                    },
                    "disabled": {
                        "title": "Disabled",
                        "description": "Field will be disabled if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "readonly": {
                        "title": "Readonly",
                        "description": "Field will be readonly if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "hidden": {
                        "title": "Hidden",
                        "description": "Field will be hidden if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "label": {
                        "title": "Label",
                        "description": "Field label.",
                        "type": "string"
                    },
                    "helper": {
                        "title": "Helper",
                        "description": "Field help message.",
                        "type": "string"
                    },
                    "fieldClass": {
                        "title": "Style Class",
                        "description": "Additional field style class.",
                        "type": "string"
                    },
                    "hideInitValidationError" : {
                        "title": "Hide Initial Validation Errors",
                        "description" : "Hide initial validation errors if true.",
                        "type": "boolean",
                        "default": false
                    }
                }
            };
            if (this.isTopLevel()) {
                schemaOfOptions.properties.renderForm = {
                    "title": "Render Form",
                    "description": "Render a FORM tag as the container for the rest of fields if true.",
                    "type": "boolean",
                    "default": false
                };

                schemaOfOptions.properties.form = {
                    "title": "Form",
                    "description": "Options for rendering the FORM tag.",
                    "type": "object",
                    "dependencies" : "renderForm",
                    "properties": {
                        "attributes": {
                            "title": "Form Attributes",
                            "description": "List of attributes for the FORM tag.",
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
         * Returns Alpaca options for the Alpaca options that are managed by this class.
         *
         * @private
         * @returns {Object} Alpaca options for the Alpaca options that are managed by this class.
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
                    },
                    "hideInitValidationError": {
                        "rightLabel":"Hide initial validation errors ?",
                        "type": "checkbox"
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
                        }
                    }
                }
            }

            return optionsForOptions;
        }//__END_OF_BUILDER_HELPERS
    });

    // Registers additional messages
    Alpaca.registerMessages({
        "disallowValue": "{0} are disallowed values.",
        "notOptional": "This field is not optional."
    });

})(jQuery);
