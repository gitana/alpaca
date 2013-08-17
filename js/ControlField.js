(function($) {

    var Alpaca = $.alpaca;

    Alpaca.ControlField = Alpaca.Field.extend(
    /**
     * @lends Alpaca.ControlField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Field
         *
         * @class Abstract base class for Alpaca non-container Fields.
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
            this.base(container, data, options, schema, view, connector, errorCallback);

            // tag to flag that this is a control field
            // used by Field base class to determine whether to traverse into this during a display-only rendering
            this.isControlField = true;
        },

        /**
         * @see Alpaca.Field#setDefault
         */
        setDefault: function() {
            var defaultData = Alpaca.isEmpty(this.schema['default']) ? "" : this.schema['default'];
            this.setValue(defaultData);
        },

        /**
         * @see Alpaca.Field#renderField
         */
        renderField: function(onSuccess) {
        },

        /**
         * Injects Field Element into its container.
         *
         * @param {Object} element Field element to be injected.
         */
        injectField: function(element) {
            // find out the field container
            var containerElem = $('.alpaca-controlfield-container', this.outerEl);
            if (containerElem.length) {
                this.fieldContainer = containerElem;
            } else {
                this.fieldContainer = this.outerEl;
            }
            // now figure out where exactly we want to insert it
            var parentNode = $('.alpaca-field-container-field', this.fieldContainer);
            if (parentNode.length > 0) {
                if (parentNode.attr('data-replace') == 'true') {
                    parentNode.replaceWith(element);
                } else {
                    element.appendTo(parentNode);
                }
            } else {
                if (this.fieldContainer.attr('data-replace') == 'true') {
                    this.fieldContainer.replaceWith(element);
                } else {
                    element.prependTo(this.fieldContainer);
                }
            }
        },

        /**
         * @see Alpaca.Field#postRender
         */
        postRender: function() {
            var labelDiv = $('.alpaca-controlfield-label', this.outerEl);
            if (labelDiv.length) {
                this.labelDiv = labelDiv;
            }
            var helperDiv = $('.alpaca-controlfield-helper', this.outerEl);
            if (helperDiv.length) {
                this.helperDiv = helperDiv;
            }
            this.base();
            // add additional classes
            this.outerEl.addClass('alpaca-controlfield');
        },

        /**
         * Validate against enum property.
         *
         * @returns {Boolean} True if the element value is part of the enum list, false otherwise.
         */
        _validateEnum: function() {
            if (this.schema["enum"]) {
                var val = this.data;
                /*this.getValue();*/
                if (!this.schema.required && Alpaca.isValEmpty(val)) {
                    return true;
                }
                if ($.inArray(val, this.schema["enum"]) > -1) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        },

        /**
         * @see Alpaca.Field#handleValidate
         */
        handleValidate: function() {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateEnum();
            valInfo["invalidValueOfEnum"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.view.getMessage("invalidValueOfEnum"), [this.schema["enum"].join(',')]),
                "status": status
            };

            return baseStatus && valInfo["invalidValueOfEnum"]["status"];
        },

        /**
         * @see Alpaca.Field#initEvents
         */
        initEvents: function() {
            this.base();

            var _this = this;

            if (this.field)
            {
                this.field.keypress(function(e) {
                    _this.onKeyPress.call(_this, e);
                    _this.trigger("keypress", e);
                });

                this.field.keyup(function(e) {
                    _this.onKeyUp.call(_this, e);
                    _this.trigger("keyup", e);
                });

                this.field.keydown(function(e) {
                    _this.onKeyDown.call(_this, e);
                    _this.trigger("keydown", e);
                });

                this.field.click(function(e) {
                    _this.onClick.call(_this, e);
                    _this.trigger("click", e);
                });
            }

        },

        /**
         * Callback for when a key press event is received for the field control.
         *
         * @param {Object} e keypress event
         */
        onKeyPress: function(e) {

            var self = this;

            // if the field is currently invalid, then we provide early feedback to the user as to when they enter
            // if the field was valid, we don't render invalidation feedback until they blur the field

            // was the control valid previously?
            var wasValid = this.isValid();
            if (!wasValid)
            {
                //
                // we use a timeout because at this exact moment, the value of the control is still the old value
                // jQuery raises the keypress event ahead of the input receiving the new data which would incorporate
                // the key that was pressed
                //
                // this timeout provides the browser with enough time to plug the value into the input control
                // which the validation logic uses to determine whether the control is now in a valid state
                //
                window.setTimeout(function() {
                    self.renderValidationState();
                }, 50);
            }

        },

        /**
         * Callback for when a key down event is received for the field control.
         *
         * @param {Object} e keydown event
         */
        onKeyDown: function(e) {

        },

        /**
         * Callback for when a key up event is received for the field control.
         *
         * @param {Object} e keyup event
         */
        onKeyUp: function(e) {

        },

        /**
         * Handler for click event.
         *
         * @param {Object} e Click event.
         */
        onClick: function(e) {
        },//__BUILDER_HELPERS

        /**
         * @private
         * @see Alpaca.Field#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "enum": {
                        "title": "Enumerated Values",
                        "description": "List of specific values for this property",
                        "type": "array"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Field#getOptionsForSchema
         */
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "enum": {
                        "itemLabel":"Value",
                        "type": "array"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Field#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "name": {
                        "title": "Field Name",
                        "description": "Field Name.",
                        "type": "string"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Field#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "name": {
                        "type": "text"
                    }
                }
            });
        }//__END_OF_BUILDER_HELPERS
    });

    // Registers additional messages
    Alpaca.registerMessages({
        "invalidValueOfEnum": "This field should have one of the values in {0}."
    });

})(jQuery);
