(function($){

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
         * Sets up any default values for this field.
         */
        setup: function(){
            this.base();
            
            if (Alpaca.isUndefined(this.settings.showMessages)) {
                this.settings.showMessages = true;
            }
        },
        
        /**
         * @Override
         *
         * We manually set up the outer and use the template to define what goes into the "fieldContainer".
         */
        renderOuter: function(){
            var _this = this;
            
            // render into the fieldContainer
            this.processRender(this.fieldContainer, function(){
            
                // bind our field dom element into the container
                $(_this.getEl()).appendTo(_this.container);
                
                // allow any post-rendering facilities to kick in
                _this.postRender();
            });
        },
        
        /**
         * @Override
         *
         * In most cases, a template isn't used to render the control (though it is an option).
         * As such, we handle this default case and call through to a renderField method that can be
         * overridden to generate the stuff that gets placed into "fieldContainer".
         */
        handleNoTemplateRender: function(parentEl, onSuccess){
            this.renderField(onSuccess);
        },
        
        /**
         * To be overridden
         */
        renderField: function(onSuccess){
        
        },
        
        /**
         * Injects Field Element into Field Container
         */
        injectField: function(element){
            if ($('.alpaca-field-label', this.outerEl).length) {
                this.labelDiv = $('.alpaca-field-label', this.outerEl);
            }
            
            if ($('.alpaca-field-container', this.outerEl).length) {
                this.fieldContainer = $('.alpaca-field-container', this.outerEl);
            }
            else {
                this.fieldContainer = this.outerEl;
            }
            
            var parentNode = $('.alpaca-field-container-field', this.fieldContainer);
            if (parentNode.length > 0) {
                if (parentNode.attr('data-replace') == 'true') {
                    parentNode.replaceWith(element);
                }
                else {
                    $(element).appendTo(parentNode);
                }
            }
            else {
                if (this.fieldContainer.attr('data-replace') == 'true') {
                    this.fieldContainer.replaceWith(element);
                }
                else {
                    $(element).prependTo(this.fieldContainer);
                }
            }
        },
        /**
         * @Override
         */
        postRender: function(){
            if ($('.alpaca-field-helper', this.outerEl)) {
                this.helperDiv = $('.alpaca-field-helper', this.outerEl);
            }
            this.base();
        },
        
        /**
         * @Override
         */
        renderValidationState: function(){
            this.base();
            
            var state = this.getValidationState();
            
            // Allow for the message to change
            if (this.settings.showMessages) {
                if (!this.initializing) {
                    this.displayMessage(this.getValidationStateMessage(state));
                }
            }
        },
        
        _validateEnum: function(){
            var val = this.getValue();
            
            // JSON SCHEMA - enum
            if (this.schema["enum"]) {
                if ($.inArray(val, this.schema["enum"]) > -1) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return true;
            }
        },
        
        handleValidate: function(){
            if (!this._validateEnum()) {
                return false;
            }
            return true;
        },
        
        /**
         * @Override
         */
        getValidationStateMessage: function(state){
            if (state == Alpaca.STATE_INVALID) {
                if (!this._validateEnum()) {
                    var text = this.schema["enum"].join(',');
                    return Alpaca.substituteTokens(Alpaca.getMessage("invalidValueOfEnum", this), [text]);
                }
            }
            return this.base(state);
        },
        ///////////////////////////////////////////////////////////////////////////////////////////////
        //
        // MESSAGES
        //
        ///////////////////////////////////////////////////////////////////////////////////////////////		
        
        /**
         * Renders a validation state message below the field.
         */
        displayMessage: function(message){
            if (message && message.length > 0) {
                if (this.messageElement) {
                    $(this.messageElement).remove();
                }
                
                var messageTemplate = Alpaca.getTemplate("controlFieldMessage", this);
                if (messageTemplate) {
                    this.messageElement = $.tmpl(messageTemplate, {
                        "message": message
                    });
                    this.messageElement.addClass("alpaca-field-message");
                    this.messageElement.appendTo(this.getEl());
                }
            }
            else {
                // remove the message element if it exists
                if (this.messageElement) {
                    $(this.messageElement).remove();
                }
            }
        }
        
    });
    
    Alpaca.registerMessages({
        "invalidValueOfEnum": "This field should have one of the values in {0}."
    });
    
})(jQuery);
