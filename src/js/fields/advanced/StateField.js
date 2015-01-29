(function($) {

    var Alpaca = $.alpaca;

    Alpaca.usHoldings = {};

    Alpaca.usHoldings.territories = {
        "American Samoa"                 : "AS",
        "District Of Columbia"           : "DC",
        "Federated States Of Micronesia" : "FM",
        "Guam"                           : "GU",
        "Marshall Islands"               : "MH",
        "Northern Mariana Islands"       : "MP",
        "Palau"                          : "PW",
        "Puerto Rico"                    : "PR",
        "Virgin Islands"                 : "VI"
    };

    Alpaca.usHoldings.states =  {
        "Alabama"                        : "AL",
        "Alaska"                         : "AK",
        "Arizona"                        : "AZ",
        "Arkansas"                       : "AR",
        "California"                     : "CA",
        "Colorado"                       : "CO",
        "Connecticut"                    : "CT",
        "Delaware"                       : "DE",
        "Florida"                        : "FL",
        "Georgia"                        : "GA",
        "Hawaii"                         : "HI",
        "Idaho"                          : "ID",
        "Illinois"                       : "IL",
        "Indiana"                        : "IN",
        "Iowa"                           : "IA",
        "Kansas"                         : "KS",
        "Kentucky"                       : "KY",
        "Louisiana"                      : "LA",
        "Maine"                          : "ME",
        "Maryland"                       : "MD",
        "Massachusetts"                  : "MA",
        "Michigan"                       : "MI",
        "Minnesota"                      : "MN",
        "Mississippi"                    : "MS",
        "Missouri"                       : "MO",
        "Montana"                        : "MT",
        "Nebraska"                       : "NE",
        "Nevada"                         : "NV",
        "New Hampshire"                  : "NH",
        "New Jersey"                     : "NJ",
        "New Mexico"                     : "NM",
        "New York"                       : "NY",
        "North Carolina"                 : "NC",
        "North Dakota"                   : "ND",
        "Ohio"                           : "OH",
        "Oklahoma"                       : "OK",
        "Oregon"                         : "OR",
        "Pennsylvania"                   : "PA",
        "Rhode Island"                   : "RI",
        "South Carolina"                 : "SC",
        "South Dakota"                   : "SD",
        "Tennessee"                      : "TN",
        "Texas"                          : "TX",
        "Utah"                           : "UT",
        "Vermont"                        : "VT",
        "Virginia"                       : "VA",
        "Washington"                     : "WA",
        "West Virginia"                  : "WV",
        "Wisconsin"                      : "WI",
        "Wyoming"                        : "WY"
    };

    Alpaca.Fields.StateField = Alpaca.Fields.SelectField.extend(
    /**
     * @lends Alpaca.Fields.StateField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "state";
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
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
            if (this.options.format === "name" || this.options.format === "code")
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
                (this.options.format === "code"),
                this.options.capitalize);

            this.schema["enum"] = holdings.keys;
            this.options.optionLabels = holdings.values;

            this.base();
        }


        /* builder_helpers */
        ,

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
        }

        /* end_builder_helpers */
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
     * @returns {Object} an object containing "keys" and "values", both of which are arrays.
     */
    Alpaca.retrieveUSHoldings = (function()
    {
        return function(includeStates, includeTerritories, codeValue, capitalize) {
            var res  = {
                keys:   [],
                values: []
            };
            var opts = $.extend(
                {},
                includeStates      ? Alpaca.usHoldings.states      : {},
                includeTerritories ? Alpaca.usHoldings.territories : {}
            );
            var sorted = Object.keys(opts);
            sorted.sort();
            for (var i in sorted) {
                var state = sorted[i];
                var key   = opts[state];
                var value = codeValue ? key : state;
                if (capitalize) {
                    value = value.toUpperCase();
                }
                res.keys.push(key);
                res.values.push(value);
            }
            return res;
        };
    })();

})(jQuery);
