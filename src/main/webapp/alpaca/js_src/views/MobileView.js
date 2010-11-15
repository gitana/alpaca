(function($) {

	var Alpaca = $.alpaca;

	Alpaca.registerView ('MOBILE', 
		{
    		parent: 'DEFAULT',
			description:"mobile view",
    		templates: 
			{
				edit:
				{
					fieldOuterEl:'<div data-role="fieldcontain">{{html this.html}}</div>',
					controlFieldMessage:'<div>* ${message}</div>',
					controlFieldLabel:'{{if settings.label}}<label {{if settings.formName}}for="${settings.formName}"{{/if}} class="{{if settings.labelClass}}${settings.labelClass}{{/if}}">${settings.label}</label>{{/if}}',
					controlFieldHelper:'{{if settings.helper}}<div class="{{if settings.helperClass}}${settings.helperClass}{{/if}}">${settings.helper}</div>{{/if}}',
    				controlFieldContainer:'<div data-replace="true">{{html this.html}}</div>',
					field:'{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"controlFieldLabel")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"controlFieldContainer",true)}}{{/wrap}}{{html Alpaca.fieldTemplate(this,"controlFieldHelper")}}{{/wrap}}'					
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