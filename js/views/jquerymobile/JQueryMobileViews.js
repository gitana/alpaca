/**
 * jQuery Mobile Theme ("mobile")
 *
 * Defines the Alpaca theme for jQuery Mobile.
 *
 * The style injector:
 *
 *    mobile
 *
 * The views are:
 *
 *    VIEW_MOBILE_DISPLAY
 *    VIEW_MOBILE_EDIT
 *    VIEW_MOBILE_CREATE
 *
 * This theme can also be selected by specifying the following view:
 *
 *    {
 *       "ui": "mobile",
 *       "type": null | "create" | "edit" | "display"
 *    }
 *
 */(function($) {

    var Alpaca = $.alpaca;

    Alpaca.styleInjections["jquery-mobile"] = {
        "array" : function(containerElem) {
            if (containerElem) {
                if (containerElem.find('[data-role="fieldcontain"]').fieldcontain) {
                    containerElem.find('[data-role="fieldcontain"]').fieldcontain();
                    containerElem.find('[data-role="fieldcontain"]').find("[type='radio'], [type='checkbox']").checkboxradio();
                    containerElem.find('[data-role="fieldcontain"]').find("button, [data-role='button'], [type='button'], [type='submit'], [type='reset'], [type='image']").not(".ui-nojs").button();
                    containerElem.find('[data-role="fieldcontain"]').find("input, textarea").not("[type='radio'], [type='checkbox'], button, [type='button'], [type='submit'], [type='reset'], [type='image']").textinput();
                    containerElem.find('[data-role="fieldcontain"]').find("input, select").filter("[data-role='slider'], [data-type='range']").slider();
                    containerElem.find('[data-role="fieldcontain"]').find("select:not([data-role='slider'])").selectmenu();
                    containerElem.find('[data-role="button"]').buttonMarkup();
                    containerElem.find('[data-role="controlgroup"]').controlgroup();
                }

            }
        }
    };

    Alpaca.registerView({
        "id": "VIEW_MOBILE_DISPLAY",
        "parent": "VIEW_WEB_DISPLAY",
        "title": "Mobile DISPLAY View",
        "description": "Mobile display view using JQuery Mobile Library",
        "type": "view",
        "platform":"mobile",
        "style":"jquery-mobile",
        "ui":"mobile",
        "legendStyle": "link",
        "toolbarStyle": "link",
        "buttonType": "link",
        "templates": {
            // Templates for control fields
            controlField: '<ul data-role="listview"><li>{{if options.label}}<h4>${options.label}</h4>{{/if}}<p><strong>${data}</strong></p></li></ul>',
            // Templates for container fields
            fieldSetOuterEl: '<fieldset data-role="collapsible" id="${id}" data-collapsed="{{if options.collapsed}}true{{else}}false{{/if}}">{{html this.html}}</fieldset>',
            fieldSetMessage: '<div>* ${message}</div>',
            fieldSetLegend: '{{if options.label}}<legend for="${id}" class="{{if options.labelClass}}${options.labelClass}{{/if}}">${options.label}</legend>{{/if}}',
            fieldSetHelper: '{{if options.helper}}<h3 class="{{if options.helperClass}}${options.helperClass}{{/if}}">${options.helper}</h3>{{/if}}',
            fieldSetItemsContainer: '<div data-role="controlgroup">{{html this.html}}</div>',
            fieldSet: '{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"fieldSetLegend")}}{{html Alpaca.fieldTemplate(this,"fieldSetHelper")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetItemsContainer",true)}}{{/wrap}}{{/wrap}}',
            fieldSetItemContainer: '<div></div>'
        },
        "messages": {
            required: "Required Field",
            invalid: "Invalid Field"
        },
        "render": function(field, renderedCallback) {

            var self = this;

            field.render(field.view, function(field) {

                refreshPageForField(field.getEl());

                if (renderedCallback) {
                    renderedCallback.call(self, field);
                }
            });

        }
    });

    Alpaca.registerView({
        "id": "VIEW_MOBILE_EDIT",
        "parent": "VIEW_WEB_EDIT",
        "title": "Mobile Edit View",
        "description": "Mobile edit view using JQuery Mobile Library",
        "type": "edit",
        "platform":"mobile",
        "style":"jquery-mobile",
        "ui":"mobile",
        "legendStyle": "link",
        "toolbarStyle": "link",
        "buttonType": "link",
        "toolbarSticky": true,
        "templates": {
            // Templates for control fields
            controlFieldOuterEl: '<div data-role="fieldcontain">{{html this.html}}</div>',
            controlFieldMessage: '<div>* ${message}</div>',
            controlFieldLabel: '{{if options.label}}<label for="${id}" class="{{if options.labelClass}}${options.labelClass}{{/if}}">${options.label}</label>{{/if}}',
            controlFieldHelper: '{{if options.helper}}<div class="{{if options.helperClass}}${options.helperClass}{{/if}}">${options.helper}</div>{{/if}}',
            controlFieldContainer: '<div data-replace="true">{{html this.html}}</div>',
            controlField: '{{wrap(null, {}) Alpaca.fieldTemplate(this,"controlFieldOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"controlFieldLabel")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"controlFieldContainer",true)}}{{/wrap}}{{html Alpaca.fieldTemplate(this,"controlFieldHelper")}}{{/wrap}}',
            // Templates for container fields
            fieldSetOuterEl: '<fieldset id="${id}" data-collapsed="{{if options.collapsed}}true{{else}}false{{/if}}">{{html this.html}}</fieldset>',
            fieldSetMessage: '<div>* ${message}</div>',
            fieldSetLegend: '{{if options.label}}<legend for="${id}" class="{{if options.labelClass}}${options.labelClass}{{/if}}">${options.label}</legend>{{/if}}',
            fieldSetHelper: '{{if options.helper}}<h3 class="{{if options.helperClass}}${options.helperClass}{{/if}}">${options.helper}</h3>{{/if}}',
            fieldSetItemsContainer: '<div data-role="controlgroup">{{html this.html}}</div>',
            fieldSet: '{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"fieldSetLegend")}}{{html Alpaca.fieldTemplate(this,"fieldSetHelper")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetItemsContainer",true)}}{{/wrap}}{{/wrap}}',
            fieldSetItemContainer: '<div></div>',
            // Templates for form
            formFieldsContainer: '<div data-role="content">{{html this.html}}</div>',
            //formButtonsContainer: '<fieldset class="ui-grid-a">{{html this.html}}</fieldset>',
            //"formButtonsContainer": '<div>{{if options.buttons}}{{each(k,v) options.buttons}}<input data-key="${k}" class="alpaca-form-button alpaca-form-button-${k}" {{each(k1,v1) v}}${k1}="${v1}"{{/each}}/>{{/each}}{{/if}}</div>',
            form: '<form>{{html Alpaca.fieldTemplate(this,"formFieldsContainer")}}{{html Alpaca.fieldTemplate(this,"formButtonsContainer")}}</form>',
            // Controls
            //controlFieldRadio: '<fieldset data-role="controlgroup" id="${id}">{{if options.label}}<legend for="${id}" class="{{if options.labelClass}}${options.labelClass}{{/if}}">${options.label}</legend>{{/if}}{{each selectOptions}}<input type="radio" {{if options.readonly}}readonly="readonly"{{/if}} name="${formName}" id="${id}-${$index}" value="${value}" {{if value == data}}checked="checked"{{/if}}/><label for="${id}-${$index}">${text}</label>{{/each}}</fieldset>',
            controlFieldRadio: '<fieldset data-role="controlgroup" class="alpaca-radio-fieldset" id="${id}">{{each selectOptions}}<input type="radio" {{if options.readonly}}readonly="readonly"{{/if}} name="${name}" id="${id}-${$index}" value="${value}" {{if value == data}}checked="checked"{{/if}}/><label for="${id}-${$index}">${text}</label>{{/each}}</fieldset>',
            controlFieldCheckbox: '<fieldset data-role="controlgroup" class="alpaca-radio-fieldset" id="${id}-0"><input type="checkbox" id="${id}-1" name="${id}-1" {{if options.readonly}}readonly="readonly"{{/if}} {{if name}}name="${name}"{{/if}} {{each options.data}}data-${fieldId}="${value}"{{/each}}/>{{if options.rightLabel}}<label for="${id}-1">${options.rightLabel}</label>{{else}}{{if options.label}}<label for="${id}-1">${options.label}?</label>{{/if}}{{/if}}</fieldset>',
            arrayItemToolbar: '<div class="alpaca-fieldset-array-item-toolbar" data-role="controlgroup" data-type="horizontal" data-mini="true"><span class="alpaca-fieldset-array-item-toolbar-add" data-role="button" data-icon="add" data-iconpos="notext">Add</span><span class="alpaca-fieldset-array-item-toolbar-remove" data-role="button" data-icon="delete" data-iconpos="notext">Delete</span><span class="alpaca-fieldset-array-item-toolbar-up" data-role="button" data-icon="arrow-u" data-iconpos="notext">Up</span><span class="alpaca-fieldset-array-item-toolbar-down" data-role="button" data-icon="arrow-d" data-iconpos="notext">Down</span></div>',
            arrayToolbar: '<div class="alpaca-fieldset-array-toolbar" data-role="controlgroup"  data-mini="true"><span class="alpaca-fieldset-array-toolbar-icon alpaca-fieldset-array-toolbar-add" data-role="button" data-icon="add" data-inline="true" title="Add">Add</span></div>'
        },
        "messages": {
            required: "Required Field",
            invalid: "Invalid Field"
        },
        "render": function(field, renderedCallback) {

            var self = this;

            field.render(function(field) {

                refreshPageForField(field.getEl());

                if (renderedCallback) {
                    renderedCallback.call(self, field);
                }
            });

        }
    });

    var refreshPageForField = function(fieldEl)
    {
        // find the data-role="page" and refresh it
        var el = fieldEl;
        while (!Alpaca.isEmpty(el) && el.attr("data-role") !== "page")
        {
            el = el.parent();
        }
        if (!Alpaca.isEmpty(el)) {
            $(el).trigger('pagecreate');
        }
    };

    Alpaca.registerView({
        "id": "VIEW_MOBILE_CREATE",
        "parent": 'VIEW_MOBILE_EDIT',
        "title": "Default Mobile Create View",
        "description":"Default mobile create view which doesn't bind initial data.",
        "type": "create",
        "displayReadonly":false
    });

})(jQuery);