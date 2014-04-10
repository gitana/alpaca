/**
 * Twitter Bootstrap Theme ("bootstrap")
 *
 * Defines the Alpaca theme for Twitter Bootstrap v3.
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

    // custom styles
    var styles = {};
    styles["commonIcon"] = "";
    styles["addIcon"] = "glyphicon glyphicon-plus-sign";
    styles["removeIcon"] = "glyphicon glyphicon-minus-sign";
    styles["upIcon"] = "glyphicon glyphicon-chevron-up";
    styles["downIcon"] = "glyphicon glyphicon-chevron-down";
    styles["containerExpandedIcon"] = "glyphicon glyphicon-circle-arrow-down";
    styles["containerCollapsedIcon"] = "glyphicon glyphicon-circle-arrow-right";
    styles["wizardPreIcon"] = "glyphicon glyphicon-chevron-left";
    styles["wizardNextIcon"] = "glyphicon glyphicon-chevron-right";
    styles["wizardDoneIcon"] = "glyphicon glyphicon-ok";

    // custom callbacks
    var callbacks = {};
    callbacks["required"] = function()
    {
        // required fields get a little star
        $('<span class="glyphicon glyphicon-star"></span>&nbsp;').prependTo(this.getFieldEl());
    };
    callbacks["invalid"] = function()
    {
        // invalid fields add the class 'has-error'
        $(this.getFieldEl()).addClass('has-error');
    };
    callbacks["valid"] = function()
    {
        // valid fields remove the class 'has-error'
        $(this.getFieldEl()).removeClass('has-error');
    };
    callbacks["control"] = function()
    {
        // controls get some special formatting

        // fieldEl
        var fieldEl = this.getFieldEl();

        // all controls get the "form-control" class injected
        $(fieldEl).find("input").addClass("form-control");
        $(fieldEl).find("textarea").addClass("form-control");
        $(fieldEl).find("select").addClass("form-control");
        // except for the following
        $(fieldEl).find("input[type=checkbox]").removeClass("form-control");
        $(fieldEl).find("input[type=file]").removeClass("form-control");
        $(fieldEl).find("input[type=radio]").removeClass("form-control");

        // any checkbox inputs get the "checkbox" class on their checkbox
        $(fieldEl).find("input[type=checkbox]").parent().parent().addClass("checkbox");
        // any radio inputs get the "radio" class on their radio
        $(fieldEl).find("input[type=radio]").parent().parent().addClass("radio");

        // if form has "form-inline" class, then radio and checkbox labels get inline classes
        if ($(fieldEl).parents("form").hasClass("form-inline"))
        {
            // checkboxes
            $(fieldEl).find("input[type=checkbox]").parent().addClass("checkbox-inline");

            // radios
            $(fieldEl).find("input[type=radio]").parent().addClass("radio-inline");
        }
    };

    /*
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
    */

    Alpaca.registerView({
        "id": "VIEW_BOOTSTRAP_DISPLAY",
        "parent": "VIEW_WEB_DISPLAY",
        "title": "Display View for Bootstrap 3",
        "description": "Display View for Bootstrap 3",
        "displayReadonly": true,
        "type": "view",
        "ui":"bootstrap",
        "callbacks": callbacks,
        "styles": styles,
        "templates": AlpacaTemplates.handlebars["view_bootstrap_display"]
    });

    Alpaca.registerView({
        "id":"VIEW_BOOTSTRAP_EDIT",
        "parent": "VIEW_WEB_EDIT",
        "title": "Edit View for Bootstrap 3",
        "description": "Edit View for Bootstrap 3",
        "displayReadonly": true,
        "type":"edit",
        "ui":"bootstrap",
        "callbacks": callbacks,
        "styles": styles,
        "templates": AlpacaTemplates.handlebars["view_bootstrap_edit"]
    });

    Alpaca.registerView({
        "id": "VIEW_BOOTSTRAP_CREATE",
        "parent": 'VIEW_BOOTSTRAP_EDIT',
        "title": "Create View for Bootstrap 3",
        "description":"Create View for Bootstrap 3",
        "displayReadonly": false,
        "type": "create",
        "ui": "bootstrap",
        "callbacks": callbacks,
        "styles": styles
    });

})(jQuery);
