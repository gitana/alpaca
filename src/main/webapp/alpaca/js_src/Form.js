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
         * @class This class is for managing HTML form control and button control.
         *
         * @param {Object} container Field container.
         * @param {Object} options Field options.
         * @param {Object|String} view Field view.
         * @param {Alpaca.Connector} connector Field connector.
         */
        constructor: function(container, options, view, connector) {
            var _this = this;

            // container
            this.container = container;

            // parent
            this.parent = null;

            this.connector = connector;

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

            if (Alpaca.isEmpty(this.buttonOptions.submit)) {
                this.buttonOptions.submit = true;
            }

            if (Alpaca.isEmpty(this.buttonOptions.reset)) {
                this.buttonOptions.reset = true;
            }

            // set a view
            this.view = new Alpaca.View(view, this);

            // maintain a list for all buttons
            this.buttons = [];
        },

        /**
         * Renders this form into the container.
         *
         * @param {Function} onSuccess onSuccess callback.
         */
        render: function(onSuccess) {
            var _this = this;

            this.template = this.view.getTemplate("form");

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
         *
         * @param {Object} parentEl Field container.
         * @param {Function} onSuccess onSuccess callback.
         */
        processRender: function(parentEl, onSuccess) {
            var _this = this;

            // lookup the template we should use to render
            var template = this.getTemplate();

            this.connector.loadTemplate(template, function(loadedTemplate) {
                _this._renderLoadedTemplate(parentEl, loadedTemplate, onSuccess);
            }, function(error) {
                alert(error);
            });

            if (onSuccess)
                onSuccess();
        },

        /**
         * Renders the loaded template.
         *
         * @private
         *
         * @param {Object} parentEl Field container.
         * @param {String} templateString Template.
         * @param {Function} onSuccess onSuccess callback.
         */
        _renderLoadedTemplate: function(parentEl, templateString, onSuccess) {
            var context = {
                id: this.getId(),
                options: this.options,
                view: this.view.viewObject
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
            this.field = $('form', this.container);
            if (this.field) {
                this.field.attr(this.attributes);
            }

        },

        /**
         * Adds a button.
         *
         * @param {Object} parameters Button parameters.
         */
        addButton: function (parameters) {
            var _this = this;
            if (parameters) {
                var options = parameters.options ? parameters.options : {};
                options.form = this;
                var callback = parameters.postRender;
                options.type = options.type ? options.type : "button";
                this.formButtonsContainer.alpaca({
                    "data" : parameters.data,
                    "options" : options,
                    "postRender": function(fieldControl) {
                        _this.buttons.push(fieldControl);
                        if (callback && Alpaca.isFunction(callback)) {
                            callback(fieldControl);
                        }
                    }
                });
            }
        },

        /**
         * Adds buttons.
         */
        addButtons: function() {
            var _this = this;
            if ($('.alpaca-form-buttons-container', this.outerEl)) {
                this.formButtonsContainer = $('.alpaca-form-buttons-container', this.outerEl);
            } else {
                this.formButtonsContainer = this.outerEl;
            }

            if (this.buttonOptions.print) {
                this.addButton({
                    "options":{
                        "type": "printbutton"
                    },
                    "postRender": function (renderedButton) {
                        _this.printButton = renderedButton;
                    }
                });
            }

            if (this.buttonOptions.switchView) {
                this.addButton({
                    "options":{
                        "type": "switchviewbutton"
                    },
                    "postRender": function (renderedButton) {
                        _this.switchViewButton = renderedButton;
                    }
                });
            }

            if (this.buttonOptions.reload && this.viewType != 'view') {
                this.addButton({
                    "options":{
                        "type": "reloadbutton"
                    },
                    "postRender": function (renderedButton) {
                        _this.reloadButton = renderedButton;
                    }
                });
            }

            if (this.buttonOptions.save && this.viewType != 'view') {
                this.addButton({
                    "options":{
                        "type": "savebutton"
                    },
                    "postRender": function (renderedButton) {
                        _this.saveButton = renderedButton;
                    }
                });
            }

            if (this.buttonOptions.submit && this.viewType != 'view') {
                this.addButton({
                    "options":{
                        "type": "button",
                        "buttonType": "submit"
                    },
                    "data":"Submit",
                    "postRender": function (renderedButton) {
                        _this.submitButton = renderedButton;
                    }
                });
            }

            if (this.buttonOptions.reset && this.viewType != 'view') {
                this.addButton({
                    "options":{
                        "type": "button",
                        "buttonType": "reset"
                    },
                    "data":"Reset",
                    "postRender": function (renderedButton) {
                        _this.resetButton = renderedButton;
                    }
                });
            }

            this.formButtonsContainer.addClass("ui-widget-header ui-corner-all");
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
                    return _this.onSubmit(e);
                });
            }
        },

        /**
         * Handles form submit events.
         *
         * @param {Object} e Submit event.
         */
        onSubmit: function(e) {
            if (this.submitHandler) {
                return this.submitHandler(e);
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
         * @returns {Object} Form validation state.
         */
        renderValidationState: function() {
            this.topControl.renderValidationState();
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
         */
        destroy: function() {
            this.getEl().remove();
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
        getTemplate: function() {
            return this.template;
        },

        /**
         * Sets the form template.
         *
         * @param {String} template Template to be set
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
