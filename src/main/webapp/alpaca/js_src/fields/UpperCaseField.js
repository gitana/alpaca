(function($) {
	
	var Alpaca = $.alpaca;	

	/**
	 * Upper case field
	 */
	Alpaca.Fields.UpperCaseField = Alpaca.Fields.TextField.extend({
		
        /**
         * @Override
         */
        postRender: function() {
            this.base();
			if (this.fieldContainer) {
				this.fieldContainer.addClass('alpaca-controlfield-uppercase');
			}	
        },

		/**
		 * @Override
		 */
		setValue: function(val, stopUpdateTrigger) {
			var upperValue = val.toUpperCase();
			
			if (upperValue != this.getValue()) {
				this.base(upperValue, stopUpdateTrigger);
			}
		},
		
		/**
	 	 * @Override
	 	 */
		onKeyPress: function(e) {
			this.base(e);
			
			var _this = this;
			
			Alpaca.later(25, this, function() {
				var v = _this.getValue();
				_this.setValue(v, false);
			});
		},
		
		/**
         * @Override
		 */
		getTitle: function() {
			return "Uppercase Text";
		},
		
		/**
         * @Override
		 */
		getDescription: function() {
			return "Text Field for uppercase text.";
		},

		/**
         * @Override
         */
        getFieldType: function() {
            return "uppercase";
        }
		
	});
	
	Alpaca.registerFieldClass("uppercase", Alpaca.Fields.UpperCaseField);

})(jQuery);
