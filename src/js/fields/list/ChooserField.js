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

            self.options.multiple = true;

            this.base();
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

                var unselectedIndex = 0;

                // build out unselected
                for (var i = 0; i < self.selectOptions.length; i++)
                {
                    if (!self.selectOptions[i].selected)
                    {
                        model.unselected.push(self.selectOptions[i]);

                        self.selectOptions[i].unselectedIndex = unselectedIndex;
                        unselectedIndex++;
                    }
                    else
                    {
                        tempMap[self.selectOptions[i].value] = self.selectOptions[i];
                    }
                }

                // build out selected
                for (var i = 0; i < self.data.length; i++)
                {
                    model.selected.push(tempMap[self.data[i].value]);
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
                var itemText = $(this).attr("data-chooser-item-text");

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
                        d.push(model.selected[i]);
                    }

                    self.data = d;

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

        afterSetValue: function()
        {
            var self = this;

            self.handleRefresh();
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
