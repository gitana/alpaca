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
            if (! this.data) {
				this.data = "Save";
			}           
            this.buttonType = "button";
        },
        
        /**
         * @Override
         */
        onClick: function(e) {
            var newValue = this.form.topField.getValueWithPropertyId();
            alert(newValue);
        }
    });
    
    Alpaca.registerFieldClass("gitanabutton", Alpaca.Fields.GitanaButtonField);
    
})(jQuery);
