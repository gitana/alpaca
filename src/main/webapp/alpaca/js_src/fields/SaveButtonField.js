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
				this.data = this.view.getMessage("save");
			}
		},
        
        /**
         * @Override
         */
        onClick: function(e) {
			var control = this.form.topControl;
            var newValue = control.getValue();
            if (Alpaca.isEmpty(control.data)) {
                control.data = {};
            }
            Alpaca.mergeWithNullChecking(control.data,newValue);
            // if we have a template to load, load it and then render
            control.connector.saveData({
                "data":control.data,
                "schema":control.schema
            }, function(updatedData) {
               //TODO: add something nice here
                Alpaca.merge(control.data,updatedData);
                alert("Data Saved!");
            }, function(error) {
                alert(error);
            });
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
