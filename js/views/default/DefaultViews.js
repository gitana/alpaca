(function($) {

    var Alpaca = $.alpaca;

    Alpaca.styleInjections = {};

    Alpaca.registerView({
        "id": "VIEW_WEB_DISPLAY",
        "parent": "VIEW_BASE",
        "title": "Default Web Display View",
        "description":"Default web edit view which goes though field hierarchy.",
        "type": "view",
        "platform":"web",
        "displayReadonly":true,
        "templates": {
            "controlField": '<div class="alpaca-data-container">{{if options.label}}<div class="alpaca-data-label">${options.label}</div>{{/if}}<div class="alpaca-data">&nbsp;${data}</div></div>',
            "fieldSetOuterEl": '<div class="ui-widget ui-widget-content">{{html this.html}}</div>',
            "fieldSetLegend": '{{if options.label}}<div class="{{if options.labelClass}}${options.labelClass}{{/if}}">${options.label}</div>{{/if}}',
            "fieldSetItemsContainer": '<div>{{html this.html}}</div>',
            "fieldSet": '{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"fieldSetLegend")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetItemsContainer",true)}}{{/wrap}}{{/wrap}}',

            "controlFieldContainer": '<div>{{html this.html}}</div>',

            "arrayToolbar": '',
            "arrayItemToolbar": ''
}
    });

    Alpaca.registerView({
        "id":"VIEW_WEB_EDIT",
        "parent": "VIEW_BASE",
        "title":"Default Web Edit View",
        "description":"Default web edit view which goes though field hierarchy.",
        "type":"edit",
        "platform": "web",
        "displayReadonly":true,
        "templates": {
            // Templates for control fields
            "controlFieldOuterEl": '<span>{{html this.html}}</span>',
            "controlFieldMessage": '<div><span class="ui-icon ui-icon-alert"></span><span class="alpaca-controlfield-message-text">${message}</span></div>',
            "controlFieldLabel": '{{if options.label}}<div class="{{if options.labelClass}}${options.labelClass}{{/if}}"><div>${options.label}</div></div>{{/if}}',
            "controlFieldHelper": '{{if options.helper}}<div class="{{if options.helperClass}}${options.helperClass}{{/if}}"><span class="ui-icon ui-icon-info"></span><span class="alpaca-controlfield-helper-text">${options.helper}</span></div>{{/if}}',
            "controlFieldContainer": '<div>{{html this.html}}</div>',
            "controlField": '{{wrap(null, {}) Alpaca.fieldTemplate(this,"controlFieldOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"controlFieldLabel")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"controlFieldContainer",true)}}{{html Alpaca.fieldTemplate(this,"controlFieldHelper")}}{{/wrap}}{{/wrap}}',
            // Templates for container fields
            "fieldSetOuterEl": '<fieldset>{{html this.html}}</fieldset>',
            "fieldSetMessage": '<div><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span><span>${message}</span></div>',
            "fieldSetLegend": '{{if options.label}}<legend class="{{if options.labelClass}}${options.labelClass}{{/if}}">${options.label}</legend>{{/if}}',
            "fieldSetHelper": '{{if options.helper}}<div class="{{if options.helperClass}}${options.helperClass}{{/if}}">${options.helper}</div>{{/if}}',
            "fieldSetItemsContainer": '<div>{{html this.html}}</div>',
            "fieldSet": '{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"fieldSetLegend")}}{{html Alpaca.fieldTemplate(this,"fieldSetHelper")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetItemsContainer",true)}}{{/wrap}}{{/wrap}}',
            "fieldSetItemContainer": '<div></div>',
            // Templates for form
            "formFieldsContainer": '<div>{{html this.html}}</div>',
            "formButtonsContainer": '<div>{{if options.buttons}}{{each(k,v) options.buttons}}<button data-key="${k}" class="alpaca-form-button alpaca-form-button-${k}" {{each(k1,v1) v}}${k1}="${v1}"{{/each}}>${v.value}</button>{{/each}}{{/if}}</div>',
            "form": '<form>{{html Alpaca.fieldTemplate(this,"formFieldsContainer")}}{{html Alpaca.fieldTemplate(this,"formButtonsContainer")}}</form>',
            // Templates for wizard
            "wizardStep" : '<div class="alpaca-clear"></div>',
            "wizardNavBar" : '<div></div>',
            "wizardPreButton" : '<button>Back</button>',
            "wizardNextButton" : '<button>Next</button>',
            "wizardDoneButton" : '<button>Done</button>',
            "wizardStatusBar" : '<ol id="${id}">{{each(i,v) titles}}<li id="stepDesc${i}"><div><strong><span>${v.title}</span>${v.description}</strong></div></li>{{/each}}</ol>'
        }
    });

    Alpaca.registerView({
        "id": "VIEW_WEB_CREATE",
        "parent": 'VIEW_WEB_EDIT',
        "title": "Default Web Create View",
        "description":"Default web create view which doesn't bind initial data.",
        "type": "create",
        "displayReadonly":false
    });

})(jQuery);