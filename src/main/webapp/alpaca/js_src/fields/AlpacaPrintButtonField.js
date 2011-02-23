(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Abstract Button class
     */
    Alpaca.Fields.AlpacaPrintButtonField = Alpaca.Fields.AlpacaButtonField.extend({
    
        /**
         * @Override
         *
         * Sets up any default values for this field.
         */
        setup: function() {
			this.base();			
			// sets defaults
			if (!this.data) {
				this.data = Alpaca.getMessage("print", this);
			}			
		},
        
        /**
         * @Override
         */
        onClick: function(e) {
			this.form.topField.print();
		},
		
		/**
		 * @Override
		 */
		postRender: function () {
			this.base();
			this.inputElement.addClass("alpaca-form-button-alpaca-print");
			this.inputElement.button({
				text: true,
				icons: {
					primary: "ui-icon-print"
				}
			});			
		},
		
		/**
         * @Override
		 */
		getTitle: function() {
			return "Alpaca Screen Print Button";
		},
		
		/**
         * @Override
		 */
		getDescription: function() {
			return "Alpaca button for screen printing.";
		}		
    });

    // Registers additonal messages
    Alpaca.registerMessages({
        "print": "Print Screen"
    });
	    
    Alpaca.registerFieldClass("alpacaprintbutton", Alpaca.Fields.AlpacaPrintButtonField);
    
})(jQuery);
