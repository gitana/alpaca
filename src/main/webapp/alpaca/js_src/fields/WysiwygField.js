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
			// see if we can render jWysiwyg
			if (this.inputElement.wysiwyg) {
				this.inputElement.wysiwyg();
			}
			if (this.fieldContainer) {
				this.fieldContainer.addClass('alpaca-controlfield-wysiwyg');
			}			
        },
		
		/**
         * @Override
		 */
		getTitle: function() {
			return "Wysiwyg Editor";
		},
		
		/**
         * @Override
		 */
		getDescription: function() {
			return "Wysiwyd editor for multi-line text.";
		},

		/**
         * @Override
         */
        getFieldType: function() {
            return "wysiwyg";
        }       
    });
    
    Alpaca.registerFieldClass("wysiwyg", Alpaca.Fields.WysiwygField);
    
})(jQuery);
