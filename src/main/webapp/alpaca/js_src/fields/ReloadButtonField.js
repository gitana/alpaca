(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Abstract Button class
     */
    Alpaca.Fields.ReloadButtonField = Alpaca.Fields.ButtonField.extend({
    
        /**
         * @Override
         *
         * Sets up any default values for this field.
         */
        setup: function() {
			this.base();			
			// sets defaults
			if (!this.data) {
				this.data = this.view.getMessage("reload");
			}			
		},
        
        /**
         * @Override
         */
        onClick: function(e) {
			this.form.topControl.reload();
		},
		
		/**
		 * @Override
		 */
		postRender: function () {
			this.base();
			this.field.addClass("alpaca-form-button-reload");
			this.field.button({
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
	    
    Alpaca.registerFieldClass("reloadbutton", Alpaca.Fields.ReloadButtonField);
    
})(jQuery);
