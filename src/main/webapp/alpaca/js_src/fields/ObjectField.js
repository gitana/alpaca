(function($) {
	
	var Alpaca = $.alpaca;	

	/**
	 * Default control for the treatment of a JSON object.
	 */
	Alpaca.Fields.ObjectField = Alpaca.ContainerField.extend({ 
		
    	/**
    	 * @Override
    	 * 
    	 * Pick apart the data object and set onto child fields.
    	 * 
    	 * Data must be an object.
    	 */
    	setValue: function(data, stopUpdateTrigger)
    	{
    		if (!data || !Alpaca.isObject(data))
    		{
    			return;
    		}
    		
    		// clear all controls
    		Alpaca.each(this.children, function() {
    			this.clear();
    		});
    		
    		// set fields
    		for (var fieldId in this.childrenById)
    		{
    			var _data = Alpaca.traverseObject(data, fieldId);
    			if (_data)
    			{
    				var childField = this.childrenById[fieldId];
    				childField.setValue(_data);
    			}
    		}
    	},
    	
    	/**
    	 * @Override
    	 * 
    	 * Reconstruct the data object from the child fields.
    	 */
    	getValue: function()
    	{
    		var o = {};
    		
			for (var i = 0; i < this.children.length; i++)
			{
				var fieldId = this.children[i].getId();
				
				var fieldValue = this.children[i].getValue();
				o[fieldId] = fieldValue;
			}
    		
    		return o;
    	}
	});
	
	Alpaca.registerFieldClass("object", Alpaca.Fields.ObjectField);

})(jQuery);