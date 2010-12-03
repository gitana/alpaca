(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Abstract Button class
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
            if (this.options && this.options.action) {
                this.action = this.options.action;
            }
            
            if (!this.settings.data) {
                this.settings.data = {};
            }
            this.settings.data["icon"] = "A";
            
            // sets defaults
            if (!this.action) {
                this.action = "print";
                if (!this.data) {
                    this.data = "Print";
                }
            } else if (this.action == "print") {
                if (!this.data) {
                    this.data = "Print";
                }
            } else if (this.action == "validate") {
                if (!this.data) {
                    this.data = "Validate";
                }
            } else if (this.action == "preview") {
                if (!this.data) {
                	if ( this.form.options.viewType == 'view' ) {
                		this.data = "Edit";
                	} else {
                		this.data = "Preview";                	
                	}
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
                case 'validate':
                    this.form.topField.renderValidationState();
                    break;
                case 'print':
					this.form.topField.print();
                    break;
                case 'preview':
                    this.form.topField.container = this.form.formFieldsContainer;
					if (this.form.topField.getView() == "WEB_EDIT") {
						this.form.viewType = 'view';
						this.form.topField.render('WEB_DISPLAY');
						this.inputElement.attr("value","Edit");
						this.inputElement.text("Edit");
					} else {
						this.form.viewType = 'edit';
						this.form.topField.initializing = true;
						this.form.topField.render('WEB_EDIT');						
						this.inputElement.attr("value","Preview");
						this.inputElement.text("Preview");
					}
                    break;
                case 'reload':
                    if (this.form.topField.options.form) {
                        delete this.form.topField.options.form;
                    }
                    this.form.topField.container = this.form.formFieldsContainer;
					this.form.topField.reload();
                    break;
                case 'create':
                    if (this.form.topField.options.form) {
                        delete this.form.topField.options.form;
                    }
                    this.form.topField.container = this.form.formFieldsContainer;
                    this.form.topField.render("WEB_CREATE");
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
			this.inputElement.addClass("alpaca-form-button-alpaca");
		}
    });
    
    Alpaca.registerFieldClass("alpacabutton", Alpaca.Fields.AlpacaButtonField);
    
})(jQuery);
