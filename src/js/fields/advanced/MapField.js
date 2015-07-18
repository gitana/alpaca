(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.MapField = Alpaca.Fields.ArrayField.extend(
    /**
     * @lends Alpaca.Fields.MapField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextAreaField#getFieldType
         */
        getFieldType: function() {
            return "map";
        },

        getType: function()
        {
            return "object"
        },

        /**
         * @see Alpaca.Fields.TextAreaField#setup
         */
        setup: function()
        {
            // special handling - data can come in as an object, we convert to array
            if (this.data && Alpaca.isObject(this.data))
            {
                var newData = [];

                $.each(this.data, function(key, value) {
                    var newValue = Alpaca.copyOf(value);
                    newValue["_key"] = key;
                    newData.push(newValue);
                });

                this.data = newData;
            }

            this.base();

            Alpaca.mergeObject(this.options, {
                "forceRevalidation" : true
            });

            if (Alpaca.isEmpty(this.data))
            {
                return;
            }
        },

        /**
         * @see Alpaca.ContainerField#getContainerValue
         */
        getContainerValue: function()
        {
            // if we don't have any children and we're not required, hand back undefined
            if (this.children.length === 0 && !this.isRequired())
            {
                return;
            }

            // special handling, convert back to object
            var o = {};
            for (var i = 0; i < this.children.length; i++)
            {
                var v = this.children[i].getValue();
                var key = v["_key"];
                if (key)
                {
                    delete v["_key"];
                    o[key] = v;
                }
            }

            return o;
        },

        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var isValidMapKeysNotEmpty = this._validateMapKeysNotEmpty();
            valInfo["keyMissing"] = {
                "message": isValidMapKeysNotEmpty ? "" : this.getMessage("keyMissing"),
                "status": isValidMapKeysNotEmpty
            };

            var isValidMapKeysUnique = this._validateMapKeysUnique();
            valInfo["keyNotUnique"] = {
                "message": isValidMapKeysUnique ? "" : this.getMessage("keyNotUnique"),
                "status": isValidMapKeysUnique
            };

            return baseStatus && valInfo["keyMissing"]["status"] && valInfo["keyNotUnique"]["status"];
        },

        /**
         * Validates that key fields are not empty.
         *
         * @returns {Boolean} true if keys are not empty
         */
        _validateMapKeysNotEmpty: function()
        {
            var isValid = true;

            for (var i = 0; i < this.children.length; i++)
            {
                var v = this.children[i].getValue();
                var key = v["_key"];

                if (!key)
                {
                    isValid = false;
                    break;
                }
            }

            return isValid;
        },

        /**
         * Validates if key fields are unique.
         *
         * @returns {Boolean} true if keys are unique
         */
        _validateMapKeysUnique: function()
        {
            var isValid = true;

            var keys = {};
            for (var i = 0; i < this.children.length; i++)
            {
                var v = this.children[i].getValue();
                var key = v["_key"];

                if (keys[key])
                {
                    isValid = false;
                }

                keys[key] = key;
            }

            return isValid;
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextAreaField#getTitle
         */
        getTitle: function() {
            return "Map Field";
        },

        /**
         * @see Alpaca.Fields.TextAreaField#getDescription
         */
        getDescription: function() {
            return "Field for objects with key/value pairs that share the same schema for values.";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("map", Alpaca.Fields.MapField);

    // Additional Registrations
    Alpaca.registerMessages({
        "keyNotUnique": "Keys of map field are not unique.",
        "keyMissing": "Map contains an empty key."
    });

})(jQuery);
