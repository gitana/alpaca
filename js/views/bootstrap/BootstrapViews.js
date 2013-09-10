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





        // all control item containers get class: "form-group"
        // all input, textarea and select get class: "form-control"
        // all labels get class: "control-label"
        "field" : function(targetDiv) {

            // the item container gets the "form-group"
            targetDiv.parent().addClass('form-group');

            $(targetDiv).find("input").addClass("form-control");//.addClass("input-lg");
            $(targetDiv).find("textarea").addClass("form-control");//.addClass("input-lg");
            $(targetDiv).find("select").addClass("form-control");//.addClass("input-lg");

            // remove "input-lg" from selected controls
            //$(targetDiv).find("input[type=checkbox]").removeClass("input-lg");

            // remove "form-control" from selected controls
            $(targetDiv).find("input[type=checkbox]").removeClass("form-control");
            $(targetDiv).find("input[type=file]").removeClass("form-control");

            // all labels get class "control-label"
            $(targetDiv).find("label").addClass("control-label");
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

    var bootstrapTemplates = {
        "controlFieldLabel": '{{if options.label}}<label class="{{if options.labelClass}}${options.labelClass}{{/if}}" for="${id}">${options.label}</label>{{/if}}',
        "controlFieldHelper": '{{if options.helper}}<div class="{{if options.helperClass}}${options.helperClass}{{/if}}"><i class="glyphicon glyphicon-info-sign"></i> <p class="help-block help-inline alpaca-controlfield-helper-text">${options.helper}</p></div>{{/if}}',
        "controlFieldMessage": '<div><span class="glyphicon glyphicon-exclamation-sign"></span><span class="alpaca-controlfield-message-text help-inline help-block">${message}</span></div>',

        "arrayToolbar": '<span class="alpaca-fieldset-array-toolbar"><button class="btn btn-default alpaca-fieldset-array-toolbar-icon alpaca-fieldset-array-toolbar-add">${addItemLabel}</button></span>',
        "arrayItemToolbar": '<div class="btn-toolbar alpaca-fieldset-array-item-toolbar"><div class="btn-group">{{each(k,v) buttons}}<button class="btn btn-default btn-xs alpaca-fieldset-array-item-toolbar-icon alpaca-fieldset-array-item-toolbar-${v.feature}">${v.label}</button>{{/each}}</div></div>',

        "controlFieldCheckbox": '<span class="checkbox">{{if options.rightLabel}}<label for="${id}">{{/if}}<input type="checkbox" id="${id}" {{if options.readonly}}readonly="readonly"{{/if}} {{if name}}name="${name}"{{/if}} {{each(i,v) options.data}}data-${i}="${v}"{{/each}}/>{{if options.rightLabel}}${options.rightLabel}</label>{{/if}}</span>',
        "controlFieldRadio": '<div id="${id}" class="alpaca-controlfield-radio">{{if !required}}<label class="alpaca-controlfield-radio-label radio inline"><input type="radio" {{if options.readonly}}readonly="readonly"{{/if}} name="${name}" value=""/>None</label>{{/if}}{{each selectOptions}}<label class="alpaca-controlfield-radio-label radio inline"><input type="radio" {{if options.readonly}}readonly="readonly"{{/if}} name="${name}" value="${value}" {{if value == data}}checked="checked"{{/if}}/>${text}</label>{{/each}}</div>',

        "fieldSetHelper": '{{if options.helper}}<p class="{{if options.helperClass}}${options.helperClass}{{/if}}">${options.helper}</p>{{/if}}',

        "form": '<form role="form">{{html Alpaca.fieldTemplate(this,"formFieldsContainer")}}{{html Alpaca.fieldTemplate(this,"formButtonsContainer")}}</form>'
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
        "templates": bootstrapTemplates,
        "render": renderFunction
    });

    Alpaca.registerView({
        "id": "VIEW_BOOTSTRAP_EDIT",
        "parent": 'VIEW_WEB_EDIT',
        "title": "Edit View for Bootstrap",
        "description": "Edit View for Bootstrap",
        "style": "bootstrap",
        "ui": "bootstrap",
        "templates": bootstrapTemplates,
        "render": renderFunction
    });

    Alpaca.registerView({
        "id": "VIEW_BOOTSTRAP_CREATE",
        "parent": 'VIEW_WEB_CREATE',
        "title": "Create View for Bootstrap",
        "description":"Create View for Bootstrap",
        "style": "bootstrap",
        "ui": "bootstrap",
        "templates": bootstrapTemplates,
        "render": renderFunction
    });

    Alpaca.registerView({
        "id": "VIEW_BOOTSTRAP_DISPLAY_LIST",
        "parent": "VIEW_WEB_DISPLAY_LIST",
        "title": "Display List View for Bootstrap",
        "description": "Display List View for Bootstrap",
        "style": "bootstrap",
        "ui": "bootstrap",
        "templates": bootstrapTemplates,
        "render": renderFunction
    });

    Alpaca.registerView({
        "id": "VIEW_BOOTSTRAP_EDIT_LIST",
        "parent": 'VIEW_WEB_EDIT_LIST',
        "title": "Edit List View for Bootstrap",
        "description": "Edit List View for Bootstrap",
        "style": "bootstrap",
        "ui": "bootstrap",
        "templates": bootstrapTemplates,
        "render": renderFunction
    });

    Alpaca.registerView({
        "id": "VIEW_BOOTSTRAP_CREATE_LIST",
        "parent": 'VIEW_WEB_CREATE_LIST',
        "title": "Create List View for Bootstrap",
        "description":"Create List View for Bootstrap",
        "style": "bootstrap",
        "ui": "bootstrap",
        "templates": bootstrapTemplates,
        "render": renderFunction
    });

})(jQuery);
