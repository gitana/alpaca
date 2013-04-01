(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.PersonalNameField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.PersonalNameField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.TextField
         *
         * @class Control for upper case text.
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
        },

        /**
         * @see Alpaca.Fields.TextField#postRender
         */
        postRender: function() {
            this.base();
            if (this.fieldContainer) {
                this.fieldContainer.addClass('alpaca-controlfield-personalname');
            }
        },

        /**
         * @see Alpaca.Fields.TextField#setValue
         */
        setValue: function(val) {
            var upperValue = "";

            for ( var i = 0; i < val.length; i++ ) {
                if ( i === 0 ) {
                    upperValue += val.charAt(i).toUpperCase();
                } else if (val.charAt(i-1) == ' ' ||  val.charAt(i-1) == '-' || val.charAt(i-1) == "'") {
                    upperValue += val.charAt(i).toUpperCase();
                } else {
                    upperValue += val.charAt(i);
                }
            }

            if (upperValue != this.getValue()) {
                this.base(upperValue);
            }
        },

        /**
         * @see Alpaca.ControlField#onKeyPress
         */
        onKeyPress: function(e) {
            this.base(e);

            var _this = this;

            Alpaca.later(25, this, function() {
                var v = _this.getValue();
                _this.setValue(v);
            });
        },//__BUILDER_HELPERS

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Personal Name";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Text Field for personal name with captical letter for first letter & after hyphen, space or apostrophe.";
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "personalname";
        }//__END_OF_BUILDER_HELPERS
    });

    Alpaca.registerFieldClass("personalname", Alpaca.Fields.PersonalNameField);

})(jQuery);
