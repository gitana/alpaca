(function($) {

    var Alpaca = $.alpaca;

    Alpaca.registerView({
        "id": "VIEW_WEB_EDIT_YAML",
        "parent": 'VIEW_WEB_EDIT',
        "title": "Web Edit View List Style",
        "description": "Web edit list styled to look like a YAML editor.",
        "type": "edit",
        "displayReadonly": true,
        "collapsible": true,
        "legendStyle": "link",
        "templates": {
            // Templates for control fields
            "controlFieldOuterEl": '<span class="alpaca-view-web-edit-yaml" title="${options.helper}">{{html this.html}}</span>',
            "controlFieldMessage": '<div><span class="ui-icon ui-icon-alert"></span><span class="alpaca-controlfield-message-text">${message}</span></div>',
            "controlFieldLabel": '{{if options.label}}<label for="${id}" class="{{if options.labelClass}}${options.labelClass}{{/if}}">${options.label}:</label>{{/if}}',
            "controlFieldHelper": '<span style="display:none" />',
            "controlFieldContainer": '<div>{{html this.html}}</div>',
            "controlField": '{{wrap(null, {}) Alpaca.fieldTemplate(this,"controlFieldOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"controlFieldLabel")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"controlFieldContainer",true)}}{{html Alpaca.fieldTemplate(this,"controlFieldHelper")}}{{/wrap}}{{/wrap}}',
            // Templates for container fields
            "fieldSetOuterEl": '<fieldset class="alpaca-view-web-edit-yaml">{{html this.html}}</fieldset>',
            "fieldSetMessage": '<div><span class="ui-icon ui-icon-alert alpaca-fieldset-message-list-view"></span><span>${message}</span></div>',
            "fieldSetLegend": '{{if options.label}}<legend class="{{if options.labelClass}}${options.labelClass}{{/if}}">${options.label}</legend>{{/if}}',
            "fieldSetHelper": '{{if options.helper}}<div class="{{if options.helperClass}}${options.helperClass}{{/if}}">${options.helper}</div>{{/if}}',
            "fieldSetItemsContainer": '<ol>{{html this.html}}</ol>',
            "fieldSet": '{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"fieldSetLegend")}}{{html Alpaca.fieldTemplate(this,"fieldSetHelper")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetItemsContainer",true)}}{{/wrap}}{{/wrap}}',
            "fieldSetItemContainer": '<li style="list-style:none;"></li>',

            "itemLabel" : '{{if options.itemLabel}}<label for="${id}" class="alpaca-controlfield-label alpaca-controlfield-label-list-view"><span class="alpaca-controlfield-item-label-list-view">${options.itemLabel}{{if index}} <span class="alpaca-item-label-counter">${index}</span></span>{{/if}}</label>{{/if}}'

        },
        "styles": {
        },
        "fields": {
            "/": {
                "templates": {
                    // Templates for container fields
                    "fieldSetItemsContainer": '<ol class="alpaca-fieldset-itemscontainer-list-view-top">{{html this.html}}</ol>',
                    "fieldSetItemContainer": '<li class="alpaca-fieldset-itemcontainer-list-view-top"></li>'
                }
            }
        }
    });
})(jQuery);
