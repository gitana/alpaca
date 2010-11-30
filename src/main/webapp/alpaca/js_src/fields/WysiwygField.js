(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Text area field
     *
     * The following additional settings are permitted:
     *
     * {
     *    rows: <number>
     *    cols: <number>
     * }
     */
    Alpaca.Fields.WysiwygField = Alpaca.Fields.TextAreaField.extend({
    
        /**
         * @Override
         *
         */
        setup: function() {
            this.base();
        },
        
        /**
         * @Override
         */
    	postRender: function() {
            this.base();            
            // apply additional css
            $(this.fieldContainer).addClass("alpaca-wysiwygfield");
			// see if we can render jWysiwyg
			if (this.inputElement.wysiwyg) {
				this.inputElement.wysiwyg();
			}
        }       
    });
    
    Alpaca.registerFieldClass("wysiwyg", Alpaca.Fields.WysiwygField);
    
})(jQuery);
