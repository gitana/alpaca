(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.PersonalNameField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.PersonalNameField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "personalname";
        },

        /**
         * @see Alpaca.Fields.TextField#setValue
         */
        setValue: function(val)
        {
            if (!val)
            {
                return this.base(val);
            }

            // convert to upper-case
            var upperValue = "";

            for (var i = 0; i < val.length; i++)
            {
                if (i === 0)
                {
                    upperValue += val.charAt(i).toUpperCase();
                }
                else if (val.charAt(i - 1) === ' ' || val.charAt(i - 1) === '-' || val.charAt(i - 1) === "'")
                {
                    upperValue += val.charAt(i).toUpperCase();
                }
                else
                {
                    upperValue += val.charAt(i);
                }
            }

            if (upperValue != this.getValue()) // jshint ignore:line
            {
                this.base(upperValue);
            }
        },

        /**
         * @see Alpaca.ControlField#onKeyPress
         */
        onKeyPress: function(e)
        {
            this.base(e);

            var _this = this;

            Alpaca.later(25, this, function() {
                var v = _this.getValue();
                _this.setValue(v);
            });

        }

        /* builder_helpers */
        ,

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
            return "Text Field for personal name with capital letter for first letter & after hyphen, space or apostrophe.";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("personalname", Alpaca.Fields.PersonalNameField);

})(jQuery);
