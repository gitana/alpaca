(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.DatetimeField = Alpaca.Fields.TextField.extend(
        /**
         * @lends Alpaca.Fields.DatetimeField.prototype
         */
        {
            /**
             * @constructs
             * @augments Alpaca.Fields.ObjectField
             *
             * @class A combo field for rendering a standard US range. It also comes up with support for Google Map
             * which would requires including Google Map JS file for the form that uses this class.
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
             * @see Alpaca.Fields.TextField#setup
             */
            /**
             * @private
             * @see Alpaca.Fields.ObjectField#setup
             */
            setup: function() {
                this.base();
            },

            /**
             * @see Alpaca.Fields.TextField#postRender
             */
            postRender: function() {
                var _this = this;
                this.base();
                if (this.field.datetimepicker) {
                    this.field.hover(function() {
                        if (!$(this).hasClass('hasDatepicker')) {
                            $(this).datetimepicker(_this.options.datetime ? _this.options.datetime : {});
                        }
                    });
                    if (this.fieldContainer) {
                        this.fieldContainer.addClass('alpaca-controlfield-datetime');
                    }
                }
            },

            /**
             *@see Alpaca.Fields.TextField#setValue
             */
            setValue: function(value) {
                if (value) {
                    if (Alpaca.isNumber()) {
                        value = new Date(value);
                    }
                    if (Object.prototype.toString.call(value) == "[object Date]") {
                        this.base((value.getMonth() + 1) + "/" + value.getDate() + "/" + value.getFullYear() + " " + value.getHours() + ":" + value.getMinutes());
                    } else {
                        this.base(value);
                    }
                } else {
                    this.base(value);
                }
            },

            /**
             * @see Alpaca.Fields.TextField#getValue
             */
            getValue: function() {
                /*
                if (this.base()) {
                    return this.field.datetimepicker('getDate');
                } else {
                    return this.base();
                }
                */
                this.base();
            },//__BUILDER_HELPERS

            /**
             * @see Alpaca.Fields.TextField#getTitle
             */
            getTitle: function() {
                return "Datetime Field";
            },

            /**
             * @see Alpaca.Fields.TextField#getDescription
             */
            getDescription: function() {
                return "Datetime Field.";
            },

            /**
             * @see Alpaca.Fields.TextField#getFieldType
             */
            getFieldType: function() {
                return "datetime";
            }//__END_OF_BUILDER_HELPERS
        });

    Alpaca.registerFieldClass("datetime", Alpaca.Fields.DatetimeField);
    Alpaca.registerDefaultFormatFieldMapping("datetime", "datetime");
})(jQuery);
