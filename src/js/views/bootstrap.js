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

        "field" : function(targetDiv) {

            /*
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
            */
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

    Alpaca.registerView({
        "id": "VIEW_BOOTSTRAP_DISPLAY",
        "parent": "VIEW_BASE",
        "title": "Display View for Bootstrap",
        "description": "Display View for Bootstrap",
        "type": "view",
        "platform": "web",
        "ui":"bootstrap",
        "style": "bootstrap",
        "displayReadonly": true,
        "templates": AlpacaTemplates.handlebars["view_bootstrap_display"]
    });

    Alpaca.registerView({
        "id":"VIEW_BOOTSTRAP_EDIT",
        "parent": "VIEW_BASE",
        "title": "Edit View for Bootstrap",
        "description": "Edit View for Bootstrap",
        "type":"edit",
        "platform": "web",
        "ui":"bootstrap",
        "style": "bootstrap",
        "displayReadonly": true,
        "templates": AlpacaTemplates.handlebars["view_bootstrap_edit"]
    });

    Alpaca.registerView({
        "id": "VIEW_BOOTSTRAP_CREATE",
        "parent": 'VIEW_BOOTSTRAP_EDIT',
        "title": "Create View for Bootstrap",
        "description":"Create View for Bootstrap",
        "type": "create",
        "displayReadonly": false
    });

})(jQuery);
