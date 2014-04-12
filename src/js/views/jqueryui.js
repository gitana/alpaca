/**
 * jQuery UI Theme ("jqueryui")
 *
 * Defines the Alpaca theme for jQuery UI.
 *
 * The views are:
 *
 *    jqueryui-view
 *    jqueryui-edit
 *    jqueryui-create
 *
 * This theme can be selected by specifying the following view:
 *
 *    {
 *       "ui": "jqueryui",
 *       "type": null | "view" | "create" | "edit"
 *    }
 *
 */
(function($) {

    var Alpaca = $.alpaca;

    // custom callbacks
    var callbacks = {};
    callbacks["field"] = function()
    {
        this.getFieldEl().addClass("ui-widget");
        //this.getFieldEl().addClass("ui-widget-content");
    };
    callbacks["required"] = function()
    {
        $('<span class="ui-icon ui-icon-star"></span>').prependTo(this.getFieldEl());
    };
    callbacks["invalid"] = function()
    {
        this.getFieldEl().addClass('ui-state-error');
    };
    callbacks["valid"] = function()
    {
        this.getFieldEl().removeClass("ui-state-error");
    };
    callbacks["container"] = function()
    {
        this.getFieldEl().addClass('ui-widget-content');
    };
    callbacks["hide"] = function()
    {
        this.getFieldEl().addClass("ui-helper-hidden ui-helper-hidden-accessible");
    };
    callbacks["show"] = function()
    {
        this.getFieldEl().removeClass("ui-helper-hidden");
        this.getFieldEl().removeClass("ui-helper-hidden-accessible");
    };

    /*
    "errorMessage" : function(targetDiv) {
        targetDiv.addClass('ui-state-error-text');
    },
    "removeError" : function(targetDiv) {
        targetDiv.removeClass('ui-state-error');
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
    */

    // custom styles
    var styles = {};
    styles["containerExpandedIcon"] = "ui-icon-circle-arrow-s";
    styles["containerCollapsedIcon"] = "ui-icon-circle-arrow-e";
    styles["commonIcon"] = "ui-icon";
    styles["addIcon"] = "ui-icon-circle-plus";
    styles["removeIcon"] = "ui-icon-circle-minus";
    styles["upIcon"] = "ui-icon-circle-arrow-n";
    styles["downIcon"] = "ui-icon-circle-arrow-s";
    styles["wizardPreIcon"] = "ui-icon-triangle-1-w";
    styles["wizardNextIcon"] = "ui-icon-triangle-1-e";
    styles["wizardDoneIcon"] = "ui-icon-triangle-1-e";

    Alpaca.registerView({
        "id": "jqueryui-view",
        "parent": "web-view",
        "type": "view",
        "ui": "jqueryui",
        "title": "Display View for jQuery UI",
        "displayReadonly": true,
        "callbacks": callbacks,
        "styles": styles,
        "templates": {}
    });

    Alpaca.registerView({
        "id": "jqueryui-edit",
        "parent": "web-edit",
        "type": "edit",
        "ui": "jqueryui",
        "title": "Edit view for jQuery UI",
        "displayReadonly": true,
        "callbacks": callbacks,
        "styles": styles,
        "templates": {}
    });

    Alpaca.registerView({
        "id": "jqueryui-create",
        "parent": "jqueryui-edit",
        "type": "create",
        "title": "Create view for jQuery UI",
        "displayReadonly": false
    });

})(jQuery);