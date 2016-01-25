(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Form = Base.extend(
    /**
     * @lends Alpaca.Form.prototype
     */
    {
        /**
         * @constructs
         *
         * @class This class is for managing HTML form control.
         *
         * @param {Object} domEl Field container.
         * @param {Object} options Field options.
         * @param {Object|String} view Field view.
         * @param {Alpaca.Connector} connector Field connector.
         * @param {Function} errorCallback Error callback.
         */
        constructor: function(domEl, options, viewId, connector, errorCallback) {

            // container
            this.domEl = domEl;

            // parent
            this.parent = null;

            this.connector = connector;
            this.errorCallback = errorCallback;

            // options
            this.options = options;

            if (this.options.attributes)
            {
                this.attributes = this.options.attributes;
            }
            else
            {
                this.attributes = {};
            }

            if (this.options.buttons)
            {
                if (this.options.buttons.submit)
                {
                    if (!this.options.buttons.submit.type)
                    {
                        this.options.buttons.submit.type = 'submit';
                    }

                    if (!this.options.buttons.submit.name)
                    {
                        this.options.buttons.submit.name = 'submit';
                    }

                    if (!this.options.buttons.submit.value)
                    {
                        this.options.buttons.submit.value = 'Submit';
                    }
                }

                if (this.options.buttons.reset)
                {
                    if (!this.options.buttons.reset.type)
                    {
                        this.options.buttons.reset.type = 'reset';
                    }
                    if (!this.options.buttons.reset.name)
                    {
                        this.options.buttons.reset.name = 'reset';
                    }
                    if (!this.options.buttons.reset.value)
                    {
                        this.options.buttons.reset.value = 'Reset';
                    }
                }

                // some general correction
                for (var k in this.options.buttons)
                {
                    if (this.options.buttons[k].label)
                    {
                        this.options.buttons[k].value = this.options.buttons[k].label;
                    }
                    if (this.options.buttons[k].title)
                    {
                        this.options.buttons[k].value = this.options.buttons[k].title;
                    }
                    if (!this.options.buttons[k].type)
                    {
                        this.options.buttons[k].type = "button";
                    }
                }
            }

            if (this.attributes.id)
            {
                this.id = this.attributes.id;
            }
            else
            {
                this.id = Alpaca.generateId();
                this.attributes.id = this.id;
            }

            // if we have a submit button specified, and toggleSubmitValidState isn't defined, set to true by default
            // don't allow the form to submit unless valid
            if (this.options.buttons && this.options.buttons.submit && Alpaca.isUndefined(this.options.toggleSubmitValidState))
            {
                this.options.toggleSubmitValidState = true;
            }

            this.viewType = options.viewType;

            // set a runtime view
            this.view = new Alpaca.RuntimeView(viewId, this);

            // for each button, make sure that classes is set minimally to view.styles.button
            for (var k in this.options.buttons)
            {
                if (!this.options.buttons[k].styles) {
                    this.options.buttons[k].styles = this.view.styles.button;
                }
            }

        },

        /**
         * Renders this form into the container.
         *
         * @param {Function} callback
         */
        render: function(callback)
        {
            var self = this;

            // load the appropriate template and render it
            this.processRender(this.domEl, function() {

                // bind our field dom element into the domEl
                self.form.appendTo(self.domEl);

                // add default class
                self.form.addClass("alpaca-form");

                // CALLBACK: "form"
                self.fireCallback("form");

                // execute callback
                callback(self);
            });
        },

        afterInitialize: function()
        {
            var self = this;

            if (self.options.toggleSubmitValidState) {

                // adjust submit button state
                self.adjustSubmitButtonState();

            }

        },

        /**
         * Determines whether the top control is entirely valid.
         *
         * @return {*}
         */
        isFormValid: function()
        {
            // re-compute validation for the full control set
            this.topControl.validate(true);

            var valid = this.topControl.isValid(true);
            //this.refreshValidationState(true);

            return valid;
        },

        isValid: function()
        {
            return this.isFormValid();
        },

        validate: function(children)
        {
            return this.topControl.validate(children);
        },

        enableSubmitButton: function()
        {
            $(".alpaca-form-button-submit").attrProp("disabled", false);

            if ($.mobile)
            {
                try { $(".alpaca-form-button-submit").button('refresh'); } catch (e) { }
            }
        },

        disableSubmitButton: function()
        {
            $(".alpaca-form-button-submit").attrProp("disabled", true);

            if ($.mobile)
            {
                try { $(".alpaca-form-button-submit").button('refresh'); } catch (e) { }
            }
        },

        adjustSubmitButtonState: function()
        {
            this.disableSubmitButton();

            if (this.isFormValid())
            {
                this.enableSubmitButton();
            }
        },

        /**
         * Responsible for fetching any templates needed so as to render the
         * current mode for this field.
         *
         * Once completed, the onSuccess method is called.
         *
         * @param {Object} parentEl Field container.
         * @param {Function} callback
         */
        processRender: function(parentEl, callback)
        {
            var self = this;

            // lookup the template we should use to render
            this.formDescriptor = this.view.getTemplateDescriptor("form");
            if (!this.formDescriptor)
            {
                return Alpaca.throwErrorWithCallback("Could not find template descriptor: form");
            }

            var renderedDomElement = Alpaca.tmpl(this.formDescriptor, {
                id: this.getId(),
                options: this.options,
                view: this.view
            });
            renderedDomElement.appendTo(parentEl);

            this.form = renderedDomElement;

            // find our insertion point
            // this is marked by the handlebars helper
            this.formFieldsContainer = $(this.form).find("." + Alpaca.MARKER_CLASS_FORM_ITEMS_FIELD);
            this.formFieldsContainer.removeClass(Alpaca.MARKER_CLASS_FORM_ITEMS_FIELD);

            if (Alpaca.isEmpty(this.form.attr("id")))
            {
                this.form.attr("id", this.getId() + "-form-outer");
            }
            if (Alpaca.isEmpty(this.form.attr("data-alpaca-form-id")))
            {
                this.form.attr("data-alpaca-form-id", this.getId());
            }

            // the form field
            $(parentEl).find("form").attr(this.attributes);

            // populate the buttons as well
            this.buttons = {};
            $(parentEl).find(".alpaca-form-button").each(function() {

                $(this).click(function(e) {
                    $(this).attr("button-pushed", true);
                });

                // custom click handler?
                var key = $(this).attr("data-key");
                if (key)
                {
                    var buttonConfig = self.options.buttons[key];
                    if (buttonConfig)
                    {
                        if (buttonConfig.click)
                        {
                            $(this).click(function(form, handler) {
                                return function(e) {
                                    e.preventDefault();
                                    handler.call(form, e);
                                }
                            }(self, buttonConfig.click));
                        }
                    }
                }
            });

            callback();
        },

        /**
         * Returns the id of the form.
         *
         * @returns {String} Form id
         */
        getId: function()
        {
            return this.id;
        },

        /**
         * Returns form type.
         *
         * @returns {String} Form type.
         */
        getType: function()
        {
            return this.type;
        },

        /**
         * Returns this form's parent.
         *
         * @returns {Object} Form parent.
         */
        getParent: function()
        {
            return this.parent;
        },

        /**
         * Returns the value of the JSON rendered by this form.
         *
         * @returns {Any} Value of the JSON rendered by this form.
         */
        getValue: function()
        {
            return this.topControl.getValue();
        },

        /**
         * Sets the value of the JSON to be rendered by this form.
         *
         * @param {Any} value Value to be set.
         */
        setValue: function(value)
        {
            this.topControl.setValue(value);
        },

        /**
         * Initializes events handling (Form Submission) for this form.
         */
        initEvents: function()
        {
            var _this = this;

            var formTag = $(this.domEl).find("form");

            var v = this.getValue();
            $(formTag).submit(v, function(e) {
                return _this.onSubmit(e, _this);
            });

            // listen for fieldupdates and determine whether the form is valid.
            // if so, enable the submit button...
            // otherwise, disable it
            if (this.options.toggleSubmitValidState)
            {
                $(_this.topControl.getFieldEl()).bind("fieldupdate", function() {
                    _this.adjustSubmitButtonState();
                });

                $(_this.topControl.getFieldEl()).bind("fieldkeyup", function() {
                    _this.adjustSubmitButtonState();
                });

                $(_this.topControl.getFieldEl()).bind("fieldblur", function() {
                    _this.adjustSubmitButtonState();
                });

            }
        },

        getButtonEl: function(buttonId)
        {
            return $(this.domEl).find(".alpaca-form-button-" + buttonId);
        },

        /**
         * Handles form submit events.
         *
         * @param {Object} e Submit event.
         * @param {Object} form the form
         */
        onSubmit: function(e, form)
        {
            if (!this.isFormValid())
            {
                e.stopPropagation();

                this.refreshValidationState(true);

                return false;
            }

            if (this.submitHandler)
            {
                e.stopPropagation();

                var v = this.submitHandler(e, form);
                if (Alpaca.isUndefined(v)) {
                    v = false;
                }

                return v;
            }
        },

        /**
         * Registers a custom submit handler.
         *
         * @param {Object} func Submit handler to be registered.
         */
        registerSubmitHandler: function (func)
        {
            if (Alpaca.isFunction(func))
            {
                this.submitHandler = func;
            }
        },

        /**
         * Displays validation information of all fields of this form.
         *
         * @param {Boolean} children whether to render validation state for child fields
         *
         * @returns {Object} Form validation state.
         */
        refreshValidationState: function(children, callback)
        {
            this.topControl.refreshValidationState(children, callback);
        },

        /**
         * Disables this form.
         */
        disable: function()
        {
            this.topControl.disable();
        },

        /**
         * Enables this form.
         */
        enable: function()
        {
            this.topControl.enable();
        },

        /**
         * Focuses on this form.
         *
         * If a callback is provided, the callback receives the focused control.
         */
        focus: function(onFocusCallback)
        {
            this.topControl.focus(function(controlWithFocus) {
                if (onFocusCallback)
                {
                    onFocusCallback(controlWithFocus);
                }
            });
        },

        /**
         * Purge any event listeners and remove the form from the DOM.
         *
         * @param [Boolean] skipParent when true, the form cleans up without traversing through parent child controls
         */
        destroy: function(skipParent)
        {
            this.getFormEl().remove();

            // we allow form.destroy() which tells parent control to destroy
            // if skipParent == true, then we do not call up (invoked from container)
            if (!skipParent && this.parent)
            {
                this.parent.destroy();
            }
        },

        /**
         * Shows the form.
         */
        show: function()
        {
            this.getFormEl().css({
                "display": ""
            });
        },

        /**
         * Hides the form.
         */
        hide: function()
        {
            this.getFormEl().css({
                "display": "none"
            });
        },

        /**
         * Clears the form and resets values of its fields.
         *
         * @param stopUpdateTrigger If false, triggers the update event of this event.
         */
        clear: function(stopUpdateTrigger)
        {
            this.topControl.clear(stopUpdateTrigger);
        },

        /**
         * Checks if form is empty.
         *
         * @returns {Boolean} True if the form is empty, false otherwise.
         */
        isEmpty: function()
        {
            return this.topControl.isEmpty();
        },

        /**
         * Fires a view callback for the current form.
         *
         * @param id
         * @param arg1
         * @param arg2
         * @param arg3
         * @param arg4
         * @param arg5
         */
        fireCallback: function(id, arg1, arg2, arg3, arg4, arg5)
        {
            this.view.fireCallback(this, id, arg1, arg2, arg3, arg4, arg5);
        },

        /**
         * Retrieves the form element.
         *
         * @returns {Object} The rendered DOM element.
         */
        getFormEl: function() {
            return this.form;
        },

        /**
         * Performs a regular old submit.
         */
        submit: function()
        {
            this.form.submit();
        },

        /**
         * Fires the submit in the background and hands back the jQuery promise.
         *
         * An optional config can be passed in to control the underlying jQuery ajax XHR.
         *
         * @returns {*}
         */
        ajaxSubmit: function(config)
        {
            var self = this;

            if (!config) {
                config = {};
            }

            config.url = self.options.attributes.action;
            config.type = self.options.attributes.method;

            if (!config.data) {
                config.data = this.getValue();
            }

            if (!config.dataType) {
                config.dataType = "json";
            }
            if (!config.headers) {
                config.headers = {};
            }

            // support CSRF here
            var csrfToken = self.determineCsrfToken();
            if (csrfToken) {
                config.headers[Alpaca.CSRF_HEADER_NAME] = csrfToken;
            }

            return $.ajax(config);
        },

        determineCsrfToken: function()
        {
            // is there a direct token specified?
            var csrfToken = Alpaca.CSRF_TOKEN;
            if (!csrfToken)
            {
                // is there a cookie that we can pull the value from?
                for (var t = 0; t < Alpaca.CSRF_COOKIE_NAMES.length; t++)
                {
                    var cookieName = Alpaca.CSRF_COOKIE_NAMES[t];

                    var cookieValue = Alpaca.readCookie(cookieName);
                    if (cookieValue)
                    {
                        csrfToken = cookieValue;
                        break;
                    }
                }
            }

            return csrfToken;
        }

    });

})(jQuery);
