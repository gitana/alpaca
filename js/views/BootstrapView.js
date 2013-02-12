/**
 * Twitter Bootstrap Theme ("bootstrap")
 *
 * Defines the Alpaca theme for Twitter bootstrap.
 *
 * The style injector:
 *
 *    bootstrap
 *
 * The views are:
 *
 *    VIEW_BOOTSTRAP_DISPLAY
 *    VIEW_BOOTSTRAP_EDIT
 *    VIEW_BOOTSTRAP_CREATE
 *
 * This theme can also be selected by specifying the following view:
 *
 *    {
 *       "ui": "bootstrap",
 *       "type": null | "create" | "edit" | "display"
 *    }
 *
 */
(function($) {

    var Alpaca = $.alpaca;

    Alpaca.styleInjections["bootstrap"] = {

        // error messages
        "error" : function(targetDiv) {
            targetDiv.addClass('control-group error');
        },
        "errorMessage" : function(targetDiv) {
            targetDiv.addClass('');
        },
        "removeError" : function(targetDiv) {
            targetDiv.removeClass('error');
        },

        // field
        "field" : function(targetDiv) {
            targetDiv.addClass('control-group');
        },

        // required
        "required" : function(targetDiv) {
            $('<span class="icon-star"></span>&nbsp;').prependTo(targetDiv);
        },

        // no additional markup on container
        "container" : function(targetDiv) {
            targetDiv.addClass('');
        },

        // wizard (still relies on jquery-ui)
        "wizardStatusBar" : function(targetDiv) {
            targetDiv.addClass('ui-widget-header ui-corner-all');
        },
        "wizardCurrentStep" : function(targetDiv) {
            targetDiv.addClass('ui-state-highlight ui-corner-all');
        },
        "wizardUnCurrentStep" : function(targetDiv) {
            targetDiv.removeClass('ui-state-highlight ui-corner-all');
        },

        "commonIcon" : "",

        "addIcon" : "icon-plus-sign",
        "removeIcon" : "icon-minus-sign",

        "upIcon" : "icon-chevron-up",
        "downIcon" : "icon-chevron-down",

        "wizardPreIcon" : "ui-icon-triangle-1-w",
        "wizardNextIcon" : "ui-icon-triangle-1-e",
        "wizardDoneIcon" : "ui-icon-triangle-1-e",

        "containerExpandedIcon" : "icon-circle-arrow-down",
        "containerCollapsedIcon" : "icon-circle-arrow-right",

        "buttonBeautifier"  : function(button, iconClass, withText) {
            var buttonText = button.html();
            button.attr("title", buttonText);
            var addedButtonText = withText ? buttonText : "";
            button.empty().append('<b class="alpaca-fieldset-legend-button ' + iconClass + '"></b><span>' + addedButtonText + '</span>');
        }
    };

    Alpaca.registerView({
        "id": "VIEW_BOOTSTRAP_DISPLAY",
        "parent": "VIEW_WEB_EDIT",
        "title": "Abstract View for Bootstrap",
        "description": "Abstract View for Bootstrap",
        "style": "bootstrap",
        "ui": "bootstrap",
        "templates": {
            "controlFieldLabel": '{{if options.label}}<label class="control-label {{if options.labelClass}}${options.labelClass}{{/if}}" for="${id}">${options.label}</label>{{/if}}',
            "controlFieldHelper": '{{if options.helper}}<div class="{{if options.helperClass}}${options.helperClass}{{/if}}"><i class="icon-info-sign"></i> <span class="alpaca-controlfield-helper-text">${options.helper}</span></div>{{/if}}',
            "controlFieldMessage": '<div><span class="icon-exclamation-sign"></span><span class="alpaca-controlfield-message-text help-inline">${message}</span></div>',
            "arrayToolbar":'<span class="alpaca-fieldset-array-toolbar"><button class="btn btn-small alpaca-fieldset-array-toolbar-icon alpaca-fieldset-array-toolbar-add">${addItemLabel}</button></span>',
            "arrayItemToolbar": '<div class="btn-toolbar alpaca-fieldset-array-item-toolbar"><div class="btn-group"><button class="btn btn-small alpaca-fieldset-array-item-toolbar-icon alpaca-fieldset-array-item-toolbar-add">${addItemLabel}</button><button class="btn btn-small alpaca-fieldset-array-item-toolbar-icon alpaca-fieldset-array-item-toolbar-remove">${removeItemLabel}</button><button class="btn btn-small alpaca-fieldset-array-item-toolbar-icon alpaca-fieldset-array-item-toolbar-up">${moveUpItemLabel}</button><button class="btn btn-small alpaca-fieldset-array-item-toolbar-icon alpaca-fieldset-array-item-toolbar-down">${moveDownItemLabel}</button></div></div>',
            "controlFieldCheckbox": '<span>{{if options.rightLabel}}<label for="${id}" class="checkbox">{{/if}}<input type="checkbox" id="${id}" {{if options.readonly}}readonly="readonly"{{/if}} {{if name}}name="${name}"{{/if}} {{each(i,v) options.data}}data-${i}="${v}"{{/each}}/>{{if options.rightLabel}}${options.rightLabel}</label>{{/if}}</span>',
            "controlFieldRadio": '<div id="${id}" class="alpaca-controlfield-radio">{{if !required}}<label class="alpaca-controlfield-radio-label radio inline"><input type="radio" {{if options.readonly}}readonly="readonly"{{/if}} name="${name}" value=""/>None</label>{{/if}}{{each selectOptions}}<label class="alpaca-controlfield-radio-label radio inline"><input type="radio" {{if options.readonly}}readonly="readonly"{{/if}} name="${name}" value="${value}" {{if value == data}}checked="checked"{{/if}}/>${text}</label>{{/each}}</div>'
        },
        "render": function(field, renderedCallback) {

            var self = this;

            field.render(function(field) {

                $('select,input[type=text], textarea', field.outerEl).addClass('input-xlarge');
                $('input:submit, input:reset, .alpaca-form-button').addClass('btn');

                if (renderedCallback) {
                    renderedCallback.call(self, field);
                }
            });

        }
    });

    Alpaca.registerView({
        "id": "VIEW_BOOTSTRAP_EDIT",
        "parent": 'VIEW_BOOTSTRAP_DISPLAY',
        "title": "Web Edit View for Bootstrap",
        "type": "edit",
        "description": "Web Edit View for Bootstrap."
    });

    Alpaca.registerView({
        "id": "VIEW_BOOTSTRAP_CREATE",
        "parent": 'VIEW_BOOTSTRAP_EDIT',
        "title": "Web Create View for Bootstrap",
        "description":"Web Create View for Bootstrap",
        "type": "create",
        "displayReadonly":false
    });

})(jQuery);
