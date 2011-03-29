(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Gitana Save Button class
     */
    Alpaca.Fields.SaveButtonField = Alpaca.Fields.ButtonField.extend({
    
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
			var newValue = this.form.topControl.getValue();
			alert(newValue);
		},
		
		/**
		 * @Override
		 */
		postRender: function () {
			this.base();
			this.field.addClass("alpaca-form-button-save");
			this.field.button({
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
			return "Save Button";
		},
		
		/**
         * @Override
		 */
		getDescription: function() {
			return "Button for storing data.";
		}
    });

    // Registers additonal messages
    Alpaca.registerMessages({
        "save": "Save"
    });
	    
    Alpaca.registerFieldClass("savebutton", Alpaca.Fields.SaveButtonField);
    
})(jQuery);
