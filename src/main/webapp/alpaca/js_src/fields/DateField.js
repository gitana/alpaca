(function($) {
	
	var Alpaca = $.alpaca;	

	/**
	 * Date field
	 */
	Alpaca.Fields.DateField = Alpaca.Fields.TextField.extend({

		setup: function()
		{
			this.base();
			
			// override
			if (!this.settings.messages.invalid)
			{
				this.settings.messages.invalid = "Invalid date, ex: 07/04/1776";
			}
			
			if (!this.settings.dateFormat)
			{
				this.settings.dateFormat = Alpaca.defaultDateFormat;
			}			
    	},
    	
    	/**
    	 * Renders an INPUT control into the field container
    	 */
    	renderField: function(onSuccess)
    	{
    		this.base();
    		
    		// apply additional css
    		$(this.fieldContainer).addClass("alpaca-datefield");
    		
    		if (onSuccess)
    		{
    			onSuccess();
    		}
    	},    	
    	
    	handleValidate: function()
    	{
    		var value = $(this.inputElement).val();
    		
    		var separator = this.settings.dateFormat.match(/[^Ymd ]/g)[0];
    		
    		var ladate = value.split(separator);
    		if( ladate.length != 3) 
    		{ 
    			return false; 
    		}

    		if ( isNaN(parseInt(ladate[0],10)) || isNaN(parseInt(ladate[1],10)) || isNaN(parseInt(ladate[2],10))) 
    		{ 
    			return false; 
    		}

    		var formatSplit = this.settings.dateFormat.split(separator);

    		var yearIndex = Alpaca.indexOf("Y", formatSplit);
    		if (ladate[yearIndex].length != 4) 
    		{ 
    			return false; 
    		} // Avoid 3-digits years...
    		
    		var d = parseInt(ladate[ Alpaca.indexOf('d',formatSplit) ],10);
    		var Y = parseInt(ladate[yearIndex],10);
    		var m = parseInt(ladate[ Alpaca.indexOf('m',formatSplit) ],10)-1;
    		var unedate = new Date(Y,m,d);
    		var annee = unedate.getFullYear();
    		
    		return ((unedate.getDate() == d) && (unedate.getMonth() == m) && (annee == Y));
    	},
    	
    	setValue: function(val, stopUpdateTrigger)
    	{
    		// skip out if no date
    		if (val == "")
    		{
    			this.base(val, stopUpdateTrigger);
    			return;
    		}
    		
    		var str = "";
    		if (val instanceof Date)
    		{
    			str = Alpaca.Fields.DateField.formatDate(val, this.form.dateFormat);
    		}
    		else
    		{
    			if (this.settings.valueFormat)
    			{
    				var dateVal = Alpaca.Fields.DateField.parseWithFormat(val, this.settings.valueFormat);
    				str = Alpaca.Fields.DateField.formatDate(dateVal, this.settings.valueFormat);
    			}
    			else
    			{
    				str = val;
    			}
    		}
    			
    		this.base(str, stopUpdateTrigger);
    	}
    	
	});
	
	Alpaca.Fields.DateField.parseWithFormat = function(sDate, format)
	{
		var separator = format.match(/[^Ymd ]/g)[0];
		var ladate = sDate.split(separator);
		var formatSplit = format.split(separator);
		var d = parseInt(ladate[ Alpaca.indexOf('d',formatSplit) ],10);
		var Y = parseInt(ladate[ Alpaca.indexOf('Y',formatSplit) ],10);
		var m = parseInt(ladate[ Alpaca.indexOf('m',formatSplit) ],10)-1;
		return (new Date(Y,m,d));
	};
	
	Alpaca.Fields.DateField.formatDate = function(d, format)
	{
		var str = format.replace('Y',d.getFullYear());
		var m = d.getMonth()+1;
		str = str.replace('m', ((m < 10)? '0':'')+m);
		var day = d.getDate();
		str = str.replace('d', ((day < 10)? '0':'')+day);
		return str;
	};
	
	Alpaca.registerFieldClass("date", Alpaca.Fields.DateField);

})(jQuery);
