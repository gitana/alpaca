/**
 * jQuery Mobile Theme ("mobile")
 *
 * Defines the Alpaca theme for jQuery Mobile.
 *
 * The views are:
 *
 *    VIEW_JQUERYMOBILE_DISPLAY
 *    VIEW_JQUERYMOBILE_EDIT
 *    VIEW_JQUERYMOBILE_CREATE
 *
 * This theme can also be selected by specifying the following view:
 *
 *    {
 *       "ui": "jquerymobile",
 *       "type": null | "create" | "edit" | "display"
 *    }
 *
 */(function($) {

    var Alpaca = $.alpaca;

    // custom styles
    var styles = {};

    // custom callbacks
    var callbacks = {};
    callbacks["container"] = function()
    {
        var containerElem = this.getContainerEl();

        var el = containerElem.find("[data-role='fieldcontain']");
        if (el.fieldcontain)
        {
            el.fieldcontain();
            el.find("[type='radio'], [type='checkbox']").checkboxradio();
            el.find("button, [data-role='button'], [type='button'], [type='submit'], [type='reset'], [type='image']").not(".ui-nojs").button();
            el.find("input, textarea").not("[type='radio'], [type='checkbox'], button, [type='button'], [type='submit'], [type='reset'], [type='image']").textinput();
            el.find("input, select").filter("[data-role='slider'], [data-type='range']").slider();
            el.find("select:not([data-role='slider'])").selectmenu();
            containerElem.find('[data-role="button"]').buttonMarkup();
            containerElem.find('[data-role="controlgroup"]').controlgroup();
        }
    };

    Alpaca.registerView({
        "id": "VIEW_JQUERYMOBILE_DISPLAY",
        "parent": "VIEW_WEB_DISPLAY",
        "title": "Display view using jQuery Mobile",
        "description": "Display view using JQuery Mobile",
        "type": "view",
        "ui":"jquerymobile",
        "callbacks": callbacks,
        "styles": styles,
        //"legendStyle": "link",
        //"toolbarStyle": "link",
        //"buttonType": "link",
        "messages": {
            required: "Required Field",
            invalid: "Invalid Field"
        },
        "render": function(field, renderedCallback) {

            var self = this;

            field.render(field.view, function(field) {

                refreshPageForField(field.getFieldEl());

                if (renderedCallback) {
                    renderedCallback.call(self, field);
                }
            });

        },
        "templates": AlpacaTemplates.handlebars["view_jquerymobile_display"],
    });

    Alpaca.registerView({
        "id": "VIEW_JQUERYMOBILE_EDIT",
        "parent": "VIEW_WEB_EDIT",
        "title": "Edit View for jQuery Mobile",
        "description": "Edit view using JQuery Mobile",
        "type": "edit",
        "ui": "jquerymobile",
        "callbacks": callbacks,
        "styles": styles,
        //"legendStyle": "link",
        //"toolbarStyle": "link",
        //"buttonType": "link",
        //"toolbarSticky": true,
        "templates": AlpacaTemplates.handlebars["view_jquerymobile_edit"],
        "messages": {
            required: "Required Field",
            invalid: "Invalid Field"
        },
        "render": function(field, renderedCallback) {

            var self = this;

            field.render(function(field) {

                refreshPageForField(field.getFieldEl());

                if (renderedCallback) {
                    renderedCallback.call(self, field);
                }
            });
        }
    });

    var refreshPageForField = function(fieldEl)
    {
        // find the data-role="page" and refresh it
        var el = fieldEl;
        while (!Util.isEmpty(el) && el.attr("data-role") !== "page")
        {
            el = el.parent();
        }
        if (!Util.isEmpty(el)) {
            $(el).trigger('pagecreate');
        }
    };

    Alpaca.registerView({
        "id": "VIEW_MOBILE_CREATE",
        "parent": "VIEW_MOBILE_EDIT",
        "title": "Default Mobile Create View",
        "description": "Default mobile create view which doesn't bind initial data.",
        "displayReadonly": false,
        "type": "create"
    });

})(jQuery);