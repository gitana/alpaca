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
        // NOTE: this = array field

        var self = this;

        if (remove)
        {
            // swap existing toolbar with an insertion point marker
            var existingToolbar = $(self.getFieldEl()).find(".alpaca-array-toolbar[data-alpaca-array-toolbar-field-id='" + self.getId() + "']");
            if (existingToolbar.length > 0)
            {
                var insertionPointEl = $("<div class='" + Alpaca.MARKER_CLASS_ARRAY_TOOLBAR + "' " + Alpaca.MARKER_DATA_ARRAY_TOOLBAR_FIELD_ID + "='" + self.getId() + "'></div>");

                existingToolbar.before(insertionPointEl);
                existingToolbar.remove();
            }
        }
        else
        {
            // find the the insertion point marker
            var insertionPointEl = $(self.getContainerEl()).find("." + Alpaca.MARKER_CLASS_ARRAY_TOOLBAR + "[" + Alpaca.MARKER_DATA_ARRAY_TOOLBAR_FIELD_ID + "='" + self.getId() + "']");
            if (insertionPointEl.length > 0)
            {
                // render toolbar
                var templateDescriptor = self.view.getTemplateDescriptor("container-array-toolbar", self);
                if (templateDescriptor)
                {
                    var toolbar = Alpaca.tmpl(templateDescriptor, {
                        "actions": self.toolbar.actions,
                        "id": self.getId(),
                        "toolbarStyle": self.options.toolbarStyle,
                        "view": self.view
                    });

                    // replace the insertion point
                    $(insertionPointEl).before(toolbar);
                    $(insertionPointEl).remove();
                }
            }
        }
    };
    // fired to add or remove the array actionbars all children of an array field
    callbacks["arrayActionbars"] = function(remove)
    {
        // NOTE: this = array field

        var self = this;

        // walk over all children
        for (var childIndex = 0; childIndex < self.children.length; childIndex++)
        {
            var childField = self.children[childIndex];
            var childFieldId = childField.getId();

            if (remove)
            {
                // find the existing action bar for this child
                // if we have one, remove it and replace it with an insertion point marker
                var existingActionbar = $(self.getFieldEl()).find(".alpaca-array-actionbar[data-alpaca-array-actionbar-field-id='" + childFieldId + "']");
                if (existingActionbar.length > 0)
                {
                    var insertionPointEl = $("<div class='" + Alpaca.MARKER_CLASS_ARRAY_ITEM_ACTIONBAR + "' " + Alpaca.MARKER_DATA_ARRAY_ITEM_KEY + "='" + childField.name + "'></div>");

                    existingActionbar.before(insertionPointEl);
                    existingActionbar.remove();
                }
            }
            else
            {
                // find the insertion point marker
                // if we find one, bind in the action toolbar
                var insertionPointEl = $(self.getFieldEl()).find("." + Alpaca.MARKER_CLASS_ARRAY_ITEM_ACTIONBAR + "[" + Alpaca.MARKER_DATA_ARRAY_ITEM_KEY + "='" + childField.name + "']");
                if (insertionPointEl.length > 0)
                {
                    var templateDescriptor = self.view.getTemplateDescriptor("container-array-actionbar", self);
                    if (templateDescriptor)
                    {
                        var actionbar = Alpaca.tmpl(templateDescriptor, {
                            "actions": self.actionbar.actions,
                            "name": childField.name,
                            "parentFieldId": self.getId(),
                            "fieldId": childField.getId(),
                            "itemIndex": childIndex,
                            "actionbarStyle": self.options.actionbarStyle,
                            "view": self.view
                        });

                        // replace the insertion point
                        $(insertionPointEl).before(actionbar);
                        $(insertionPointEl).remove();
                    }
                }
            }
        }
    };
    // fired after a text field is deemed to be autocomplete-able
    callbacks["autocomplete"] = function()
    {
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
    styles["table"] = "";

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
