/**
 * Twitter Bootstrap Theme ("bootstrap")
 *
 * Defines the Alpaca theme for Twitter Bootstrap v3.
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

    var editTemplates = Alpaca.Create(Alpaca.EmptyViewTemplates, {
        // Templates for control fields
        "controlFieldOuterEl": '<div class="form-group">{{html this.html}}</div>',
        "controlFieldMessage": '<span class="glyphicon glyphicon-exclamation-sign"></span><span class="help-block alpaca-controlfield-message-text">${message}</span>',
        "controlFieldLabel": '{{if options.label}}<label class="{{if options.labelClass}}${options.labelClass}{{/if}} control-label" for="${id}">${options.label}</label>{{/if}}',
        "controlFieldHelper": '{{if options.helper}}<i class="glyphicon glyphicon-info-sign"></i><p class="{{if options.helperClass}}${options.helperClass}{{/if}}">${options.helper}</p>{{/if}}',
        "controlFieldContainer": '<div>{{html this.html}}</div>',
        "controlField": '{{wrap(null, {}) Alpaca.fieldTemplate(this,"controlFieldOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"controlFieldLabel")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"controlFieldContainer",true)}}{{html Alpaca.fieldTemplate(this,"controlFieldHelper")}}{{/wrap}}{{/wrap}}',
        // Templates for container fields
        "fieldSetOuterEl": '<fieldset>{{html this.html}}</fieldset>',
        "fieldSetMessage": '<span class="glyphicon glyphicon-exclamation-sign"></span><span class="help-block alpaca-controlfield-message-text">${message}</span>',
        "fieldSetLegend": '{{if options.label}}<legend class="{{if options.labelClass}}${options.labelClass}{{/if}}">${options.label}</legend>{{/if}}',
        "fieldSetHelper": '{{if options.helper}}<i class="glyphicon glyphicon-info-sign"></i><p class="{{if options.helperClass}}${options.helperClass}{{/if}}">${options.helper}</p>{{/if}}',
        "fieldSetItemsContainer": '<div>{{html this.html}}</div>',
        "fieldSet": '{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"fieldSetLegend")}}{{html Alpaca.fieldTemplate(this,"fieldSetHelper")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetItemsContainer",true)}}{{/wrap}}{{/wrap}}',
        "fieldSetItemContainer": '<div></div>',
        // Templates for form
        "formFieldsContainer": '<div>{{html this.html}}</div>',
        "formButtonsContainer": '<div>{{if options.buttons}}{{each(k,v) options.buttons}}<button data-key="${k}" class="alpaca-form-button alpaca-form-button-${k} btn btn-default" {{each(k1,v1) v}}${k1}="${v1}"{{/each}}>${v.value}</button>{{/each}}{{/if}}</div>',
        "form": '<form role="form">{{html Alpaca.fieldTemplate(this,"formFieldsContainer")}}{{html Alpaca.fieldTemplate(this,"formButtonsContainer")}}</form>',
        // Templates for wizard
        "wizardStep" : '<div class="alpaca-clear"></div>',
        "wizardNavBar" : '<div></div>',
        "wizardPreButton" : '<button>Back</button>',
        "wizardNextButton" : '<button>Next</button>',
        "wizardDoneButton" : '<button>Done</button>',
        "wizardStatusBar" : '<ol id="${id}">{{each(i,v) titles}}<li id="stepDesc${i}"><div><strong><span>${v.title}</span>${v.description}</strong></div></li>{{/each}}</ol>',

        "controlFieldCheckbox": '<div class="checkbox">{{if options.rightLabel}}<label for="${id}">{{/if}}<input type="checkbox" id="${id}" {{if options.readonly}}readonly="readonly"{{/if}} {{if name}}name="${name}"{{/if}} {{each(i,v) options.data}}data-${i}="${v}"{{/each}}/>{{if options.rightLabel}}${options.rightLabel}</label>{{/if}}</div>',
        "controlFieldRadio": '{{if !required}}<div class="radio"><input type="radio" {{if options.readonly}}readonly="readonly"{{/if}} name="${name}" value=""/>None</div>{{/if}}{{each selectOptions}}<div class="radio"><label class="alpaca-controlfield-radio-label"><input type="radio" {{if options.readonly}}readonly="readonly"{{/if}} name="${name}" value="${value}" {{if value == data}}checked="checked"{{/if}}/>${text}</label></div>{{/each}}'

    });

    var displayTemplates = Alpaca.Create(editTemplates, {
        "fieldSetOuterEl": '<fieldset disabled>{{html this.html}}</fieldset>'
    });

    Alpaca.styleInjections["bootstrap"] = {

        /*
        // error messages
        "addErrorMessage": function(targetDiv, message) {

            // if bootstrap has the tooltip, we can pretty up the message
            if ($.fn.tooltip)
            {
                targetDiv.tooltip({
                    "html": message
                }).click();
            }
        },

        "buttonBeautifier"  : function(button, iconClass, withText) {
            var buttonText = button.html();
            button.attr("title", buttonText);
            var addedButtonText = withText ? buttonText : "";
            button.empty().append('<b class="alpaca-fieldset-legend-button ' + iconClass + '"></b><span>' + addedButtonText + '</span>');
        },
        */

        "field" : function(targetDiv) {

            // the item container gets the "form-group"
            //targetDiv.parent().addClass('form-group');

            // all controls get the "form-control" class injected
            $(targetDiv).find("input").addClass("form-control");
            $(targetDiv).find("textarea").addClass("form-control");
            $(targetDiv).find("select").addClass("form-control");
            // except for the following
            $(targetDiv).find("input[type=checkbox]").removeClass("form-control");
            $(targetDiv).find("input[type=file]").removeClass("form-control");
            $(targetDiv).find("input[type=radio]").removeClass("form-control");

            // any checkbox inputs get the "checkbox" class on their container

            // any radio inputs get the "checkbox" class on their checkbox
            $(targetDiv).find("input[type=checkbox]").parent().parent().addClass("checkbox");
            // any radio inputs get the "radio" class on their radio
            $(targetDiv).find("input[type=radio]").parent().parent().addClass("radio");

            // if form has "form-inline" class, then radio and checkbox labels get inline classes
            if ($(targetDiv).parents("form").hasClass("form-inline"))
            {
                // checkboxes
                $(targetDiv).find("input[type=checkbox]").parent().addClass("checkbox-inline");

                // radios
                $(targetDiv).find("input[type=radio]").parent().addClass("radio-inline");
            }

            // TODO: form-horizontal?
        },

        // icons
        "commonIcon" : "",
        "addIcon" : "glyphicon glyphicon-plus-sign",
        "removeIcon" : "glyphicon glyphicon-minus-sign",
        "upIcon" : "glyphicon glyphicon-chevron-up",
        "downIcon" : "glyphicon glyphicon-chevron-down",
        "containerExpandedIcon" : "glyphicon glyphicon-circle-arrow-down",
        "containerCollapsedIcon" : "glyphicon glyphicon-circle-arrow-right",
        "wizardPreIcon" : "glyphicon glyphicon-chevron-left",
        "wizardNextIcon" : "glyphicon glyphicon-chevron-right",
        "wizardDoneIcon" : "glyphicon glyphicon-ok",


        // required fields get star icon
        "required" : function(targetDiv)
        {
            $('<span class="glyphicon glyphicon-star"></span>&nbsp;').prependTo(targetDiv);
        },

        // error fields get the "has-error" class
        "error" : function(targetDiv) {
            targetDiv.addClass('has-error');

            /*
            $(targetDiv).popover({
                "html": true,
                "trigger": "manual",
                "content": "error message"
            });
            $(targetDiv).on("shown.bs.popover", function() {
                debugger;
                $(this).css({
                    "border": "1px red solid",
                    "color": "red"
                });
            });
            $(targetDiv).popover("show");
            */
        },
        "removeError" : function(targetDiv) {
            targetDiv.removeClass('has-error');

            /*
            $(targetDiv).popover("hide");
            */

            /*
            $(targetDiv).on("hidden.bs.popover", function() {
                $(targetDiv).popover("destroy");
            });
            */
        },

        // The Wizard still relies on jQuery UI
        "wizardStatusBar" : function(targetDiv) {
            targetDiv.addClass('ui-widget-header ui-corner-all');
        },
        "wizardCurrentStep" : function(targetDiv) {
            targetDiv.addClass('ui-state-highlight ui-corner-all');
        },
        "wizardUnCurrentStep" : function(targetDiv) {
            targetDiv.removeClass('ui-state-highlight ui-corner-all');
        },

        "buttonBeautifier"  : function(button, iconClass, withText) {
            var buttonText = button.html();
            button.attr("title", buttonText);
            button.empty().append('<b class="alpaca-fieldset-legend-button ' + iconClass + '"></b>');
            var addedButtonText = withText ? buttonText : null;
            if (addedButtonText)
            {
                button.append('<span class="alpaca-fieldset-legend-button-text">' + addedButtonText + '</span>');
            }
        }
    };

    var renderFunction = function(field, renderedCallback)
    {
        var self = this;

        field.render(function(field) {

            if (renderedCallback) {
                renderedCallback.call(self, field);
            }
        });
    };

    Alpaca.registerView({
        "id": "VIEW_BOOTSTRAP_DISPLAY",
        "parent": "VIEW_WEB_DISPLAY",
        "title": "Display View for Bootstrap",
        "description": "Display View for Bootstrap",
        "style": "bootstrap",
        "ui": "bootstrap",
        "templates": displayTemplates,
        "render": renderFunction,
        "type": "view"
    });

    Alpaca.registerView({
        "id": "VIEW_BOOTSTRAP_EDIT",
        "parent": 'VIEW_WEB_EDIT',
        "title": "Edit View for Bootstrap",
        "description": "Edit View for Bootstrap",
        "style": "bootstrap",
        "ui": "bootstrap",
        "templates": editTemplates,
        "render": renderFunction,
        "type": "edit"
    });

    Alpaca.registerView({
        "id": "VIEW_BOOTSTRAP_CREATE",
        "parent": 'VIEW_WEB_CREATE',
        "title": "Create View for Bootstrap",
        "description":"Create View for Bootstrap",
        "style": "bootstrap",
        "ui": "bootstrap",
        "templates": editTemplates,
        "render": renderFunction,
        "type": "create"
    });

})(jQuery);
