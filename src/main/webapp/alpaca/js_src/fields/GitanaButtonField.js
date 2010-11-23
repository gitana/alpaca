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
            
            if (!this.settings.data) {
                this.settings.data = {};
            }
            this.settings.data["icon"] = "G";
            
            // sets defaults
            if (!this.action) {
                this.action = "save";
                if (!this.data) {
                    this.data = "Save";
                }
            } else if (this.action == "reload") {
                if (!this.data) {
                    this.data = "Reload";
                }
            } else if (this.action == "create") {
                if (!this.data) {
                    this.data = "Create";
                }
            } else if (this.action == "validate") {
                if (!this.data) {
                    this.data = "Validate";
                }
            }
        },
        
        /**
         * @Override
         */
        onClick: function(e) {
            switch (this.action) {
                case 'save':
                    var newValue = this.form.topField.getValueWithPropertyId();
                    alert(newValue);
                    break;
                case 'reload':
                    if (this.form.topField.options.form) {
                        delete this.form.topField.options.form;
                    }
                    this.form.topField.container = this.form.formFieldsContainer;
					this.form.topField.render(this.mode);
                    break;
                case 'validate':
                    this.form.topField.renderValidationState();
                    break;
                case 'create':
                    if (this.form.topField.options.form) {
                        delete this.form.topField.options.form;
                    }
                    this.form.topField.container = this.form.formFieldsContainer;
                    this.form.topField.render('create');
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
