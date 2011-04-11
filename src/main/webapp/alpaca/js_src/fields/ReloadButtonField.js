(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.ReloadButtonField = Alpaca.Fields.ButtonField.extend(
    /**
     * @lends Alpaca.Fields.ReloadButtonField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.ButtonField
         *
         * @class Button control for reloading form.
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
            // sets defaults
            if (!this.data) {
                this.data = this.view.getMessage("reload");
            }
        },

        /**
         * @see Alpaca.Fields.ButtonField#onClick
         */
        onClick: function(e) {
            this.form.topControl.reload();
        },

        /**
         * @see Alpaca.ControlField#postRender
         */
        postRender: function () {
            this.base();
            this.field.addClass("alpaca-form-button-reload");
            if (this.field.button) {
                this.field.button({
                    text: true,
                    icons: {
                        primary: "ui-icon-refresh"
                    }
                });
            }
        },

        /**
         * @see Alpaca.Fields.ButtonField#getTitle
         */
        getTitle: function() {
            return "Alpaca Reload Button";
        },

        /**
         * @see Alpaca.Fields.ButtonField#getDescription
         */
        getDescription: function() {
            return "Alpaca button for reloading data.";
        }
    });

    // Registers additional messages
    Alpaca.registerMessages({
        "reload": "Reload"
    });

    Alpaca.registerFieldClass("reloadbutton", Alpaca.Fields.ReloadButtonField);

})(jQuery);
