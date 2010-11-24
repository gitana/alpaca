(function($) {

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
			id:"WEB_EDIT",
    		description:"Default web edit view",
			type:"edit",
    		templates: {
				// Templates for control fields
				fieldOuterEl: '<span>{{html this.html}}</span>',
				controlFieldMessage: '<div>* ${message}</div>',
				controlFieldLabel: '{{if settings.label}}<div class="{{if settings.labelClass}}${settings.labelClass}{{/if}}"><div>${settings.label}</div></div>{{/if}}',
				controlFieldHelper: '{{if settings.helper}}<div class="{{if settings.helperClass}}${settings.helperClass}{{/if}}">${settings.helper}</div>{{/if}}',
				controlFieldContainer: '<div>{{html this.html}}</div>',
				field: '{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"controlFieldLabel")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"controlFieldContainer",true)}}{{html Alpaca.fieldTemplate(this,"controlFieldHelper")}}{{/wrap}}{{/wrap}}',
				// Templates for container fields
				fieldSetOuterEl: '<fieldset>{{html this.html}}</fieldset>',
				fieldSetMessage: '<div>* ${message}</div>',
				fieldSetLegend: '{{if settings.label}}<legend class="{{if settings.labelClass}}${settings.labelClass}{{/if}}">${settings.label}</legend>{{/if}}',
				fieldSetHelper: '{{if settings.helper}}<div class="{{if settings.helperClass}}${settings.helperClass}{{/if}}">${settings.helper}</div>{{/if}}',
				itemsContainer: '<div>{{html this.html}}</div>',
				fieldSet: '{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"fieldSetLegend")}}{{html Alpaca.fieldTemplate(this,"fieldSetHelper")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"itemsContainer",true)}}{{/wrap}}{{/wrap}}',
				itemContainer: '<div></div>',
				// Templates for form
				formFieldsContainer: '<div>{{html this.html}}</div>',
				formButtonsContainer: '<div>{{html this.html}}</div>',
				form: '<form>{{html Alpaca.fieldTemplate(this,"formFieldsContainer")}}{{html Alpaca.fieldTemplate(this,"formButtonsContainer")}}</form>'
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
		
	Alpaca.registerView ({
			id: "WEB_DISPLAY",
			//parent: 'WEB_EDIT',
			description: "default web display view",
			type: "view",
			templates: {
				field: '<div class="alpaca-data-container">{{if settings.label}}<div class="alpaca-data-label">${settings.label}</div>{{/if}}<div class="alpaca-data">${data}</div></div>',
				fieldSetOuterEl: '<div>{{html this.html}}</div>',
				fieldSetLegend: '{{if settings.label}}<div class="{{if settings.labelClass}}${settings.labelClass}{{/if}}">${settings.label}</div>{{/if}}',
				itemsContainer: '<div>{{html this.html}}</div>',
				fieldSet: '{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"fieldSetLegend")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"itemsContainer",true)}}{{/wrap}}{{/wrap}}'
			}
		});
		
	Alpaca.registerView ({
			id: "WEB_CREATE",
			parent: 'WEB_EDIT',
			description: "Default web create view",
			type: "create",
			templates: {
			}
		});		
})(jQuery);