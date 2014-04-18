/**
 * Twitter Bootstrap Theme ("bootstrap")
 *
 * Defines the Alpaca theme for Twitter Bootstrap v3.
 *
 * The views are:
 *
 *    bootstrap-view
 *    bootstrap-edit
 *    bootstrap-create
 *
 * This theme can also be selected by specifying the following view:
 *
 *    {
 *       "ui": "bootstrap",
 *       "type": "view" | "edit" | "create"
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
        var fieldEl = this.getFieldEl();

        // required fields get a little star in their label
        var label = $(fieldEl).find("label.alpaca-control-label");
        $('<span class="alpaca-icon-required glyphicon glyphicon-star"></span>').prependTo(label);

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

        // controlEl
        var controlEl = this.getControlEl();

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

        // all control labels get class "control-label"
        $(fieldEl).find("label.alpaca-control-label").addClass("control-label");

        // if in horizontal mode, add a wrapper div (col-sm-10) and label gets (col-sm-2)
        if (this.view.horizontal)
        {
            $(fieldEl).find("label.alpaca-control-label").addClass("col-sm-2");

            var wrapper = $("<div></div>");
            wrapper.addClass("col-sm-10");

            $(controlEl).after(wrapper);
            wrapper.append(controlEl);
        }
    };
    callbacks["container"] = function()
    {
        var containerEl = this.getContainerEl();

        if (this.view.horizontal)
        {
            $(containerEl).addClass("form-horizontal");
        }
    };
    callbacks["form"] = function()
    {
        var formEl = this.getFormEl();

        // use pull-right for form buttons
        $(formEl).find(".alpaca-form-buttons-container").addClass("pull-right");
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
        "id": "bootstrap-display",
        "parent": "web-display",
        "type": "display",
        "ui": "bootstrap",
        "title": "Display View for Bootstrap 3",
        "displayReadonly": true,
        "callbacks": callbacks,
        "styles": styles,
        "templates": {}
    });

    Alpaca.registerView({
        "id": "bootstrap-display-horizontal",
        "parent": "bootstrap-display",
        "horizontal": true
    });

    Alpaca.registerView({
        "id": "bootstrap-edit",
        "parent": "web-edit",
        "type": "edit",
        "ui": "bootstrap",
        "title": "Edit View for Bootstrap 3",
        "displayReadonly": true,
        "callbacks": callbacks,
        "styles": styles,
        "templates": {}
    });

    Alpaca.registerView({
        "id": "bootstrap-edit-horizontal",
        "parent": "bootstrap-edit",
        "horizontal": true
    });

    Alpaca.registerView({
        "id": "bootstrap-create",
        "parent": "bootstrap-edit",
        "title": "Create View for Bootstrap 3",
        "type": "create",
        "displayReadonly": false
    });

    Alpaca.registerView({
        "id": "bootstrap-create-horizontal",
        "parent": "bootstrap-create",
        "horizontal": true
    });

})(jQuery);
