/**
 * Web Theme ("web")
 *
 * Defines the default web theme for pure HTML5 forms.
 *
 * The views are:
 *
 *    VIEW_WEB_DISPLAY
 *    VIEW_WEB_EDIT
 *    VIEW_WEB_CREATE
 *
 * This theme can also be selected by specifying the following view:
 *
 *    {
 *       "ui": "web",
 *       "type": null | "create" | "edit" | "display"
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
        "id": "VIEW_WEB_DISPLAY",
        "parent": "VIEW_BASE",
        "title": "Web Display View",
        "description": "Web edit view which goes though field hierarchy.",
        "displayReadonly": true,
        "templates": AlpacaTemplates.handlebars["view_web_display"],
        "type": "view",
        "ui": "web",
        "callbacks": callbacks,
        "styles": styles
    });

    Alpaca.registerView({
        "id":"VIEW_WEB_EDIT",
        "parent": "VIEW_BASE",
        "title":"Web Edit View",
        "description":"Web edit view which goes though field hierarchy.",
        "type":"edit",
        "ui": "web",
        "displayReadonly":true,
        "templates": AlpacaTemplates.handlebars["view_web_edit"],
        "callbacks": callbacks,
        "styles": styles
    });

    Alpaca.registerView({
        "id": "VIEW_WEB_CREATE",
        "parent": 'VIEW_WEB_EDIT',
        "title": "Web Create View",
        "description":"Web create view which doesn't bind initial data.",
        "type":"edit",
        "ui": "web",
        "displayReadonly":false
    });

})(jQuery);