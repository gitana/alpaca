(function($) {

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
			"id":"WEB_EDIT",
    		"description":"Default Web Edit View",
			"type":"edit",
			"displayReadonly":true,
    		"templates": {
				// Templates for control fields
				fieldOuterEl: '<span>{{html this.html}}</span>',
				controlFieldMessage: '<div>* ${message}</div>',
				controlFieldLabel: '{{if options.label}}<div class="{{if options.labelClass}}${options.labelClass}{{/if}}"><div>${options.label}</div></div>{{/if}}',
				controlFieldHelper: '{{if options.helper}}<div class="{{if options.helperClass}}${options.helperClass}{{/if}}">${options.helper}</div>{{/if}}',
				controlFieldContainer: '<div>{{html this.html}}</div>',
				field: '{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"controlFieldLabel")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"controlFieldContainer",true)}}{{html Alpaca.fieldTemplate(this,"controlFieldHelper")}}{{/wrap}}{{/wrap}}',
				// Templates for container fields
				fieldSetOuterEl: '<fieldset>{{html this.html}}</fieldset>',
				fieldSetMessage: '<div>* ${message}</div>',
				fieldSetLegend: '{{if options.label}}<legend class="{{if options.labelClass}}${options.labelClass}{{/if}}">${options.label}</legend>{{/if}}',
				fieldSetHelper: '{{if options.helper}}<div class="{{if options.helperClass}}${options.helperClass}{{/if}}">${options.helper}</div>{{/if}}',
				itemsContainer: '<div>{{html this.html}}</div>',
				fieldSet: '{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"fieldSetLegend")}}{{html Alpaca.fieldTemplate(this,"fieldSetHelper")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"itemsContainer",true)}}{{/wrap}}{{/wrap}}',
				itemContainer: '<div></div>',
				// Templates for form
				formFieldsContainer: '<div>{{html this.html}}</div>',
				formButtonsContainer: '<div>{{html this.html}}</div>',
				form: '<form>{{html Alpaca.fieldTemplate(this,"formFieldsContainer")}}{{html Alpaca.fieldTemplate(this,"formButtonsContainer")}}</form>',
				// Templates for wizard
				wizardStep : '<div></div>',
				wizardNavBar : '<div></div>',
				wizardPreButton : '<div>\u25C0 Back</div>',
				wizardNextButton : '<div>Next \u25B6</div>',
				wizardStatusBar : '<ol id="${id}">{{each(i,v) titles}}<li id="stepDesc${i}"><div><strong><span>${v.title}</span>${v.description}</strong></div></li>{{/each}}</ol>'
			},
    	    "messages": 
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
			displayReadonly:true,
			templates: {
				field: '<div class="alpaca-data-container">{{if options.label}}<div class="alpaca-data-label">${options.label}</div>{{/if}}<div class="alpaca-data">&nbsp;${data}</div></div>',
				fieldSetOuterEl: '<div>{{html this.html}}</div>',
				fieldSetLegend: '{{if options.label}}<div class="{{if options.labelClass}}${options.labelClass}{{/if}}">${options.label}</div>{{/if}}',
				itemsContainer: '<div>{{html this.html}}</div>',
				fieldSet: '{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"fieldSetLegend")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"itemsContainer",true)}}{{/wrap}}{{/wrap}}'
			}
		});
		
	Alpaca.registerView ({
			id: "WEB_CREATE",
			parent: 'WEB_EDIT',
			description: "Default web create view",
			type: "create",
			displayReadonly:false,
			templates: {
			}
		});		
})(jQuery);