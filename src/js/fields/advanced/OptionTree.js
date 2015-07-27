(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.OptionTreeField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.OptionTree.prototype
     */
    {
        /**
         * @see Alpaca.Fields.ObjectField#getFieldType
         */
        getFieldType: function() {
            return "optiontree";
        },

        /**
         * @private
         * @see Alpaca.Fields.ObjectField#setup
         */
        setup: function()
        {
            var self = this;

            this.base();

            if (!this.options.tree)
            {
                this.options.tree = {};
            }

            if (!this.options.tree.selectors)
            {
                this.options.tree.selectors = {};
            }

            if (!this.options.tree.order)
            {
                this.options.tree.order = [];
            }

            // ensure all options have schema
            for (var k in this.options.tree.selectors)
            {
                if (!this.options.tree.selectors[k].schema) {
                    Alpaca.logError("OptionTree selector for: " + k + " is missing schema");
                    return;
                }

                if (!this.options.tree.selectors[k].options) {
                    this.options.tree.selectors[k].options = {};
                }
            }

            if (!this.options.tree.data)
            {
                this.options.tree.data = [];
            }

            // walk data
            for (var i = 0; i < this.options.tree.data.length; i++)
            {
                var item = this.options.tree.data[i];

                if (item.attributes)
                {
                    for (var k in item.attributes)
                    {
                        if (!this.options.tree.selectors[k])
                        {
                            this.options.tree.selectors[k] = {};
                        }

                        if (!this.options.tree.selectors[k].label)
                        {
                            this.options.tree.selectors[k].options.noneLabel = "Choose...";
                        }

                        if (!this.options.tree.selectors[k].type)
                        {
                            this.options.tree.selectors[k].options.type = "select";
                        }
                    }
                }
            }

            // assume the order from the options if not otherwise provided
            if (!self.options.tree.order)
            {
                self.options.tree.order = [];

                for (var k in self.options.tree.selectors)
                {
                    self.options.tree.order.push(self.options.tree.selectors[k]);
                }
            }

            if (typeof(self.options.tree.horizontal) === "undefined")
            {
                self.options.tree.horizontal = true;
            }

            // create a lookup list for option list key/value based on location
            this.locationValueLists = {};
            this.locationValues = {};

            for (var i = 0; i < self.options.tree.data.length; i++)
            {
                if (self.options.tree.data[i].attributes)
                {
                    var location = "root";

                    for (var k in self.options.tree.data[i].attributes)
                    {
                        var v = self.options.tree.data[i].attributes[k];

                        var array = this.locationValueLists[location];
                        if (!array) {
                            array = [];
                            this.locationValueLists[location] = array;
                        }

                        var exists = false;
                        for (var x = 0; x < array.length; x++)
                        {
                            if (array[x].value === v) {
                                exists = true;
                                break;
                            }
                        }

                        if (!exists)
                        {
                            array.push({
                                "text": v,
                                "value": v
                            });
                        }

                        if (location.length > 0) {
                            location += "~";
                        }

                        location += k + "=" + v;
                    }

                    this.locationValues[location] = self.options.tree.data[i].value;
                }
            }

            this.currentAttributes = {};
            this.controls = {};
        },

        toLocation: function(attrs)
        {
            var location = "root";

            for (var k in attrs)
            {
                var v = attrs[k];

                if (location.length > 0) {
                    location += "~";
                }

                location += k + "=" + v;
            }

            return location;
        },

        existsLocationWithPrefix: function(prefix)
        {
            var match = false;

            for (var k in this.locationValueLists)
            {
                if (k.indexOf(prefix) > -1)
                {
                    match = true;
                    break;
                }
            }

            return match;
        },

        /**
         * @see Alpaca.Field#afterRenderControl
         */
        afterRenderControl: function(model, callback) {

            var self = this;

            self.optionTreeHolder = $(self.field).find(".optiontree");

            if (self.options.tree.horizontal)
            {
                $(self.field).addClass("optiontree-horizontal");
            }

            this.base(model, function() {

                self.refreshOptionTreeControls(function() {
                    callback();
                });

            });
        },

        refreshOptionTreeControls: function(callback)
        {
            var self = this;

            // hide all of the controls
            for (var k in self.controls)
            {
                self.controls[k].hide();
            }

            // find the index of the last option for which we are missing a value
            var displayUpToIndex = 0;
            for (var i = 0; i < self.options.tree.order.length; i++)
            {
                var selectorId = self.options.tree.order[i];

                if (typeof(self.currentAttributes[selectorId]) !== "undefined" && self.currentAttributes[selectorId] !== null  && self.currentAttributes[selectorId] !== "")
                {
                    displayUpToIndex++;
                }
            }

            // walk through order and construct render functions
            var location = "root";
            var fns = [];
            var displayCount = 0;
            var i = 0;
            do
            {
                if (i < self.options.tree.order.length)
                {
                    var selectorId = self.options.tree.order[i];

                    var hasMatches = (i == self.options.tree.order.length - 1) || (self.existsLocationWithPrefix(location + "~" + selectorId + "="));
                    if (hasMatches)
                    {
                        if (displayCount <= displayUpToIndex)
                        {
                            if (self.controls[selectorId])
                            {
                                // show this one
                                self.controls[selectorId].show();

                                location += "~" + selectorId + "=" + self.currentAttributes[selectorId];
                            }
                            else
                            {
                                var selector = self.options.tree.selectors[selectorId];
                                var last = (i + 1 === self.options.tree.order.length);

                                var fn = function(index, selectorId, selector, controls, optionTreeHolder, last) {
                                    return function(done) {

                                        var alpacaSchema = selector.schema;

                                        var alpacaOptions = selector.options;
                                        if (!alpacaOptions) {
                                            alpacaOptions = {};
                                        }
                                        if (!alpacaOptions.type) {
                                            alpacaOptions.type = "select";
                                        }

                                        if (alpacaOptions.type === "select") {

                                            alpacaOptions.dataSource = function(callback) {

                                                var currentLocation = self.toLocation(self.currentAttributes);
                                                var currentValueList = self.locationValueLists[currentLocation];

                                                callback(currentValueList);

                                            };
                                        }

                                        // render via alpaca
                                        var domEl = $("<div class='optiontree-selector'></div>");

                                        $(domEl).alpaca({
                                            "schema": alpacaSchema,
                                            "options": alpacaOptions,
                                            "postRender": function(control) {

                                                controls[selectorId] = control;

                                                // append to the holder element
                                                $(optionTreeHolder).append(domEl);

                                                control.selectorId = selectorId;

                                                // when the value of this control changes, we record it into our
                                                // current attribute set
                                                control.on("change", function() {

                                                    var selectorId = this.selectorId;

                                                    // set our attribute value
                                                    self.currentAttributes[selectorId] = this.getValue();

                                                    // clear out everything past our index value
                                                    for (var i = 0; i < self.options.tree.order.length; i++)
                                                    {
                                                        if (i > index)
                                                        {
                                                            var selectorId = self.options.tree.order[i];
                                                            delete self.currentAttributes[selectorId];
                                                            if (controls[selectorId])
                                                            {
                                                                controls[selectorId].destroy();
                                                                delete controls[selectorId];
                                                            }
                                                        }
                                                    }

                                                    if (last)
                                                    {
                                                        // find the match
                                                        var val = null;

                                                        for (var i = 0; i < self.options.tree.data.length; i++)
                                                        {
                                                            var match = true;

                                                            var attrs = self.options.tree.data[i].attributes;
                                                            for (var k in self.currentAttributes)
                                                            {
                                                                if (attrs[k] !== self.currentAttributes[k])
                                                                {
                                                                    match = false;
                                                                    break;
                                                                }
                                                            }

                                                            if (match)
                                                            {
                                                                val = self.options.tree.data[i].value;
                                                            }
                                                        }

                                                        if (val)
                                                        {
                                                            self.setValue(val);
                                                        }
                                                    }

                                                    self.refreshOptionTreeControls();
                                                });

                                                // show by default
                                                control.show();

                                                done();
                                            }
                                        });
                                    }
                                }(i, selectorId, selector, self.controls, self.optionTreeHolder, last);

                                fns.push(fn);

                                location += "~" + selectorId + "=" + self.currentAttributes[selectorId];
                            }

                            displayCount++;
                        }
                        else
                        {
                            if (self.controls[selectorId])
                            {
                                self.controls[selectorId].destroy();
                                delete self.controls[selectorId];
                            }
                        }
                    }
                    else
                    {
                        if (self.controls[selectorId])
                        {
                            self.controls[selectorId].destroy();
                            delete self.controls[selectorId];
                        }
                    }
                }

                i++;
            }
            while (i < self.options.tree.order.length);

            Alpaca.series(fns, function() {

                if (callback)
                {
                    callback();
                }

            });

        },

        /**
         * @see Alpaca.Fields.ObjectField#getType
         */
        getType: function() {
            return "any";
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.ObjectField#getTitle
         */
        getTitle: function() {
            return "Option Tree";
        },

        /**
         * @see Alpaca.Fields.ObjectField#getDescription
         */
        getDescription: function() {
            return "Option Tree";
        },

        /**
         * @private
         * @see Alpaca.Fields.ObjectField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "tree": {
                        "type": "object",
                        "properties": {
                            "options": {
                                "type": "object"
                            },
                            "order": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "data": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "value": {
                                            "type": "any"
                                        },
                                        "attributes": {
                                            "type": "object"
                                        }
                                    }
                                }
                            },
                            "horizontal": {
                                "type": "boolean"
                            }
                        }
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.ObjectField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("optiontree", Alpaca.Fields.OptionTreeField);

})(jQuery);
