(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Abstract Button class
     */
    Alpaca.Fields.PrintButtonField = Alpaca.Fields.ButtonField.extend({
    
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
			this.form.topControl.print();
		},
		
		/**
		 * @Override
		 */
		postRender: function () {
			this.base();
			this.field.addClass("alpaca-form-button-print");
			this.field.button({
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
	    
    Alpaca.registerFieldClass("printbutton", Alpaca.Fields.PrintButtonField);
    
})(jQuery);
