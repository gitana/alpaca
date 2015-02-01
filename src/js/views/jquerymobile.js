/**
 * jQuery Mobile Theme ("mobile")
 *
 * Defines the Alpaca theme for jQuery Mobile.
 *
 * The views are:
 *
 *    jquerymobile-view
 *    jquerymobile-edit
 *    jquerymobile-create
 *
 * This theme can also be selected by specifying the following view:
 *
 *    {
 *       "ui": "jquerymobile",
 *       "type": "view" | ""edit" | "create"
 *    }
 *
 */(function($) {

    var Alpaca = $.alpaca;

    // custom styles
    var styles = {};
    styles["button"] = "";
    styles["smallButton"] = "";
    styles["addIcon"] = "ui-icon-plus ui-btn-icon-left alpaca-jqm-icon";
    styles["removeIcon"] = "ui-icon-minus ui-btn-icon-left alpaca-jqm-icon";
    styles["upIcon"] = "ui-icon-carat-u ui-btn-icon-left alpaca-jqm-icon";
    styles["downIcon"] = "ui-icon-carat-d ui-btn-icon-left alpaca-jqm-icon";
    styles["expandedIcon"] = "ui-icon-carat-r ui-btn-icon-left alpaca-jqm-icon";
    styles["collapsedIcon"] = "ui-icon-carat-d ui-btn-icon-left alpaca-jqm-icon";

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
        "id": "jquerymobile-display",
        "parent": "web-display",
        "type": "display",
        "ui":"jquerymobile",
        "title": "Display view using jQuery Mobile",
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
        "templates": {}
    });

    Alpaca.registerView({
        "id": "jquerymobile-display-horizontal",
        "parent": "jquerymobile-display",
        "horizontal": true
    });

    Alpaca.registerView({
        "id": "jquerymobile-edit",
        "parent": "web-edit",
        "type": "edit",
        "ui": "jquerymobile",
        "title": "Edit View for jQuery Mobile",
        "callbacks": callbacks,
        "styles": styles,
        //"legendStyle": "link",
        //"toolbarStyle": "link",
        //"buttonType": "link",
        //"toolbarSticky": true,
        "templates": {},
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

    Alpaca.registerView({
        "id": "jquerymobile-edit-horizontal",
        "parent": "jquerymobile-edit",
        "horizontal": true
    });

    var refreshPageForField = function(fieldEl)
    {
        // find the data-role="page" and refresh it
        var el = fieldEl;
        if (el)
        {
            while (el.attr("data-role") !== "page")
            {
                el = el.parent();
            }

            $(el).trigger('create');
        }
    };

    Alpaca.registerView({
        "id": "jquerymobile-create",
        "parent": "jquerymobile-edit",
        "type": "create",
        "title": "Create view for jQuery Mobile",
        "displayReadonly": false
    });



})(jQuery);