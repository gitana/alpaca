(function($) {
	
	var Alpaca = $.alpaca;	

	/**
	 * Default control for the treatment of a JSON array.
	 */
	Alpaca.Fields.ArrayField = Alpaca.ContainerField.extend({ 
		
    	/**
    	 * @Override
    	 * 
    	 * Pick apart the array and set onto child fields.
    	 * 
    	 * Data must be an array.
    	 */
    	setValue: function(data)
    	{
    		if (!data || !Alpaca.isArray(data))
    		{
    			return;
    		}
    		
    		// clear all controls
    		Alpaca.each(this.children, function() {
    			this.clear();
    		});
    		
    		// set fields
			for (var i = 0; i < this.children.length; i++)
			{
				var childField = this.children[i];
				if (data.length < i)
				{
					childField.setValue(data[fieldId]);
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
    		var o = [];
    		
			for (var i = 0; i < this.children.length; i++)
			{
				var v = this.children[i].getValue();
				o.push(v);
			}
    		
    		return o;
    	}
    	
	});
	
	Alpaca.registerFieldClass("array", Alpaca.Fields.ArrayField);

})(jQuery);