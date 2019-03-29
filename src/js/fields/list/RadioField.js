(function($){

    var Alpaca = $.alpaca;

    Alpaca.Fields.RadioField = Alpaca.Fields.ListField.extend(
    /**
     * @lends Alpaca.Fields.RadioField.prototype
     */
    {
        /**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function() {
            return "radio";
        },

        /**
         * @see Alpaca.Fields.ListField#setup
         */
        setup: function()
        {
            var self = this;

            self.options.multiple = false;

            this.base();
            
            if (this.options.name)
            {
				this.name = this.options.name;
			}
			else if (!this.name)
            {
				this.name = this.getId() + "-name";
			}

            // empty select first to false by default
            if (Alpaca.isUndefined(this.options.emptySelectFirst))
            {
                this.options.emptySelectFirst = false;
            }

            // assume vertical orientation
            // empty select first to false by default
            if (Alpaca.isUndefined(this.options.vertical))
            {
                this.options.vertical = true;
            }
        },

        initControlEvents: function()
        {
            var self = this;

            self.base();

            var inputs = $(self.control).find("input");

            inputs.focus(function(e) {
                if (!self.suspendBlurFocus)
                {
                    self.onFocus.call(self, e);
                    self.trigger("focus", e);
                }
            });

            inputs.blur(function(e) {
                if (!self.suspendBlurFocus)
                {
                    self.onBlur.call(self, e);
                    self.trigger("blur", e);
                }
            });
        },

        prepareControlModel: function(callback)
        {
            var self = this;

            this.base(function(model) {

                model.removeDefaultNone = self.options.removeDefaultNone;

                if (typeof(self.options.noneLabel) === "undefined")
                {
                    self.options.noneLabel = self.getMessage("noneLabel");
                }

                if (typeof(self.options.hideNone) === "undefined")
                {
                    if (typeof(self.options.removeDefaultNone) !== "undefined")
                    {
                        self.options.hideNone = self.options.removeDefaultNone;
                    }
                    else
                    {
                        self.options.hideNone = self.isRequired();
                    }
                }

                callback(model);
            });
        },
        
        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                var afterChangeHandler = function()
                {
                    var newData = [];

                    $(self.control).find("input:radio:checked").each(function() {

                        var value = $(this).attr("value");
                        for (var i = 0; i < self.selectOptions.length; i++)
                        {
                            if (self.selectOptions[i].value === value)
                            {
                                newData.push(self.selectOptions[i].value);
                            }
                        }
                    });

                    // set value silently
                    self.setValue(newData, true);

                    self.refreshValidationState();
                    self.triggerWithPropagation("change");
                };

                $(self.control).find("input:radio").change(function(e) {

                    e.preventDefault();

                    afterChangeHandler();
                });


                // stack radio selectors vertically
                if (self.options.vertical)
                {
                    $(self.control).css("display", "block");
                }
                else
                {
                    $(self.control).css("display", "inline-block");
                }

                callback();

            });
        },

        /**
         * Ensures that the "name" property on the control is kept in sync.
         */
        updateDOMElement: function()
        {
            var self = this;

            this.base();

            $(self.control).find("input:radio").attr("name", this.getName());
        },

        afterSetValue: function()
        {
            var self = this;

            Alpaca.checked($(self.control).find("input:radio"), false);

            if (self.data.length > 0)
            {
                for (var i = 0; i < self.data.length; i++)
                {
                    var radio = $(self.control).find("input:radio[value='" + self.data[i].value + "']");
                    if (radio.length > 0)
                    {
                        Alpaca.checked(radio, true);
                    }
                }
            }
        },

        /**
         * @see Alpaca.Field#disable
         */
        disable: function()
        {
            this.base();

            // for radio buttons, we also mark the outer DIV as disabled to prevent label clicks
            // and apply some CSS styling
            this.getFieldEl().addClass("disabled");
        },

        /**
         * @see Alpaca.Field#enable
         */
        enable: function()
        {
            this.base();

            this.getFieldEl().removeClass("disabled");
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Field#getTitle
         */
        getTitle: function() {
            return "Radio Group Field";
        },

        /**
         * @see Alpaca.Field#getDescription
         */
        getDescription: function() {
            return "Radio Group Field with list of options.";
        },

        /**
         * @private
         * @see Alpaca.Fields.ListField#getSchemaOfOptions
         */
		getSchemaOfOptions: function()
        {
            return Alpaca.merge(this.base(),{
				"properties": {
					"name": {
						"title": "Field name",
						"description": "Field name.",
						"type": "string"
					},
                    "emptySelectFirst": {
                        "title": "Empty Select First",
                        "description": "If the data is empty, then automatically select the first item in the list.",
                        "type": "boolean",
                        "default": false
                    },
                    "vertical": {
                        "title": "Position the radio selector items vertically",
                        "description": "By default, radio controls are stacked vertically.  Set to false if you'd like radio controls to lay out horizontally.",
                        "type": "boolean",
                        "default": true
                    }
				}
			});
        }

        /* end_builder_helpers */
        
    });
    
    Alpaca.registerFieldClass("radio", Alpaca.Fields.RadioField);
    
})(jQuery);
