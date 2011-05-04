(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.SaveButtonField = Alpaca.Fields.ButtonField.extend(
    /**
     * @lends Alpaca.Fields.SaveButtonField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.ButtonField
         *
         * @class Button control for saving form data through connector.
         *
         * @param {Object} container Field container.
         * @param {Any} data Field data.
         * @param {Object} options Field options.
         * @param {Object} schema Field schema.
         * @param {Object|String} view Field view.
         * @param {Alpaca.Connector} connector Field connector.
         */
        constructor: function(container, data, options, schema, view, connector) {
            this.base(container, data, options, schema, view, connector);
        },

        /**
         * @see Alpaca.Fields.ButtonField#setup
         */
        setup: function() {
            this.base();
            this.buttonType = "button";

            if (!this.data) {
                this.data = this.view.getMessage("save");
            }
        },

        /**
         * @see Alpaca.Fields.ButtonField#onClick
         */
        onClick: function(e) {
            var _this = this;
            var control = this.form.topControl;
            var newValue = control.getValue();
            if (Alpaca.isEmpty(control.data)) {
                control.data = {};
            }
            Alpaca.mergeWithNullChecking(control.data, newValue);
            // if we have a template to load, load it and then render
            control.connector.saveData({
                "data":control.data,
                "schema":control.schema
            }, function(updatedData) {
                //TODO: add something nice here
                Alpaca.merge(control.data, updatedData);
                if (_this.success && Alpaca.isFunction(_this.success)) {
                    _this.success(control.data);
                } else {
                    alert("Data Saved!");
                }
            }, function(error) {
                if (_this.error && Alpaca.isFunction(_this.error)) {
                    _this.error(error);
                } else {
                    alert(error);
                }
            });
        },

        /**
         * @see Alpaca.ControlField#postRender
         */
        postRender: function () {
            this.base();
            this.field.addClass("alpaca-form-button-save");
            this.field.button({
                text: true,
                icons: {
                    primary: "ui-icon-disk"
                }
            });
        },

        /**
         * @see Alpaca.Fields.ButtonField#getTitle
         */
        getTitle: function() {
            return "Save Button";
        },

        /**
         * @see Alpaca.Fields.ButtonField#getDescription
         */
        getDescription: function() {
            return "Button for storing data.";
        }
    });

    // Registers additonal messages
    Alpaca.registerMessages({
        "save": "Save"
    });

    Alpaca.registerFieldClass("savebutton", Alpaca.Fields.SaveButtonField);

})(jQuery);
