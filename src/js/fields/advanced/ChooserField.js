(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.ChooserField = Alpaca.Fields.ListField.extend(
    /**
     * @lends Alpaca.Fields.ChooserField.prototype
     */
    {
        /**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function()
        {
            return "chooser";
        },

        /**
         * @see Alpaca.Field#getType
         */
            /*
        getType: function() {
            return ["array", "string"];
        },
        */


        /**
         * @see Alpaca.Fields.ListField#setup
         */
        setup: function()
        {
            var self = this;

            this.base();

            // we always store data as an array
            // call this right away to make sure whatever we were given is converted to an array
            self.setValue(self.data);
        },

        /**
         * @see Alpaca.Field#setValue
         */
        setValue: function(val)
        {
            if (typeof(val) === "undefined" || !val) {
                this.data = [];
            }
            else if (Alpaca.isArray(val)) {
                this.data = val;
            } else if (Alpaca.isString(val)) {
                this.data = val.split(",");
            }
        },

        /**
         * @see Alpaca.Field#getValue
         */
        getValue: function()
        {
            var self = this;

            var val = null;

            if (self.schema.type === "array") {
                val = this.data;
            } else if (self.schema.type === "string") {
                val = this.data.join(",");
            }

            return val;
        },

        /**
         * @see Alpaca.ListField#getEnum
         */
        getEnum: function()
        {
            if (this.schema)
            {
                if (this.schema["enum"])
                {
                    return this.schema["enum"];
                }
                else if (this.schema["type"] && this.schema["type"] === "array" && this.schema["items"] && this.schema["items"]["enum"])
                {
                    return this.schema["items"]["enum"];
                }
            }
        },

        prepareControlModel: function(callback) {
            var self = this;

            this.base(function (model) {

                model.selectOptions = self.selectOptions;

                if (self.options.height) {
                    model.height = self.options.height;
                }

                if (self.options.showAllSelections) {
                    model.showAllSelections = self.options.showAllSelections;
                }

                callback(model);
            });
        },

        beforeRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                model.unselected = [];
                model.selected = [];

                var tempMap = {};

                // build out unselected
                for (var i = 0; i < self.selectOptions.length; i++)
                {
                    if (!self.selectOptions[i].selected)
                    {
                        model.unselected.push(self.selectOptions[i]);
                    }
                    else
                    {
                        tempMap[self.selectOptions[i].value] = self.selectOptions[i];
                    }
                }

                // build out selected
                for (var i = 0; i < self.data.length; i++)
                {
                    model.selected.push(tempMap[self.data[i]]);
                }

                callback();

            });
        },

        filterUnselectedItems: function(filterText)
        {
            var self = this;

            if (!filterText) {
                filterText = "";
            }

            $(self.control).find(".chooser-filter input").val(filterText);

            $(self.control).find(".chooser-panel-unselected .chooser-item").each(function() {
                var itemText = $(this).attr("data-chooser-item-value");

                // assume it shows
                $(this).show();

                // if no match, filter it
                if (filterText && itemText.toLowerCase().indexOf(filterText.toLowerCase()) === -1)
                {
                    $(this).hide();
                }
            });
        },

        handleRefresh: function()
        {
            var self = this;

            // current filter text
            var filterText = $(self.control).find(".chooser-filter input").val();

            self.refresh(function() {

                // restore filter text
                this.filterUnselectedItems(filterText);
            });
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                var findIndex = function(button) {
                    var index = $(button).parent().parent().attr("data-chooser-item-index");
                    if (index) {
                        index = parseInt(index, 10);
                    }

                    return index;
                };

                var afterClickHandler = function()
                {
                    var d = [];
                    for (var i = 0; i < model.selected.length; i++)
                    {
                        d.push(model.selected[i].value);
                    }

                    self.data = d;
                    self.setValue(d);

                    self.handleRefresh();
                };

                $(self.control).find("button.btn-add").off().click(function(e) {

                    e.preventDefault();

                    var index = findIndex(this);
                    if (index > -1)
                    {
                        var x = model.unselected.splice(index, 1);
                        model.selected.push(x[0]);

                        afterClickHandler();
                    }
                });

                $(self.control).find("button.btn-remove").off().click(function(e) {

                    e.preventDefault();

                    var index = findIndex(this);
                    if (index > -1)
                    {
                        var x = model.selected.splice(index, 1);
                        model.unselected.push(x[0]);

                        afterClickHandler();
                    }
                });

                $(self.control).find("button.btn-up").off().click(function(e) {

                    e.preventDefault();

                    var index = findIndex(this);
                    if (index > 0)
                    {
                        var x = model.selected.splice(index, 1);
                        model.selected.splice(index - 1, 0, x[0]);

                        afterClickHandler();
                    }
                });

                $(self.control).find("button.btn-down").off().click(function(e) {

                    e.preventDefault();

                    var index = findIndex(this);
                    if (index < model.selected.length - 1)
                    {
                        var x = model.selected.splice(index, 1);
                        model.selected.splice(index + 1, 0, x[0]);

                        afterClickHandler();
                    }
                });

                $(self.control).find(".chooser-filter input").off().keyup(function(e) {

                    var filterText = $(this).val();

                    self.filterUnselectedItems(filterText);
                });

                setTimeout(function() {
                    if (typeof(model.height) === "undefined")
                    {
                        var _height = -1;
                        $(self.control).find(".chooser-panel-items").each(function() {
                            if ($(this).height() > _height) {
                                _height = $(this).height();
                            }
                        });

                        if (_height > -1) {
                            model.height = _height;
                        }
                    }

                    // set height
                    if (model.height)
                    {
                        $(self.control).find(".chooser-panel-items").css("height", model.height);

                        $(self.control).find(".chooser-item-message").css("text-align", "center");
                        $(self.control).find(".chooser-item-message").css("margin-top", (($(self.control).find(".chooser-panel-items").height() / 2) - 8) + "px");
                    }

                }, 0);

                callback();

            });
        },

        /**
         * Validate against enum property.
         *
         * @returns {Boolean} True if the element value is part of the enum list, false otherwise.
         */
        _validateEnum: function()
        {
            var self = this;

            var _enum = self.getEnum();
            if (!_enum)
            {
                return true;
            }

            if (!this.isRequired() && this.data.length === 0)
            {
                return true;
            }

            var isValid = true;

            for (var i = 0; i < this.data.length; i++)
            {
                var scalarValue = self.convertToScalarValue(this.data[i]);

                var inArray = Alpaca.inArray(_enum, scalarValue);
                if (!inArray)
                {
                    isValid = false;
                    break;
                }
            }

            return isValid;
        },

        /**
         * Validates if number of items has been less than minItems.
         * @returns {Boolean} true if number of items has been less than minItems
         */
        _validateMinItems: function()
        {
            if (this.schema.minItems && this.schema.minItems >= 0)
            {
                if (this.data.length < this.schema.minItems)
                {
                    return false;
                }
            }

            return true;
        },

        /**
         * Validates if number of items has been over maxItems.
         * @returns {Boolean} true if number of items has been over maxItems
         */
        _validateMaxItems: function()
        {
            if (this.schema.maxItems && this.schema.maxItems >= 0)
            {
                if (this.data.length > this.schema.maxItems)
                {
                    return false;
                }
            }

            return true;
        },

        /**
         * @see Alpaca.ContainerField#handleValidate
         */
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateMaxItems();
            valInfo["tooManyItems"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("tooManyItems"), [this.schema.maxItems]),
                "status": status
            };

            status = this._validateMinItems();
            valInfo["notEnoughItems"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("notEnoughItems"), [this.schema.minItems]),
                "status": status
            };

            return baseStatus && valInfo["tooManyItems"]["status"] && valInfo["notEnoughItems"]["status"];
        },

        /**
         * @see Alpaca.Field#focus
         */
        focus: function(onFocusCallback)
        {
            if (onFocusCallback)
            {
                onFocusCallback(this);
            }
        },

        /**
         * @override
         */
        disable: function()
        {
            $(this.control).find(".chooser-panel-items .chooser-item .chooser-item-buttons button.btn").addClass("disabled");
            $(this.control).find(".chooser-panel-items .chooser-item").addClass("disabled");
            $(this.control).find(".chooser-filter input").attr("disabled", "disabled");
        },

        /**
         * @override
         */
        enable: function()
        {
            var self = this;

            self.handleRefresh();
        }




        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Field#getTitle
         */
        getTitle: function() {
            return "Chooser Field";
        },

        /**
         * @see Alpaca.Field#getDescription
         */
        getDescription: function() {
            return "Chooser Field";
        },

        /**
         * @private
         * @see Alpaca.Fields.ListField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "showAllSelections": {
                        "type": "boolean",
                        "title": "Show All Selections",
                        "description": "When true, show full selection list and disable anything already selected",
                        "default": false
                    },
                    "height": {
                        "type": "number",
                        "title": "Height",
                        "description": "Specify a fixed height for the list boxes.  If not provided, the list boxes size to the amount of data."
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.ListField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                }
            });
        }

        /* end_builder_helpers */

    });

    Alpaca.registerFieldClass("chooser", Alpaca.Fields.ChooserField);

})(jQuery);
