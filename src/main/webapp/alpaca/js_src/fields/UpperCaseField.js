(function($) {
	
	var Alpaca = $.alpaca;	

	/**
	 * Upper case field
	 */
	Alpaca.Fields.UpperCaseField = Alpaca.Fields.TextField.extend({
	
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
		}
		
	});
	
	Alpaca.registerFieldClass("uppercase", Alpaca.Fields.UpperCaseField);

})(jQuery);
