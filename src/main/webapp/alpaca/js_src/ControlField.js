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
			if ($('.alpaca-field-container', this.outerEl).length) {
                this.fieldContainer = $('.alpaca-field-container', this.outerEl);
            } else {
                this.fieldContainer = this.outerEl;
            }
            // now figure out where exactly we want to insert it
            var parentNode = $('.alpaca-field-container-field', this.fieldContainer);
            if (parentNode.length > 0) {
                if (parentNode.attr('data-replace') == 'true') {
                    parentNode.replaceWith(element);
                } else {
                    $(element).appendTo(parentNode);
                }
            } else {
                if (this.fieldContainer.attr('data-replace') == 'true') {
                    this.fieldContainer.replaceWith(element);
                } else {
                    $(element).prependTo(this.fieldContainer);
                }
            }
        },
		
        /**
         * @Override
         * 
         * Finds labelDiv and helperDiv
         */
        postRender: function() {
			if ($('.alpaca-field-label', this.outerEl).length) {
				this.labelDiv = $('.alpaca-field-label', this.outerEl);
			}
			if ($('.alpaca-field-helper', this.outerEl)) {
				this.helperDiv = $('.alpaca-field-helper', this.outerEl);
			}
			this.base();
		},
		
        /**
         * Validate against enum
         */                
        _validateEnum: function() {
            var val = this.getValue();
            
            // JSON SCHEMA - enum
            if (this.schema["enum"]) {
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
            if (!this._validateEnum()) {
                return false;
            }
            return this.base();
        },
        
        /**
         * @Override
         * 
         * Adds enum validation message
         */
        getValidationStateMessage: function(state) {
            if (state == Alpaca.STATE_INVALID) {
                if (!this._validateEnum()) {
                    var text = this.schema["enum"].join(',');
                    return Alpaca.substituteTokens(Alpaca.getMessage("invalidValueOfEnum", this), [text]);
                }
            }
            return this.base(state);
        },
        
        // Additional event handlers
        /**
         * @Override
         *
         * Sign up for events against the INPUT control
         */
        initEvents: function(){
            this.base();
            
            var _this = this;
            
            $(this.inputElement).keypress(function(e){
                _this.onKeyPress(e);
            });
            
            $(this.inputElement).keyup(function(e){
                _this.onKeyUp(e);
            });
            
            $(this.inputElement).click(function(e){
                _this.onClick(e);
            });
            
        },
		
		onKeyPress: function(e) {
		},
        
        onKeyUp: function(e){
        },
        
        onClick: function(e){
        }		
        
    });
    
    // Registers additonal messages
	Alpaca.registerMessages({
        "invalidValueOfEnum": "This field should have one of the values in {0}."
    });
    
})(jQuery);
