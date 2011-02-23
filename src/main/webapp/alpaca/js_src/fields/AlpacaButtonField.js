(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Abstract Alpaca Button class
     */
    Alpaca.Fields.AlpacaButtonField = Alpaca.Fields.ButtonField.extend({
    
        /**
         * @Override
         *
         * Sets up any default values for this field.
         */
        setup: function() {
            this.base();
            this.buttonType = "button";
            if (!this.options.data) {
                this.options.data = {};
            }
            this.options.data["icon"] = "A";            
        },
        
        /**
         * @Override
         */
        onClick: function(e) {
        },
		
		/**
		 * @Override
		 */
		postRender: function () {
			this.base();
			this.inputElement.addClass("alpaca-form-button-alpaca");
		},
		
		/**
         * @Override
		 */
		getTitle: function() {
			return "Alpaca Button";
		},
		
		/**
         * @Override
		 */
		getDescription: function() {
			return "Button with Alpaca style.";
		}
		
    });
    
    Alpaca.registerFieldClass("alpacabutton", Alpaca.Fields.AlpacaButtonField);
    
})(jQuery);
