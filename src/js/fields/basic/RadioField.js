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

        /**
         * @see Alpaca.Field#getValue
         */
        getValue: function()
        {
            var self = this;

            var val = null;

            $(this.control).find(":checked").each(function() {
                val = $(this).val();

                val = self.ensureProperType(val);
            });

            return val;
        },
        
        /**
         * @see Alpaca.Field#setValue
         */
        setValue: function(val)
        {
            var self = this;

            // clear all
            $(this.control).find("input").each(function() {
                Alpaca.checked($(this), null);
            });

            // mark selected value
            if (typeof(val) != "undefined")
            {
                Alpaca.checked($(self.control).find("input[value=\"" + val + "\"]"), "checked");
            }

            // if none selected and "emptySelectFirst", then select
            if (this.options.emptySelectFirst)
            {
                if ($(this.control).find("input:checked").length === 0)
                {
                    Alpaca.checked($(self.control).find("input:radio").first(), "checked");
                }
            }

            this.base(val);
        },

        initControlEvents: function()
        {
            var self = this;

            self.base();

            var inputs = $(this.control).find("input");

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

                model.selectOptions = self.selectOptions;
                model.removeDefaultNone = self.options.removeDefaultNone;

                callback(model);
            });
        },
        
        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                // if emptySelectFirst and nothing currently checked, then pick first item in the value list
                // set data and visually select it
                if (self.options.emptySelectFirst && self.selectOptions && self.selectOptions.length > 0)
                {
                    self.data = self.selectOptions[0].value;

                    if ($("input:radio:checked", self.control).length === 0)
                    {
                        Alpaca.checked($(self.control).find("input:radio[value=\"" + self.data + "\"]"), "checked");
                    }
                }

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
         * @see Alpaca.ControlField#onClick
         */
        onClick: function(e)
        {
            this.base(e);

            var self = this;

            var val = $(e.currentTarget).find("input").val();
            if (typeof(val) != "undefined")
            {
                self.setValue(val);
                self.refreshValidationState();
            }

            /*
            Alpaca.later(25, this, function(){
                var v = self.getValue();
                self.setValue(v);
                self.refreshValidationState();
            });
            */

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
