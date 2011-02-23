(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Abstract Button class
     */
    Alpaca.Fields.AlpacaReloadButtonField = Alpaca.Fields.AlpacaButtonField.extend({
    
        /**
         * @Override
         *
         * Sets up any default values for this field.
         */
        setup: function() {
			this.base();			
			// sets defaults
			if (!this.data) {
				this.data = Alpaca.getMessage("reload", this);
			}			
		},
        
        /**
         * @Override
         */
        onClick: function(e) {
			this.form.topField.reload();
		},
		
		/**
		 * @Override
		 */
		postRender: function () {
			this.base();
			this.inputElement.addClass("alpaca-form-button-alpaca-reload");
			this.inputElement.button({
				text: true,
				icons: {
					primary: "ui-icon-refresh"
				}
			});				
		},
		
		/**
         * @Override
		 */
		getTitle: function() {
			return "Alpaca Reload Button";
		},
		
		/**
         * @Override
		 */
		getDescription: function() {
			return "Alpaca button for reloading data.";
		}		
    });

    // Registers additonal messages
    Alpaca.registerMessages({
        "reload": "Reload"
    });
	    
    Alpaca.registerFieldClass("alpacareloadbutton", Alpaca.Fields.AlpacaReloadButtonField);
    
})(jQuery);
