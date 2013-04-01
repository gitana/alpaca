(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.StateField = Alpaca.Fields.SelectField.extend(
    /**
     * @lends Alpaca.Fields.StateField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.TextField
         *
         * @class State Control
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
        setup: function() {

            // defaults
            if (Alpaca.isUndefined(this.options.capitalize)) {
                this.options.capitalize = false;
            }
            if (Alpaca.isUndefined(this.options.includeStates)) {
                this.options.includeStates = true;
            }
            if (Alpaca.isUndefined(this.options.includeTerritories)) {
                this.options.includeTerritories = true;
            }
            if (Alpaca.isUndefined(this.options.format)) {
                this.options.format = "name";
            }

            // validate settings
            if (this.options.format == "name" || this.options.format == "code")
            {
                // valid formats
            }
            else
            {
                Alpaca.logError("The configured state format: " + this.options.format + " is not a legal value [name, code]");

                // default to name format
                this.options.format = "name";
            }

            // configure
            var holdings = Alpaca.retrieveUSHoldings(
                this.options.includeStates,
                this.options.includeTerritories,
                (this.options.format == "code"),
                this.options.capitalize);

            this.schema["enum"] = holdings.keys;
            this.options.optionLabels = holdings.values;

            this.base();
        },

        /**
         * @see Alpaca.Fields.TextField#postRender
         */
        postRender: function() {
            this.base();
            if (this.fieldContainer) {
                this.fieldContainer.addClass('alpaca-controlfield-state');
            }
        },

        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function() {
            var baseStatus = this.base();

            // no additional validation

            return baseStatus;
        },//__BUILDER_HELPERS

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {

            return Alpaca.merge(this.base(), {
                "properties": {
                    "format": {
                        "title": "Format",
                        "description": "How to represent the state values in the selector",
                        "type": "string",
                        "default": "name",
                        "enum":["name", "code"],
                        "readonly": true
                    },
                    "capitalize": {
                        "title": "Capitalize",
                        "description": "Whether the values should be capitalized",
                        "type": "boolean",
                        "default": false,
                        "readonly": true
                    },
                    "includeStates": {
                        "title": "Include States",
                        "description": "Whether to include the states of the United States",
                        "type": "boolean",
                        "default": true,
                        "readonly": true
                    },
                    "includeTerritories": {
                        "title": "Include Territories",
                        "description": "Whether to include the territories of the United States",
                        "type": "boolean",
                        "default": true,
                        "readonly": true
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
                    "format": {
                        "type": "text"
                    },
                    "capitalize": {
                        "type": "checkbox"
                    },
                    "includeStates": {
                        "type": "checkbox"
                    },
                    "includeTerritories": {
                        "type": "checkbox"
                    }
                }
            });
        },

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "State Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Provides a dropdown selector of states and/or territories in the United States, keyed by their two-character code.";
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "state";
        }//__END_OF_BUILDER_HELPERS
    });

    Alpaca.registerFieldClass("state", Alpaca.Fields.StateField);
    Alpaca.registerDefaultFormatFieldMapping("state", "state");

    /**
     * Helper function to retrieve the holdings of US states and territories.
     *
     * @param {Boolean} includeStates whether to include US states
     * @param {Boolean} includeTerritories whether to include US territories
     * @param {Boolean} codeValue whether to hand back US holding codes (instead of names)
     * @param {Boolean} capitalize whether to capitalize the values handed back
     *
     * @type {Object} an object containing "keys" and "values", both of which are arrays.
     */
    Alpaca.retrieveUSHoldings = function()
    {
        var holdings = [];
        holdings.push({
            "name": "Arkansas",
            "code": "AK",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Alabama",
            "code": "AL",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "American Samoa",
            "code": "AS",
            "state": false,
            "territory": true
        });
        holdings.push({
            "name": "Arizona",
            "code": "AR",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "California",
            "code": "CA",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Colorado",
            "code": "CO",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Connecticut",
            "code": "CT",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Delaware",
            "code": "DE",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Distict of Columbia",
            "code": "DC",
            "state": false,
            "territory": true
        });
        holdings.push({
            "name": "Federated States of Micronesia",
            "code": "FM",
            "state": false,
            "territory": true
        });
        holdings.push({
            "name": "Florida",
            "code": "FL",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Georgia",
            "code": "GA",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Guam",
            "code": "GU",
            "state": false,
            "territory": true
        });
        holdings.push({
            "name": "Georgia",
            "code": "GA",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Hawaii",
            "code": "HI",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Idaho",
            "code": "ID",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Illinois",
            "code": "IL",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Indiana",
            "code": "IN",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Iowa",
            "code": "IA",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Kansas",
            "code": "KS",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Kentucky",
            "code": "KY",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Louisiana",
            "code": "LA",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Maine",
            "code": "ME",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Marshall Islands",
            "code": "MH",
            "state": false,
            "territory": true
        });
        holdings.push({
            "name": "Maryland",
            "code": "MD",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Massachusetts",
            "code": "MA",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Michigan",
            "code": "MI",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Minnesota",
            "code": "MN",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Mississippi",
            "code": "MS",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Missouri",
            "code": "MO",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Montana",
            "code": "MT",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Nebraska",
            "code": "NE",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Nevada",
            "code": "NV",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "New Hampshire",
            "code": "NH",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "New Jersey",
            "code": "NJ",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "New Mexico",
            "code": "NM",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "New York",
            "code": "NY",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "North Carolina",
            "code": "NC",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "North Dakota",
            "code": "ND",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Northern Mariana Islands",
            "code": "MP",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Ohio",
            "code": "OH",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Oklahoma",
            "code": "OK",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Oregon",
            "code": "OR",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Palau",
            "code": "PW",
            "state": false,
            "territory": true
        });
        holdings.push({
            "name": "Pennsylvania",
            "code": "PA",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Puerto Rico",
            "code": "PR",
            "state": false,
            "territory": true
        });
        holdings.push({
            "name": "Rhode Island",
            "code": "RI",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "South Carolina",
            "code": "SC",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "South Dakota",
            "code": "SD",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Tennessee",
            "code": "TN",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Texas",
            "code": "TX",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Utah",
            "code": "UT",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Vermont",
            "code": "VT",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Virgin Islands",
            "code": "VI",
            "state": false,
            "territory": true
        });
        holdings.push({
            "name": "Virginia",
            "code": "VA",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Washington",
            "code": "WA",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "West Virginia",
            "code": "WV",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Wisconsin",
            "code": "WI",
            "state": true,
            "territory": false
        });
        holdings.push({
            "name": "Wyoming",
            "code": "WY",
            "state": true,
            "territory": false
        });

        return function(includeStates, includeTerritories, codeValue, capitalize) {

            var result = {
                "keys": [],
                "values": []
            };

            for (var i = 0; i < holdings.length; i++)
            {
                var keep = false;

                if (holdings[i].state && includeStates) {
                    keep = true;
                } else if (holdings[i].territory && includeTerritories) {
                    keep = true;
                }

                if (keep) {

                    var key = holdings[i].code;
                    var value = holdings[i].name;

                    if (codeValue) {
                        value = holdings[i].code;
                    }
                    if (capitalize) {
                        value = value.toUpperCase();
                    }

                    result.keys.push(key);
                    result.values.push(value);
                }
            }

            return result;
        };
    }();

})(jQuery);
