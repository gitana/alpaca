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
    // fires when a field switches to an invalid state
    callbacks["invalid"] = function()
    {
    };
    // fires when a field switches to a valid state
    callbacks["valid"] = function()
    {
    };

    var styles = {};
    styles["commonIcon"] = "";
    styles["addIcon"] = "";
    styles["removeIcon"] = "";
    styles["upIcon"] = "";
    styles["downIcon"] = "";
    styles["containerExpandedIcon"] = "";
    styles["containerCollapsedIcon"] = "";
    /*
    styles["wizardPreIcon"] = "";
    styles["wizardNextIcon"] = "";
    styles["wizardDoneIcon"] = "";
    */

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