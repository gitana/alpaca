(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.MapField = Alpaca.Fields.ArrayField.extend(
    /**
     * @lends Alpaca.Fields.MapField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.TextAreaField
         *
         * @class JSON control for chunk of text.
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
         * @see Alpaca.Fields.TextAreaField#setup
         */
        setup: function() {

            this.base();

            Alpaca.mergeObject(this.options, {
                "forceRevalidation" : true
            });

            if (Alpaca.isEmpty(this.data)) {
                return;
            }

            if (!Alpaca.isArray(this.data)) {

                if (Alpaca.isObject(this.data)) {
                    var newData = [];
                    $.each(this.data, function(key, value) {
                        var newValue = Alpaca.copyOf(value);
                        newValue["_key"] = key;
                        newData.push(newValue);
                    });
                    this.data = newData;
                }
            }
        },

        /**
         * @see Alpaca.ContainerField#getValue
         */
        getValue: function()
        {
            // if we don't have any children and we're not required, hand back undefined
            if (this.children.length === 0 && !this.schema.required)
            {
                return;
            }

            var o = {};
            for (var i = 0; i < this.children.length; i++) {
                var v = this.children[i].getValue();
                var key = v["_key"];
                if (key) {
                    delete v["_key"];
                    o[key] = v;
                }
            }
            return o;
        },

        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function() {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var isValidMapKeysNotEmpty = this._validateMapKeysNotEmpty();
            valInfo["keyMissing"] = {
                "message": isValidMapKeysNotEmpty ? "" : this.view.getMessage("keyMissing"),
                "status": isValidMapKeysNotEmpty
            };

            var isValidMapKeysUnique = this._validateMapKeysUnique();
            valInfo["keyNotUnique"] = {
                "message": isValidMapKeysUnique ? "" : this.view.getMessage("keyNotUnique"),
                "status": isValidMapKeysUnique
            };

            return baseStatus && valInfo["keyMissing"]["status"] && valInfo["keyNotUnique"]["status"];
        },

        /**
         * Validates if key fields are unique.
         * @returns {Boolean} true if keys are unique
         */
        _validateMapKeysNotEmpty: function() {

            var isValid = true;

            for (var i = 0; i < this.children.length; i++) {
                var v = this.children[i].getValue();
                var key = v["_key"];

                if (!key) {
                    isValid = false;
                    break;
                }
            }

            return isValid;
        },

        /**
         * Validates if key fields are unique.
         * @returns {Boolean} true if keys are unique
         */
        _validateMapKeysUnique: function() {

            var isValid = true;

            var keys = {};
            for (var i = 0; i < this.children.length; i++) {
                var v = this.children[i].getValue();
                var key = v["_key"];

                if (keys[key]) {
                    isValid = false;
                }

                keys[key] = key;
            }

            return isValid;
        },

        /**
         * @see Alpaca.Fields.TextAreaField#postRender
         */
        postRender: function() {
            this.base();
			if (this.fieldContainer) {
				this.fieldContainer.addClass('alpaca-controlfield-map');
			}
        },//__BUILDER_HELPERS

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
		},

		/**
         * @see Alpaca.Fields.TextAreaField#getFieldType
         */
        getFieldType: function() {
            return "map";
        }//__END_OF_BUILDER_HELPERS
    });

    Alpaca.registerFieldClass("map", Alpaca.Fields.MapField);

    // Additional Registrations
    Alpaca.registerMessages({
        "keyNotUnique": "Keys of map field are not unique.",
        "keyMissing": "Map contains an empty key."
    });
})(jQuery);
