(function($) {

	var Alpaca = $.alpaca;

	Alpaca.registerView ('DEFAULT', 
		{
    		description:"default view",
    		templates: 
			{
				edit:
				{
					fieldOuterEl:'<span>{{html this.html}}</span>',
					controlFieldMessage:'<div>* ${message}</div>',
					controlFieldLabel:'{{if settings.label}}<div class="{{if settings.labelClass}}${settings.labelClass}{{/if}}"><div>${settings.label}</div></div>{{/if}}',
					controlFieldHelper:'{{if settings.helper}}<div class="{{if settings.helperClass}}${settings.helperClass}{{/if}}">${settings.helper}</div>{{/if}}',
    				controlFieldContainer:'<div>{{html this.html}}</div>',
					field:'{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"controlFieldLabel")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"controlFieldContainer",true)}}{{html Alpaca.fieldTemplate(this,"controlFieldHelper")}}{{/wrap}}{{/wrap}}',					
					fieldSet:'<fieldset>{{if settings.label}}<legend>${settings.label}</legend>{{/if}}</fieldset>',
					itemContainer:'<div></div>'
				},
				view:
				{
					field:'${data}'
				}
			},
    	    messages: 
    	    {
    	    	empty: "",
    	    	required: "This field is required",
    	    	valid: "",
    	    	invalid: "This field is invalid",
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    			timeUnits: { SECOND: "seconds", MINUTE: "minutes", HOUR: "hours", DAY: "days", MONTH: "months", YEAR: "years" }    		
    	    }
    	});
})(jQuery);