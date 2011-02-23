(function($) {

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "WEB_EDIT_LIST",
		parent: 'WEB_EDIT',
		"description": "Web Edit View List Style",
		"type": "edit",
		"displayReadonly": true,
		"collapsible": true,
		"legendStyle": "link",
		"templates": {
			// Templates for control fields
			controlFieldOuterEl: '<span>{{html this.html}}</span>',
			controlFieldMessage: '<div><span class="ui-icon ui-icon-alert"></span><span class="alpaca-controlfield-message-text">${message}</span></div>',
			controlFieldLabel: '{{if options.label}}<label for="${id}" class="{{if options.labelClass}}${options.labelClass}{{/if}}">${options.label}</label>{{/if}}',
			controlFieldHelper: '{{if options.helper}}<div class="{{if options.helperClass}}${options.helperClass}{{/if}}"><span class="ui-icon ui-icon-info"></span><span class="alpaca-controlfield-helper-text">${options.helper}</span></div>{{/if}}',
			controlFieldContainer: '<div>{{html this.html}}</div>',
			controlField: '{{wrap(null, {}) Alpaca.fieldTemplate(this,"controlFieldOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"controlFieldLabel")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"controlFieldContainer",true)}}{{html Alpaca.fieldTemplate(this,"controlFieldHelper")}}{{/wrap}}{{/wrap}}',
			// Templates for container fields
			fieldSetOuterEl: '<fieldset>{{html this.html}}</fieldset>',
			fieldSetMessage: '<div><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span><span>${message}</span></div>',
			fieldSetLegend: '{{if options.label}}<legend class="{{if options.labelClass}}${options.labelClass}{{/if}}" style="font-size:1.0em;">${options.label}</legend>{{/if}}',
			fieldSetHelper: '{{if options.helper}}<div class="{{if options.helperClass}}${options.helperClass}{{/if}}">${options.helper}</div>{{/if}}',
			fieldSetItemsContainer: '<ol>{{html this.html}}</ol>',
			fieldSet: '{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"fieldSetLegend")}}{{html Alpaca.fieldTemplate(this,"fieldSetHelper")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetItemsContainer",true)}}{{/wrap}}{{/wrap}}',
			fieldSetItemContainer: '<li style="list-style:none;"></li>',
			
			itemLabel : '{{if options.itemLabel}}<label for="${id}" class="alpaca-controlfield-label" style="width:100px;display:inline-block;vertical-align:top;padding-top:0.5em;"><span style="width:100px;display:inline-block;vertical-align:top;;padding-top:0.25em">${options.itemLabel}{{if index}} <span class="alpaca-item-label-counter">${index}</span></span>{{/if}}</label>{{/if}}'

		},
		"styles": {
			".alpaca-fieldset-legend": {
			},
			".alpaca-controlfield-label": {
				"width": "100px",
				"display": "inline-block",
				"vertical-align": "top",
				"padding-top": "0.5em"
			},
			"fieldset": {
				"border-left":"none",
				"border-bottom":"none",
				"border-right":"none",
				"padding-right":"3em"
			}
		},
		"fields": {
			"/": {
				"templates": {
					// Templates for container fields
					fieldSetOuterEl: '<fieldset style="border:none">{{html this.html}}</fieldset>',
					fieldSetMessage: '<div><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span><span>${message}</span></div>',
					fieldSetLegend: '{{if options.label}}<legend class="{{if options.labelClass}}${options.labelClass}{{/if}}" style="padding-top:2em;border:none;">${options.label}</legend>{{/if}}',
					fieldSetHelper: '{{if options.helper}}<div class="{{if options.helperClass}}${options.helperClass}{{/if}}">${options.helper}</div>{{/if}}',
					fieldSetItemsContainer: '<ol style="padding-left :0;">{{html this.html}}</ol>',
					fieldSet: '{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"fieldSetLegend")}}{{html Alpaca.fieldTemplate(this,"fieldSetHelper")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetItemsContainer",true)}}{{/wrap}}{{/wrap}}',
					fieldSetItemContainer: '<li style="list-style:none;"></li>'
				}
			}
		}
	});					
})(jQuery);