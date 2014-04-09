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
        "title": "Web Display View for jQuery UI",
        "description": "Web Display View for jQuery UI",
        "style": "jquery-ui",
        "ui": "jquery-ui"
    });

    Alpaca.registerView({
        "id": "VIEW_JQUERYUI_EDIT",
        "parent": "VIEW_WEB_EDIT",
        "title": "Web Edit View for jQuery UI",
        "description":"Web Edit View for jQuery UI",
        "style": "jquery-ui",
        "ui": "jquery-ui"
    });

    Alpaca.registerView({
        "id": "VIEW_JQUERYUI_CREATE",
        "parent": 'VIEW_WEB_CREATE',
        "title": "Web Create View for jQuery UI",
        "description": "Web Create View for jQuery UI",
        "style": "jquery-ui",
        "ui": "jquery-ui"
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