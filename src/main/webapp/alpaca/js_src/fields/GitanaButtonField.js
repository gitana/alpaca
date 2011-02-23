(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Abstract Button class
     */
    Alpaca.Fields.GitanaButtonField = Alpaca.Fields.ButtonField.extend({
    
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
            this.options.data["icon"] = "G";
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
			this.inputElement.addClass("alpaca-form-button-gitana");
		},
		
		/**
         * @Override
		 */
		getTitle: function() {
			return "Gitana Button";
		},
		
		/**
         * @Override
		 */
		getDescription: function() {
			return "Button with Gitana style";
		}    
    });
    
    Alpaca.registerFieldClass("gitanabutton", Alpaca.Fields.GitanaButtonField);
    
})(jQuery);
