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
    };
    callbacks["required"] = function()
    {
        var fieldEl = this.getFieldEl();

        // required fields get a little star in their label
        var label = $(fieldEl).find("label.alpaca-control-label");
        $('<span class="alpaca-icon-required ui-icon ui-icon-star"></span>').prependTo(label);
    };
    callbacks["invalid"] = function()
    {
        this.getFieldEl().addClass('ui-state-error');
    };
    callbacks["valid"] = function()
    {
        this.getFieldEl().removeClass("ui-state-error");
    };
    callbacks["control"] = function()
    {
        var fieldEl = this.getFieldEl();
        var controlEl = this.getControlEl();

        // if in horizontal mode, add a wrapper div (span_10) and label gets (span_2)
        if (this.view.horizontal)
        {
            $(fieldEl).find("label.alpaca-control-label").addClass("col span_2");

            var wrapper = $("<div></div>");
            wrapper.addClass("col span_10");

            $(controlEl).after(wrapper);
            wrapper.append(controlEl);
        }
    };
    callbacks["container"] = function()
    {
        //this.getFieldEl().addClass('ui-widget-content');
    };
    callbacks["form"] = function()
    {
        var formEl = this.getFormEl();

        if (this.view.horizontal)
        {
            $(formEl).addClass("form-horizontal");
        }

        // use pull-right for form buttons
        $(formEl).find(".alpaca-form-buttons-container").addClass("alpaca-float-right");
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
    styles["button"] = "";
    styles["smallButton"] = "";
    styles["addIcon"] = "ui-icon ui-icon-circle-plus";
    styles["removeIcon"] = "ui-icon ui-icon-circle-minus";
    styles["upIcon"] = "ui-icon ui-icon-circle-arrow-n";
    styles["downIcon"] = "ui-icon ui-icon-circle-arrow-s";
    styles["expandedIcon"] = "ui-icon ui-icon-circle-arrow-s";
    styles["collapsedIcon"] = "ui-icon ui-icon-circle-arrow-e";

    Alpaca.registerView({
        "id": "jqueryui-display",
        "parent": "web-display",
        "type": "display",
        "ui": "jqueryui",
        "title": "Display View for jQuery UI",
        "displayReadonly": true,
        "callbacks": callbacks,
        "styles": styles,
        "templates": {}
    });

    Alpaca.registerView({
        "id": "jqueryui-display-horizontal",
        "parent": "jqueryui-display",
        "horizontal": true
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
        "id": "jqueryui-edit-horizontal",
        "parent": "jqueryui-edit",
        "horizontal": true
    });

    Alpaca.registerView({
        "id": "jqueryui-create",
        "parent": "jqueryui-edit",
        "type": "create",
        "title": "Create view for jQuery UI",
        "displayReadonly": false
    });

    Alpaca.registerView({
        "id": "jqueryui-create-horizontal",
        "parent": "jqueryui-create",
        "horizontal": true
    });

})(jQuery);