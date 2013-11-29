(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["alpaca/Alpaca", "jquery"], factory);
    } else {
        factory(window.Alpaca, window.$);
    }
}(this, function (Alpaca, $) {

    /**
     * @lends Alpaca.Fields.URLField.prototype
     *
     * @constructs
     * @augments Alpaca.Fields.TextField
     *
     * @class URL Control
     */
    Alpaca.Fields.URLField = Alpaca.Fields.TextField.extend({

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function() {

            this.schema.pattern = Alpaca.regexps.url;
            this.schema.format = "uri";

            this.base();
        },

        /**
         * @see Alpaca.Fields.TextField#postRender
         */
        postRender: function(callback) {

            var self = this;

            this.base(function() {

                if (self.fieldContainer) {
                    self.fieldContainer.addClass('alpaca-controlfield-url');
                }

                callback();

            });
        },

        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function() {
            var baseStatus = this.base();

            var valInfo = this.validation;

            if (!valInfo["invalidPattern"]["status"]) {

                valInfo["invalidPattern"]["message"] = this.view.getMessage("invalidURLFormat");
            }

            return baseStatus;
        },//__BUILDER_HELPERS

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "URL Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Provides a text control with validation for an internet web address.";
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "url";
        }//__END_OF_BUILDER_HELPERS
    });

    Alpaca.registerMessages({
        "invalidURLFormat": "The URL provided is not a valid web address."
    });
    Alpaca.registerFieldClass("url", Alpaca.Fields.URLField);
    Alpaca.registerDefaultFormatFieldMapping("url", "url");

    return Alpaca.Fields.URLField;

}));
