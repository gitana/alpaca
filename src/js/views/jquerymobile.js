/**
 * jQuery Mobile Theme ("mobile")
 *
 * Defines the Alpaca theme for jQuery Mobile.
 *
 * The style injector:
 *
 *    mobile
 *
 * The views are:
 *
 *    VIEW_MOBILE_DISPLAY
 *    VIEW_MOBILE_EDIT
 *    VIEW_MOBILE_CREATE
 *
 * This theme can also be selected by specifying the following view:
 *
 *    {
 *       "ui": "mobile",
 *       "type": null | "create" | "edit" | "display"
 *    }
 *
 */(function($) {

    var Alpaca = $.alpaca;

    Alpaca.styleInjections["jquery-mobile"] = {
        "array" : function(containerElem) {
            if (containerElem) {
                if (containerElem.find('[data-role="fieldcontain"]').fieldcontain) {
                    containerElem.find('[data-role="fieldcontain"]').fieldcontain();
                    containerElem.find('[data-role="fieldcontain"]').find("[type='radio'], [type='checkbox']").checkboxradio();
                    containerElem.find('[data-role="fieldcontain"]').find("button, [data-role='button'], [type='button'], [type='submit'], [type='reset'], [type='image']").not(".ui-nojs").button();
                    containerElem.find('[data-role="fieldcontain"]').find("input, textarea").not("[type='radio'], [type='checkbox'], button, [type='button'], [type='submit'], [type='reset'], [type='image']").textinput();
                    containerElem.find('[data-role="fieldcontain"]').find("input, select").filter("[data-role='slider'], [data-type='range']").slider();
                    containerElem.find('[data-role="fieldcontain"]').find("select:not([data-role='slider'])").selectmenu();
                    containerElem.find('[data-role="button"]').buttonMarkup();
                    containerElem.find('[data-role="controlgroup"]').controlgroup();
                }

            }
        }
    };

    Alpaca.registerView({
        "id": "VIEW_MOBILE_DISPLAY",
        "parent": "VIEW_WEB_DISPLAY",
        "title": "Mobile DISPLAY View",
        "description": "Mobile display view using JQuery Mobile Library",
        "type": "view",
        "platform":"mobile",
        "style":"jquery-mobile",
        "ui":"mobile",
        "legendStyle": "link",
        "toolbarStyle": "link",
        "buttonType": "link",
        "templates": AlpacaTemplates.handlebars["view_jquerymobile_display"],
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

        }
    });

    Alpaca.registerView({
        "id": "VIEW_MOBILE_EDIT",
        "parent": "VIEW_WEB_EDIT",
        "title": "Mobile Edit View",
        "description": "Mobile edit view using JQuery Mobile Library",
        "type": "edit",
        "platform":"mobile",
        "style":"jquery-mobile",
        "ui":"mobile",
        "legendStyle": "link",
        "toolbarStyle": "link",
        "buttonType": "link",
        "toolbarSticky": true,
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
        "type": "create",
        "displayReadonly": false
    });

})(jQuery);