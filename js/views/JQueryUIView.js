/**
 * jQuery UI Theme ("jquery-ui")
 *
 * Defines the Alpaca theme for jQuery UI.
 *
 * The style injector:
 *
 *    jquery-ui
 *
 * The views are:
 *
 *    VIEW_JQUERYUI_DISPLAY
 *    VIEW_JQUERYUI_EDIT
 *    VIEW_JQUERYUI_CREATE
 *
 * This theme can be selected by specifying the following view:
 *
 *    {
 *       "ui": "jquery-ui",
 *       "type": null | "create" | "edit" | "display"
 *    }
 *
 */
(function($) {

    var Alpaca = $.alpaca;

    Alpaca.styleInjections["jquery-ui"] = {
        "field" : function(targetDiv) {
            targetDiv.addClass('ui-widget');
        },
        "required" : function(targetDiv) {
            $('<span class="ui-icon ui-icon-star"></span>').prependTo(targetDiv);
        },
        "error" : function(targetDiv) {
            targetDiv.addClass('ui-state-error');
        },
        "errorMessage" : function(targetDiv) {
            targetDiv.addClass('ui-state-error-text');
        },
        "removeError" : function(targetDiv) {
            targetDiv.removeClass('ui-state-error');
        },
        "container" : function(targetDiv) {
            targetDiv.addClass('ui-widget-content');
        },
        "wizardStatusBar" : function(targetDiv) {
            targetDiv.addClass('ui-widget-header ui-corner-all');
        },
        "wizardCurrentStep" : function(targetDiv) {
            targetDiv.addClass('ui-state-highlight ui-corner-all');
        },
        "wizardUnCurrentStep" : function(targetDiv) {
            targetDiv.removeClass('ui-state-highlight ui-corner-all');
        },
        "containerExpandedIcon" : "ui-icon-circle-arrow-s",
        "containerCollapsedIcon" : "ui-icon-circle-arrow-e",
        "commonIcon" : "ui-icon",
        "addIcon" : "ui-icon-circle-plus",
        "removeIcon" : "ui-icon-circle-minus",
        "upIcon" : "ui-icon-circle-arrow-n",
        "downIcon" : "ui-icon-circle-arrow-s",
        "wizardPreIcon" : "ui-icon-triangle-1-w",
        "wizardNextIcon" : "ui-icon-triangle-1-e",
        "wizardDoneIcon" : "ui-icon-triangle-1-e",
        "buttonBeautifier"  : function(button, iconClass, withText) {
            button.addClass("ui-button ui-widget ui-state-default ui-corner-all");
            if (withText) {
                button.addClass("ui-button-text-icon-primary");
            } else {
                button.addClass("ui-button-icon-only");
            }
            var buttonText = button.html();
            button.attr("title", buttonText);
            button.empty().append('<span class="ui-button-icon-primary ui-icon alpaca-fieldset-legend-button ' + iconClass + '"></span><span class="ui-button-text">' + buttonText + '</span>');
            button.hover(function() {
                if (!button.hasClass("alpaca-fieldset-array-item-toolbar-disabled")) {
                    $(this).addClass("ui-state-hover");
                }
            }, function() {
                if (!button.hasClass("alpaca-fieldset-array-item-toolbar-disabled")) {
                    $(this).removeClass("ui-state-hover");
                }
            });
        }
    };

    Alpaca.registerView({
        "id": "VIEW_JQUERYUI_DISPLAY",
        "parent": "VIEW_WEB_DISPLAY",
        "title": "Default JQuery UI Display View",
        "description":"Default JQuery UI edit view which goes though field hierarchy.",
        "type": "view",
        "platform":"web",
        "style": "jquery-ui",
        "ui": "jquery-ui",
        "displayReadonly":true,
        "templates": {
            "controlField": '<div class="alpaca-data-container">{{if options.label}}<div class="alpaca-data-label">${options.label}</div>{{/if}}<div class="alpaca-data">&nbsp;${data}</div></div>',
            "fieldSetOuterEl": '<div class="ui-widget ui-widget-content">{{html this.html}}</div>',
            "fieldSetLegend": '{{if options.label}}<div class="{{if options.labelClass}}${options.labelClass}{{/if}}">${options.label}</div>{{/if}}',
            "fieldSetItemsContainer": '<div>{{html this.html}}</div>',
            "fieldSet": '{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"fieldSetLegend")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetItemsContainer",true)}}{{/wrap}}{{/wrap}}'
        }
    });

    Alpaca.registerView({
        "id":"VIEW_JQUERYUI_EDIT",
        "parent": "VIEW_WEB_EDIT",
        "title":"Default Web Edit View",
        "description":"Default web edit view which goes though field hierarchy.",
        "type":"edit",
        "platform":"web",
        "style": "jquery-ui",
        "ui": "jquery-ui",
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
            "formButtonsContainer": '<div>{{if options.buttons}}{{each(k,v) options.buttons}}<input data-key="${k}" class="alpaca-form-button alpaca-form-button-${k}" {{each(k1,v1) v}}${k1}="${v1}"{{/each}}/>{{/each}}{{/if}}</div>',
            "form": '<form>{{html Alpaca.fieldTemplate(this,"formFieldsContainer")}}{{html Alpaca.fieldTemplate(this,"formButtonsContainer")}}</form>',
            // Templates for wizard
            "wizardStep" : '<div class="alpaca-clear"></div>',
            "wizardNavBar" : '<div></div>',
            "wizardPreButton" : '<button>Back</button>',
            "wizardNextButton" : '<button>Next</button>',
            "wizardDoneButton" : '<button>Done</button>',
            "wizardStatusBar" : '<ol id="${id}">{{each(i,v) titles}}<li id="stepDesc${i}"><div><strong><span>${v.title}</span>${v.description}</strong></div></li>{{/each}}</ol>'
        },
        "messages":
        {
            "empty": "",
            "required": "This field is required",
            "valid": "",
            "invalid": "This field is invalid",
            "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            "timeUnits": { SECOND: "seconds", MINUTE: "minutes", HOUR: "hours", DAY: "days", MONTH: "months", YEAR: "years" }
        }
    });

    Alpaca.registerView({
        "id": "VIEW_JQUERYUI_CREATE",
        "parent": 'VIEW_WEB_CREATE',
        "title": "Default Web Create View",
        "description":"Default web create view which doesn't bind initial data.",
        "type": "create",
        "platform":"web",
        "style": "jquery-ui",
        "ui": "jquery-ui",
        "displayReadonly":false
    });

    Alpaca.registerView({
        "id": "VIEW_JQUERYUI_EDIT_LIST",
        "parent": 'VIEW_WEB_EDIT_LIST',
        "title": "JQuery UI Edit View List Style",
        "description": "JQuery UI edit view based on list styles.",
        "style": "jquery-ui",
        "ui": "jquery-ui"
    });

    Alpaca.registerView({
        "id": "VIEW_JQUERYUI_CREATE_LIST",
        "parent": 'VIEW_WEB_CREATE_LIST',
        "title": "JQuery UI Create View List Style",
        "description": "JQuery UI create view based on list styles.",
        "style": "jquery-ui",
        "ui": "jquery-ui"
    });


})(jQuery);