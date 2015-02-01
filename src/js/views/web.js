/**
 * Web Theme ("web")
 *
 * Defines the default web theme for pure HTML5 forms.
 *
 * The views are:
 *
 *    web-view
 *    web-edit
 *    web-create
 *
 * This theme can also be selected by specifying the following view:
 *
 *    {
 *       "ui": "web",
 *       "type": null | "view" | "edit" | "create"
 *    }
 *
 */

(function($) {

    var Alpaca = $.alpaca;

    /**
     * This is the default injector ("web").
     *
     * The hooks provided here are empty.  The web view falls back on straight HTML5 for pretty much everything.
     * As such, these mostly serve as a reference for extension.
     */
    var callbacks = {};
    // fires after a field renders
    callbacks["field"] = function()
    {
    };
    // fires after a control renders
    callbacks["control"] = function()
    {
    };
    // fires after a container renders
    callbacks["container"] = function()
    {
    };
    // fires after a form renders
    callbacks["form"] = function()
    {
    };
    // fires when a field is marked as required
    callbacks["required"] = function()
    {
    };
    // fires when a field is marked as optional
    callbacks["optional"] = function()
    {
    };
    // fires when a field is marked as readonly
    callbacks["readonly"] = function()
    {
    };
    // fires when a field is marked as disabled
    callbacks["disabled"] = function()
    {
    };
    // fires when a field is marked as enabled
    callbacks["enabled"] = function()
    {
    };
    // called when validity state for a field is being cleared
    callbacks["clearValidity"] = function()
    {
    };
    // fires when a field is marked as invalid
    callbacks["invalid"] = function(hidden)
    {
    };
    // fires when a field is marked a valid
    callbacks["valid"] = function()
    {
    };
    // fired to add a message to an invalid field
    callbacks["addMessage"] = function(index, messageId, messageText, hidden)
    {
    };
    // fired to remove all messages for a field
    callbacks["removeMessages"] = function()
    {
    };
    // fired when a button is being enabled
    callbacks["enableButton"] = function(button)
    {
    };
    // fired when a button is being disabled
    callbacks["disableButton"] = function(button)
    {
    };
    // fired to add or remove the array toolbar for a field
    callbacks["arrayToolbar"] = function(remove)
    {
        var self = this;

        var fieldId = this.getId();

        if (remove)
        {
            $(this.getFieldEl()).find(".alpaca-array-toolbar[data-alpaca-array-toolbar-field-id='" + fieldId + "']").remove();
        }
        else
        {
            // render toolbar
            var templateDescriptor = this.view.getTemplateDescriptor("container-array-toolbar", self);
            var toolbar = Alpaca.tmpl(templateDescriptor, {
                "actions": self.toolbar.actions,
                "fieldId": self.getId(),
                "toolbarStyle": self.options.toolbarStyle,
                "view": self.view
            });

            $(this.getContainerEl()).before(toolbar);
        }
    };
    // fired to add or remove the array actionbars for a field
    callbacks["arrayActionbars"] = function(remove)
    {
        var self = this;

        var fieldId = this.getId();

        if (remove)
        {
            $(this.getFieldEl()).find(".alpaca-array-actionbar[data-alpaca-array-actionbar-field-id='" + fieldId + "']").remove();
        }
        else
        {
            var templateDescriptor = this.view.getTemplateDescriptor("container-array-actionbar", self);

            // for each item render the item toolbar
            var items = this.getContainerEl().children(".alpaca-container-item");
            $(items).each(function(itemIndex) {

                var actionbar = Alpaca.tmpl(templateDescriptor, {
                    "actions": self.actionbar.actions,
                    "fieldId": self.getId(),
                    "itemIndex": itemIndex,
                    "actionbarStyle": self.options.actionbarStyle,
                    "view": self.view
                });

                // insert above or below
                if (self.options.actionbarStyle == "top")
                {
                    $(this).children().first().before(actionbar);
                }
                else if (self.options.actionbarStyle == "bottom")
                {
                    $(this).children().last().after(actionbar);
                }

            });


        }
    };

    var styles = {};
    styles["button"] = "";
    styles["smallButton"] = "";
    styles["addIcon"] = "";
    styles["removeIcon"] = "";
    styles["upIcon"] = "";
    styles["downIcon"] = "";
    styles["expandedIcon"] = "";
    styles["collapsedIcon"] = "";

    Alpaca.registerView({
        "id": "web-display",
        "parent": "base",
        "type": "display",
        "ui": "web",
        "title": "Default HTML5 display view",
        "displayReadonly": true,
        "templates": {},
        "callbacks": callbacks,
        "styles": styles,
        "horizontal": false
    });

    Alpaca.registerView({
        "id": "web-display-horizontal",
        "parent": "web-display",
        "horizontal": true
    });

    Alpaca.registerView({
        "id": "web-edit",
        "parent": "base",
        "type": "edit",
        "ui": "web",
        "title": "Default HTML5 edit view",
        "displayReadonly": true,
        "templates": {},
        "callbacks": callbacks,
        "styles": styles,
        "horizontal": false
    });

    Alpaca.registerView({
        "id": "web-edit-horizontal",
        "parent": "web-edit",
        "horizontal": true
    });

    Alpaca.registerView({
        "id": "web-create",
        "parent": "web-edit",
        "type": "create",
        "title": "Default HTML5 create view",
        "displayReadonly": false,
        "templates": {},
        "horizontal": false
    });

    Alpaca.registerView({
        "id": "web-create-horizontal",
        "parent": "web-create",
        "horizontal": true
    });

})(jQuery);
