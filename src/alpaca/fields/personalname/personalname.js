(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["alpaca/Alpaca", "jquery"], factory);
    } else {
        factory(window.Alpaca, window.$);
    }
}(this, function (Alpaca, $) {

    /**
     * @lends Alpaca.Fields.PersonalNameField.prototype
     *
     * @constructs
     * @augments Alpaca.Fields.TextField
     *
     * @class Control for upper case text.
     */
    Alpaca.Fields.PersonalNameField = Alpaca.Fields.TextField.extend({

        /**
         * @see Alpaca.Fields.TextField#postRender
         */
        postRender: function(callback) {

            var self = this;

            this.base(function() {

                if (self.fieldContainer) {
                    self.fieldContainer.addClass('alpaca-controlfield-personalname');
                }

                callback();

            });
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

    return Alpaca.Fields.PersonalNameField;
}));
