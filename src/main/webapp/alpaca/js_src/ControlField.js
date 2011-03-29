(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Abstract base class for all of the Alpaca Fields
     *
     * This extends the basic Field class and provisions all of the Alpaca fields with common properties as
     * well as look and feel (i.e. a common control class).
     *
     * The following additional settings are supported:
     *
     * {
     *    label: <string>							    optional
     *    labelClass: <string>					        optional
     *    helper: <string>                              optional
     *    helperClass: <string>                         optional
     *    showMessages: <boolean>					    optional - whether to show messages (true)
     * }
     */
    Alpaca.ControlField = Alpaca.Field.extend({
    
        /**
         * To be overridden
         */
        renderField: function(onSuccess) {
        
        },
        
        /**
         * Injects Field Element into Field Container
         */
        injectField: function(element) {
            // find out the field container
			var containerElem = $('.alpaca-controlfield-container', this.outerEl);			
            if (containerElem.length) {
                this.fieldContainer = containerElem;
            } else {
                this.fieldContainer = this.outerEl;
            }
            // now figure out where exactly we want to insert it
            var parentNode = $('.alpaca-field-container-field', this.fieldContainer);
            if (parentNode.length > 0) {
                if (parentNode.attr('data-replace') == 'true') {
                    parentNode.replaceWith(element);
                } else {
                    element.appendTo(parentNode);
                }
            } else {
                if (this.fieldContainer.attr('data-replace') == 'true') {
                    this.fieldContainer.replaceWith(element);
                } else {
                    element.prependTo(this.fieldContainer);
                }
            }
        },
        
        /**
         * @Override
         *
         * Finds labelDiv and helperDiv
         */
        postRender: function() {
			var labelDiv = $('.alpaca-controlfield-label', this.outerEl);
            if (labelDiv.length) {
                this.labelDiv = labelDiv;
            }
			var helperDiv = $('.alpaca-controlfield-helper', this.outerEl); 
            if (helperDiv.length) {
                this.helperDiv = helperDiv;
            }            
			this.base();			
			// add additional classes
			this.outerEl.addClass('alpaca-controlfield');			
        },
	
        /**
         * Validate against enum
         */
        _validateEnum: function() {
			if (this.schema["enum"]) {
				var val = this.data;/*this.getValue();*/
				if (!this.schema.required && Alpaca.isValEmpty(val)) {
					return true;
				}
				if ($.inArray(val, this.schema["enum"]) > -1) {
					return true;
				} else {
					return false;
				}
			} else {
				return true;
			}
		},
        
        /**
         * @Override
         *
         * Adds enum validation
         */
        handleValidate: function() {
            var baseStatus = this.base();
            
            var valInfo = this.validation;
			
			var status = this._validateEnum();
            valInfo["invalidValueOfEnum"] = {
                "message": status ? "" : Alpaca.substituteTokens(Alpaca.getMessage("invalidValueOfEnum", this), [this.schema["enum"].join(',')]),
                "status": status
            };

            return baseStatus && valInfo["invalidValueOfEnum"]["status"];
        },
        
        // Additional event handlers
        /**
         * @Override
         *
         * Sign up for events against the INPUT control
         */
        initEvents: function() {
            this.base();
            
            var _this = this;
            
            this.field.keypress(function(e) {
                _this.onKeyPress(e);
            });
            
            this.field.keyup(function(e) {
                _this.onKeyUp(e);
            });
            
            this.field.click(function(e) {
                _this.onClick(e);
            });
            
        },
        
        onKeyPress: function(e) {
        },
        
        onKeyUp: function(e) {
        },
        
        onClick: function(e) {
        },
        
        /**
         * @Override
         */
		getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(),{
				"properties": {
					"enum": {
						"title": "Enumeration",
						"description": "List of property value options",
						"type": "array"
					}
				}
			});
        },
		
        /**
         * @Override
         */
		getOptionsForSchema: function() {
            return Alpaca.merge(this.base(),{
				"fields": {
					"enum": {
						"itemLabel":"Value",
						"type": "array"
					}
				}
			});
        },
		
        /**
         * @Override
         */
		getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(),{
				"properties": {
					"name": {
						"title": "Field name",
						"description": "Field name",
						"type": "string"
					}
				}
			});
        },
		
        /**
         * @Override
         */
		getOptionsForOptions: function() {
            return Alpaca.merge(this.base(),{
				"fields": {
					"name": {
						"type": "text"
					}
				}
			});
        } 		 
		 		        
    });
    
    // Registers additonal messages
    Alpaca.registerMessages({
        "invalidValueOfEnum": "This field should have one of the values in {0}."
    });
    
})(jQuery);
