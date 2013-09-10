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
         * @param {Object} container Field container.
         * @param {Object} options Field options.
         * @param {Object|String} view Field view.
         * @param {Alpaca.Connector} connector Field connector.
         * @param {Function} errorCallback Error callback.
         */
        constructor: function(container, options, viewId, connector, errorCallback) {
            var _this = this;

            // container
            this.container = container;

            // parent
            this.parent = null;

            this.connector = connector;
            this.errorCallback = errorCallback;

            // options
            this.options = options;

            if (this.options.attributes) {
                this.attributes = this.options.attributes;
            } else {
                this.attributes = {};
            }

            if (this.options.buttons) {
                if (this.options.buttons.submit) {
                    if (!this.options.buttons.submit.type) {
                        this.options.buttons.submit.type = 'submit';
                    }
                    if (!this.options.buttons.submit.name) {
                        this.options.buttons.submit.name = 'submit';
                    }
                    if (!this.options.buttons.submit.value) {
                        this.options.buttons.submit.value = 'Submit';
                    }
                }
                if (this.options.buttons.reset) {
                    if (!this.options.buttons.reset.type) {
                        this.options.buttons.reset.type = 'reset';
                    }
                    if (!this.options.buttons.reset.name) {
                        this.options.buttons.reset.name = 'reset';
                    }
                    if (!this.options.buttons.reset.value) {
                        this.options.buttons.reset.value = 'Reset';
                    }
                }
            }

            if (this.attributes.id) {
                this.id = this.attributes.id;
            } else {
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
        },

        /**
         * Renders this form into the container.
         *
         * @param {Function} onSuccess onSuccess callback.
         */
        render: function(onSuccess) {
            var _this = this;

            this.templateDescriptor = this.view.getTemplateDescriptor("form");

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

                // execute callback
                if (onSuccess)
                    onSuccess(_this);
            });
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
            this.renderValidationState();

            return valid;
        },

        validate: function(children)
        {
            return this.topControl.validate(children);
        },

        enableSubmitButton: function()
        {
            $(".alpaca-form-button-submit").attrProp("disabled", false);

            if ($.mobile) {
                try { $(".alpaca-form-button-submit").button('refresh'); } catch (e) { }
            }
        },

        disableSubmitButton: function()
        {
            $(".alpaca-form-button-submit").attrProp("disabled", true);

            if ($.mobile) {
                try { $(".alpaca-form-button-submit").button('refresh'); } catch (e) { }
            }
        },

        adjustSubmitButtonState: function()
        {
            this.disableSubmitButton();

            var x = this.isFormValid();
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
         * @param {Function} onSuccess onSuccess callback.
         */
        processRender: function(parentEl, onSuccess) {
            var _this = this;

            // lookup the template we should use to render
            var templateDescriptor = this.getTemplateDescriptor();

            var context = {
                id: this.getId(),
                options: this.options,
                view: this.view
            };
            var renderedDomElement = _this.view.tmpl(templateDescriptor, context, {});
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

            // the form field
            this.field = $('form', this.container);
            if (this.field)
            {
                // add all provided attributes
                this.field.attr(this.attributes);
            }

            // populate the buttons as well
            this.buttons = {};
            $.each($('.alpaca-form-button', this.container),function(k,v) {

                // TODO: this is technically wrong since we only want to trap for left-mousedown...
                $(v).mousedown(function() {
                    var _this = $(this);
                    _this.attr("button-pushed","true");
                    setTimeout(function() {
                        if (_this.attr("button-pushed") && _this.attr("button-pushed") == "true" ) {
                            _this.click();
                        }
                    }, 150);
                });
                $(v).click(function() {
                    $(this).removeAttr("button-pushed");
                });
                _this.buttons[$(v).attr('data-key')] = $(v);
            });

            onSuccess();
        },

        /**
         * Retrieve the form container.
         *
         * @returns {Object} Form container.
         */
        getEl: function() {
            return this.outerEl;
        },

        /**
         * Returns the id of the form.
         *
         * @returns {String} Form id
         */
        getId: function() {
            return this.id;
        },

        /**
         * Returns form type.
         *
         * @returns {String} Form type.
         */
        getType: function() {
            return this.type;
        },

        /**
         * Returns this form's parent.
         *
         * @returns {Object} Form parent.
         */
        getParent: function() {
            return this.parent;
        },

        /**
         * Returns the value of the JSON rendered by this form.
         *
         * @returns {Any} Value of the JSON rendered by this form.
         */
        getValue: function() {
            return this.topControl.getValue();
        },

        /**
         * Sets the value of the JSON to be rendered by this form.
         *
         * @param {Any} value Value to be set.
         */
        setValue: function(value) {
            this.topControl.setValue(value);
        },

        /**
         * Initializes events handling (Form Submission) for this form.
         */
        initEvents: function() {
            var _this = this;
            if (this.field) {
                var v = this.getValue();
                $(this.field).submit(v, function(e) {

                    return _this.onSubmit(e, _this);
                });
            }

            // listen for fieldupdates and determine whether the form is valid.
            // if so, enable the submit button...
            // otherwise, disable it
            if (this.options.toggleSubmitValidState)
            {
                $(_this.topControl.getEl()).bind("fieldupdate", function() {
                    _this.adjustSubmitButtonState();
                });

                this.adjustSubmitButtonState();
            }
        },

        /**
         * Handles form submit events.
         *
         * @param {Object} e Submit event.
         * @param {Object} form the form
         */
        onSubmit: function(e, form) {
            if (this.submitHandler) {
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
        registerSubmitHandler: function (func) {
            if (Alpaca.isFunction(func)) {
                this.submitHandler = func;
            }
        },

        /**
         * Displays validation information of all fields of this form.
         *
         * @param {Boolean} checkChildren whether to render validation state for child fields
         *
         * @returns {Object} Form validation state.
         */
        renderValidationState: function(checkChildren) {
            this.topControl.renderValidationState(checkChildren);
        },

        /**
         * Disables this form.
         */
        disable: function() {
            this.topControl.disable();
        },

        /**
         * Enables this form.
         */
        enable: function() {
            this.topControl.enable();
        },

        /**
         * Focuses on this form.
         */
        focus: function() {
            this.topControl.focus();
        },

        /**
         * Purge any event listeners and remove the form from the DOM.
         *
         * @param [Boolean] skipParent when true, the form cleans up without traversing through parent child controls
         */
        destroy: function(skipParent) {

            this.getEl().remove();

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
        show: function() {
            this.getEl().css({
                "display": ""
            });
        },

        /**
         * Hides the form.
         */
        hide: function() {
            this.getEl().css({
                "display": "none"
            });
        },

        /**
         * Clears the form and resets values of its fields.
         *
         * @param stopUpdateTrigger If false, triggers the update event of this event.
         */
        clear: function(stopUpdateTrigger) {
            this.topControl.clear(stopUpdateTrigger);
        },

        /**
         * Checks if form is empty.
         *
         * @returns {Boolean} True if the form is empty, false otherwise.
         */
        isEmpty: function() {
            return this.topControl.isEmpty();
        },

        /**
         * Returns the form template.
         *
         * @returns {Object|String} template Form template.
         */
        getTemplateDescriptor: function() {
            return this.templateDescriptor;
        },

        /**
         * Sets the form template.
         *
         * @param {String} templateDescriptor Template to be set
         */
        setTemplateDescriptor: function(templateDescriptor) {
            this.templateDescriptor = templateDescriptor;
        }

    });

})(jQuery);
