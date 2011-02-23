(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Gitana Save Button class
     */
    Alpaca.Fields.GitanaSaveButtonField = Alpaca.Fields.GitanaButtonField.extend({
    
        /**
         * @Override
         *
         * Sets up any default values for this field.
         */
        setup: function() {
			this.base();
			this.buttonType = "button";
			
			if (!this.data) {
				this.data = Alpaca.getMessage("save", this);;
			}
		},
        
        /**
         * @Override
         */
        onClick: function(e) {
			var newValue = this.form.topField.getValue();
			alert(newValue);
		},
		
		/**
		 * @Override
		 */
		postRender: function () {
			this.base();
			this.inputElement.addClass("alpaca-form-button-gitana-save");
			this.inputElement.button({
				text: true,
				icons: {
					primary: "ui-icon-disk"
				}
			});
		},
		
		/**
         * @Override
		 */
		getTitle: function() {
			return "Gitana Save Button";
		},
		
		/**
         * @Override
		 */
		getDescription: function() {
			return "Button for storing data to Gitana Repository";
		}
    });

    // Registers additonal messages
    Alpaca.registerMessages({
        "save": "Save"
    });
	    
    Alpaca.registerFieldClass("gitanasavebutton", Alpaca.Fields.GitanaSaveButtonField);
    
})(jQuery);
