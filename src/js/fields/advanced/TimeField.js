(function($) {

    var Alpaca = $.alpaca;

    // time-related regular expressions
    Alpaca.REGEX_TIME = /^((0?[1-9]|1[012])(:[0-5]\d){0,2}(\ [AP]M))$|^([01]\d|2[0-3])(:[0-5]\d){0,2}$/;

    Alpaca.Fields.TimeField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.TimeField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "time";
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            var self = this;

            this.base();

            if (!self.options.picker)
            {
                self.options.picker = {};
            }
        },

        /**
         * @see Alpaca.Fields.TextField#afterRenderControl
         */
        afterRenderControl: function(model, callback) {

            var self = this;

            this.base(model, function() {

                if ($.fn.timepicker)
                {
                    self.getControlEl().timepicker(self.options.picker);
                }

                callback();

            });
        },

        /**
         * @see Alpaca.Field#onChange
         */
        onChange: function(e)
        {
            this.base();

            this.refreshValidationState();
        },

        isAutoFocusable: function()
        {
            return false;
        },

        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateTime();
            valInfo["invalidTime"] = {
                "message": status ? "" : this.view.getMessage("invalidTime"),
                "status": status
            };

            return baseStatus && valInfo["invalidTime"]["status"];
        },

        /**
         * Validates that the given value is a valid time.
         *
         * @returns {Boolean} True if it is a valid time, false otherwise.
         */
        _validateTime: function()
        {
            var value = this.getControlEl().val();
            if (value || this.schema.required)
            {
                return Alpaca.REGEX_TIME.test(value);
            }

            return true;
        },

        /**
         * @see Alpaca.Fields.TextField#setValue
         */
        setValue: function(val)
        {
            var self = this;

            this.base(val);

            if ($.fn.timepicker)
            {
                self.getControlEl().timepicker("setTime", val);
            }
        }

        //__BUILDER_HELPERS
        ,

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "format": {
                        "title": "Format",
                        "description": "Property data format",
                        "type": "string",
                        "default":"time",
                        "enum" : ["time"],
                        "readonly":true
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForSchema
         */
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "format": {
                        "type": "text"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "picker": {
                        "title": "DatetimePicker options",
                        "description": "Options that are supported by the <a href='https://github.com/m3wolf/bootstrap3-timepicker'>Bootstrap Time Picker</a>.",
                        "type": "any"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "picker": {
                        "type": "any"
                    }
                }
            });
        },

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Time Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Time Field";
        }

        //__END_OF_BUILDER_HELPERS
    });

    Alpaca.registerMessages({
        "invalidTime": "Invalid time"
    });
    Alpaca.registerFieldClass("time", Alpaca.Fields.TimeField);
    Alpaca.registerDefaultFormatFieldMapping("time", "time");

})(jQuery);
