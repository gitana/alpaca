/*jshint -W014 */ // bad line breaking
(function($) {

    var Alpaca = $.alpaca;

    Alpaca.registerView({
        "id": "VIEW_WEB_EDIT",
        "templates": {
            "twoColumnLayout":'<div class="alpaca-layout-two-column-mask">'
                    + '{{if options.label}}<h3>${options.label}</h3>{{/if}}'
                    + '{{if options.helper}}<h4>${options.helper}</h4>{{/if}}'
                    + '<div class="alpaca-layout-two-column-left alpaca-layout-region"  id="leftcolumn"></div>'
                    + '<div class="alpaca-layout-two-column-right alpaca-layout-region" id="rightcolumn"></div>'
                    + '</div>'
        }
    });

    Alpaca.registerView({
        "id": "VIEW_WEB_EDIT_LAYOUT_TWO_COLUMN",
        "parent": "VIEW_WEB_EDIT",
        "title": "Web Edit View with Two-Column Layout",
        "description": "Web edit default view with two-column layout.",
        "layout" : {
            "template" : "twoColumnLayout"
        }
    });

    Alpaca.registerView({
        "id": "VIEW_WEB_EDIT_LIST_LAYOUT_TWO_COLUMN",
        "parent": "VIEW_WEB_EDIT_LIST",
        "title": "Web List Edit View with Two-Column Layout",
        "description": "Web edit list view with two-column layout.",
        "layout" : {
            "template" : "twoColumnLayout"
        }
    });

})(jQuery);
