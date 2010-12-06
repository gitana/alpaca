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
            if (this.options && this.options.action) {
                this.action = this.options.action;
            }
            
            if (!this.options.data) {
                this.options.data = {};
            }
            this.options.data["icon"] = "G";
            
            // sets defaults
            if (!this.action) {
                this.action = "save";
                if (!this.data) {
                    this.data = "Save";
                }
            } 
        },
        
        /**
         * @Override
         */
        onClick: function(e) {
            switch (this.action) {
                case 'save':
                    var newValue = this.form.topField.getValue();
                    alert(newValue);
                    break;
               default:
                    break;
            }
        },
		
		/**
		 * @Override
		 */
		postRender: function () {
			this.base();
			this.inputElement.addClass("alpaca-form-button-gitana");
		}
    });
    
    Alpaca.registerFieldClass("gitanabutton", Alpaca.Fields.GitanaButtonField);
    
})(jQuery);
