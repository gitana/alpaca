(function($) {

    var Alpaca = $.alpaca;

    Alpaca.registerView({
        "id": "VIEW_WEB_DISPLAY",
        "parent": "VIEW_BASE",
        "title": "Default Web Display View",
        "description":"Default web edit view which goes though field hierarchy.",
        "type": "view",
        "platform":"web",
        "displayReadonly":true,
        "templates": AlpacaTemplates.handlebars["view_web_display"]
    });

    Alpaca.registerView({
        "id":"VIEW_WEB_EDIT",
        "parent": "VIEW_BASE",
        "title":"Default Web Edit View",
        "description":"Default web edit view which goes though field hierarchy.",
        "type":"edit",
        "platform": "web",
        "displayReadonly":true,
        "templates": AlpacaTemplates.handlebars["view_web_edit"]
    });

    Alpaca.registerView({
        "id": "VIEW_WEB_CREATE",
        "parent": 'VIEW_WEB_EDIT',
        "title": "Default Web Create View",
        "description":"Default web create view which doesn't bind initial data.",
        "type": "create",
        "displayReadonly":false
    });

})(jQuery);