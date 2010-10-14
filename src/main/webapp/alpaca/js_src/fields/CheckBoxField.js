(function($) {
	
	var Alpaca = $.alpaca;	

	/**
	 * Check box field control
	 * 
	 * The following additional settings are permitted:
	 * 
	 * {
	 *    rightLabel: <string>                          text to show to the right of the checkbox
	 *    formName: <string>                            http post form name
	 * }
	 */	
	Alpaca.Fields.CheckBoxField = Alpaca.ControlField.extend({
		
		setup: function()
		{
			this.base();
			
			if (!this.settings.rightLabel)
			{
				this.settings.rightLabel = "";
			}
			
			// We force the optional schema setting since booleans either exist or they don't and both are valid values
			this.schema.optional = true;
			
			// TODO
			this.uncheckedValue = "";
			this.checkedValue = "checked";
		},
		
		renderField: function(onSuccess)
		{
			$(this.fieldContainer).addClass("gitana-checkboxfield");
			
			var checkBoxId = $(this.getEl()).attr("id") + "-field";
			
    		// input field
    		this.inputElement = $("<input/>");
    		this.inputElement.attr({"type": "checkbox"});
    		this.inputElement.attr({"id": checkBoxId});
    		this.inputElement.appendTo(this.fieldContainer);
    		
    		// right label
    		this.rightLabelEl = $("<label></label>");
    		this.rightLabelEl.attr({"for": checkBoxId});
    		this.rightLabelEl.addClass("alpaca-checkboxfield-rightLabel");    		
    		this.rightLabelEl.appendTo(this.fieldContainer);
    		
    		// set value for right label
    		if (this.settings.rightLabel)
    		{
    			this.rightLabelEl.html(this.settings.rightLabel);
    		}
    		else if (this.settings.fieldId)
    		{
    			this.rightLabelEl.html(this.settings.fieldId);
    		}
    		else if (this.settings.postName)
    		{
    			this.rightLabelEl.html(this.settings.postName);
    		}
    		
    		// create hidden input element to store value of checkbox
    		this.hiddenElement = $("<input></input>");
    		this.hiddenElement.attr({"type":"hidden"});
    		if (this.settings.formName)
    		{
    			this.hiddenElement.attr({"name": this.settings.formName});
    		}
    		this.hiddenElement.val(this.uncheckedValue);
    		this.hiddenElement.appendTo(this.fieldContainer);
    		
    		if (onSuccess)
    		{
    			onSuccess();
    		}
		},
		
		initEvents: function()
		{
			var _this = this;
			
			$(this.inputElement).focus(function(e){
				_this.onFocus(e);
			});
			$(this.inputElement).blur(function(e){
				_this.onBlur(e);
			});
			$(this.inputElement).change(function(e){
				_this.onChange(e);
			});
		},
		
		getValue: function()
		{
			return $(this.inputElement).attr("checked") ? this.checkedValue : this.uncheckedValue;
		},
		
		setValue: function(value, sendUpdatedEvt)
		{
			var toCheck = false;
			
			if (value == this.checkedValue)
			{
				toCheck = true;
			}
			
			if (Alpaca.isBoolean(value) && value)
			{
				toCheck = true;
			}
			
			if (toCheck)
			{
				this.inputElement.attr({"checked": true});
				this.hiddenElement.val(this.checkedValue);
			}
			else
			{
				this.inputElement.attr({"checked": false});
				this.hiddenElement.val(this.uncheckedValue);
			}
		},
		
		disable: function()
		{
			this.inputElement.disabled = true;
		},
		
		enable: function()
		{
			this.inputElement.disabled = false;
		}
		
	});

	Alpaca.registerFieldClass("checkbox", Alpaca.Fields.CheckBoxField);
	
})(jQuery);