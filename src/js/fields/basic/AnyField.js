(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.AnyField = Alpaca.ControlField.extend(
    /**
     * @lends Alpaca.Fields.AnyField.prototype
     */
    {
        /**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function() {
            return "any";
        },

        /**
         * @see Alpaca.Field#setup
         */
        setup: function()
        {
            this.base();
        },

        /**
         * @see Alpaca.Field#getValue
         */
        getValue: function()
        {
            return this._getControlVal();
        },

        /**
         * @see Alpaca.Field#setValue
         */
        setValue: function(value)
        {
            if (Alpaca.isEmpty(value))
            {
                this.control.val("");
            }
            else
            {
                this.control.val(value);
            }

            // be sure to call into base method
            this.base(value);
        },

        /**
         * @see Alpaca.Field#disable
         */
        disable: function()
        {
            this.control.disabled = true;
        },

        /**
         * @see Alpaca.Field#enable
         */
        enable: function()
        {
            this.control.disabled = false;
        },

        /**
         * @see Alpaca.Field#focus
         */
        focus: function()
        {
            this.control.focus();
        },//__BUILDER_HELPERS

        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ControlField#getOptionsForSchema
         */
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ControlField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                }
            });
        },

        /**
         * @see Alpaca.Field#getTitle
         */
        getTitle: function() {
            return "Any Field";
        },

        /**
         * @see Alpaca.Field#getDescription
         */
        getDescription: function() {
            return "Any field.";
        },

        /**
         * @see Alpaca.Field#getType
         */
        getType: function() {
            return "any";
        }

        //__END_OF_BUILDER_HELPERS
    });

    Alpaca.registerFieldClass("any", Alpaca.Fields.AnyField);
    Alpaca.registerDefaultSchemaFieldMapping("any", "any");

})(jQuery);
