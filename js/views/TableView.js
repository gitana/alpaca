(function($) {

    var Alpaca = $.alpaca;

    Alpaca.registerView({
        "id": "VIEW_WEB_EDIT_TABLE",
        "parent": 'VIEW_WEB_EDIT',
        "title": "Web Edit View Table Style",
        "description": "Web edit view based on table styles.",
        "type": "edit",
        "displayReadonly": true,
        "collapsible": false,
        "legendStyle": "link",
        "templates": {

            // Templates for control fields
            "controlFieldOuterEl": '<tr style="background-color:yellow; padding: 10px;">{{html this.html}}</tr>',
            "controlFieldLabel": '<td>{{if options.label}}<label style="background-color:blue; padding:10px" for="${id}" class="{{if options.labelClass}}${options.labelClass}{{/if}}">${options.label}</label>{{/if}}</td>',
            "controlFieldContainer": '<td style="background-color:green; padding: 10px;">{{html this.html}}</td>',
            "controlFieldMessage": '<div><span class="ui-icon ui-icon-alert"></span><span class="alpaca-controlfield-message-text">${message}</span></div>',
            "controlFieldHelper": '{{if options.helper}}<div style="background-color:pink; padding:10px"  class="{{if options.helperClass}}${options.helperClass}{{/if}}"><span class="ui-icon ui-icon-info"></span><span class="alpaca-controlfield-helper-text">${options.helper}</span></div>{{/if}}',
            "controlField":
                '{{wrap(null, {}) Alpaca.fieldTemplate(this,"controlFieldOuterEl",true)}}' +
                    '{{html Alpaca.fieldTemplate(this,"controlFieldLabel")}}' +
                    '{{wrap(null, {}) Alpaca.fieldTemplate(this,"controlFieldContainer",true)}}' +
                        '{{html Alpaca.fieldTemplate(this,"controlFieldHelper")}}' +
                    '{{/wrap}}' +
                '{{/wrap}}',

            // Templates for container fields
            "fieldSetOuterEl": '<fieldset class="alpaca-view-web-edit-table">{{html this.html}}</fieldset>',
            "fieldSetMessage": '<div><span class="ui-icon ui-icon-alert alpaca-fieldset-message-table-view"></span><span>${message}</span></div>',
            "fieldSetLegend": '{{if options.label}}<legend class="{{if options.labelClass}}${options.labelClass}{{/if}}">${options.label}</legend>{{/if}}',
            "fieldSetHelper": '{{if options.helper}}<div class="{{if options.helperClass}}${options.helperClass}{{/if}}">${options.helper}</div>{{/if}}',
            "fieldSetItemsContainer": '<table><tbody>{{html this.html}}</tbody></table>',
            "fieldSet": '{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"fieldSetLegend")}}{{html Alpaca.fieldTemplate(this,"fieldSetHelper")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetItemsContainer",true)}}{{/wrap}}{{/wrap}}',
            "fieldSetItemContainer": '<tr></tr>',

            "itemLabel" : '{{if options.itemLabel}}<label for="${id}" class="alpaca-controlfield-label alpaca-controlfield-label-list-view"><span class="alpaca-controlfield-item-label-list-view">${options.itemLabel}{{if index}} <span class="alpaca-item-label-counter">${index}</span></span>{{/if}}</label>{{/if}}'
        },
        "styles": {
        },
        "fields": {
            "/": {
                "templates": {
                    // Templates for container fields
                    "fieldSetItemsContainer": '<table style="background-color:red; padding: 10px">{{html this.html}}</table>',
                    //"fieldSetItemContainer": '<tr class="alpaca-fieldset-itemcontainer-table-view-top"></tr>'
                    "fieldSetItemContainer": '<tr data-replace="true" style="background-color:orange; padding: 10px"></tr>'
                }
            }
        }

    });
})(jQuery);