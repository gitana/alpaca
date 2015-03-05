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
    styles["button"] = "btn btn-default";
    styles["smallButton"] = "btn btn-default btn-sm";
    styles["addIcon"] = "glyphicon glyphicon-plus-sign";
    styles["removeIcon"] = "glyphicon glyphicon-minus-sign";
    styles["upIcon"] = "glyphicon glyphicon-chevron-up";
    styles["downIcon"] = "glyphicon glyphicon-chevron-down";
    styles["expandedIcon"] = "glyphicon glyphicon-circle-arrow-down";
    styles["collapsedIcon"] = "glyphicon glyphicon-circle-arrow-right";
    styles["table"] = "table table-striped table-bordered table-hover";

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
        // if this is a control field, add class "has-error"
        if (this.isControlField)
        {
            $(this.getFieldEl()).addClass('has-error');
        }

        /*
        // if this is a container field, add class "has-error"
        if (this.isContainerField)
        {
            $(this.getFieldEl()).addClass('has-error');
        }
        */

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

        // special case for type == color, remove form-control
        if (this.inputType === "color")
        {
            $(fieldEl).find("input").removeClass("form-control");
        }

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

        // if in horizontal mode, add a wrapper div (col-sm-9) and label gets (col-sm-3)
        if (this.view.horizontal)
        {
            $(fieldEl).find("label.alpaca-control-label").addClass("col-sm-3");

            var wrapper = $("<div></div>");
            wrapper.addClass("col-sm-9");

            $(controlEl).after(wrapper);
            wrapper.append(controlEl);

            $(fieldEl).append("<div style='clear:both;'></div>");
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
        //$(formEl).find(".alpaca-form-buttons-container").addClass("pull-right");
    };
    callbacks["enableButton"] = function(button)
    {
        $(button).removeAttr("disabled");
    };
    callbacks["disableButton"] = function(button)
    {
        $(button).attr("disabled", "disabled");
    };
    callbacks["collapsible"] = function()
    {
        var fieldEl = this.getFieldEl();
        var legendEl = $(fieldEl).find("legend").first();
        var anchorEl = $("[data-toggle='collapse']", legendEl);
        if ($(anchorEl).length > 0)
        {
            var containerEl = this.getContainerEl();

            // container id
            var id = $(containerEl).attr("id");
            if (!id) {
                id = Alpaca.generateId();
                $(containerEl).attr("id", id);
            }

            // set up container to be collapsible
            $(containerEl).addClass("collapse in");

            // set up legend anchor
            if (!$(anchorEl).attr("data-target")) {
                $(anchorEl).attr("data-target", "#" + id);
            }

            $(anchorEl).mouseover(function(e) {
                $(this).css("cursor", "pointer");
            })
        }
    };

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
