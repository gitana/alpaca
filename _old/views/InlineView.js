/*jshint -W014 */ // bad line breaking
(function($) {
    
    var Alpaca = $.alpaca;
    
    Alpaca.registerView({
        "id":"VIEW_WEB_EDIT_INLINE",
        "parent":"VIEW_WEB_EDIT",
        "title":"Default Web Edit with fields inlining capabilities",
        "description":"Edit template with form fields inlining capabilities, via options.inline level to display some forms parts inline. Useful to display for example an ArrayField containing ObjectField items in a compact manner.",
        "type":"edit",
        "platform":"web",
        "style":"jquery-ui",
        "displayReadonly":true,
        "templates": {
            "fieldSetOuterEl": '<fieldset class="{{if options.inline}}alpaca-inline{{/if}}">{{html this.html}}</fieldset>',
            "fieldSetItemContainer": '<div class="alpaca-inline-item-container"></div>',            
            "arrayItemToolbar": '<div class="alpaca-fieldset-array-item-toolbar" data-role="controlgroup" data-type="horizontal" data-mini="true">'
                +'<span class="alpaca-fieldset-array-item-toolbar-add" data-role="button" data-icon="add" data-iconpos="notext">Add</span>'
                +'<span class="alpaca-fieldset-array-item-toolbar-remove" data-role="button" data-icon="delete" data-iconpos="notext">Delete</span>'
                +'<span class="alpaca-fieldset-array-item-toolbar-up" data-role="button" data-icon="arrow-u" data-iconpos="notext">Up</span>'
                +'<span class="alpaca-fieldset-array-item-toolbar-down" data-role="button" data-icon="arrow-d" data-iconpos="notext">Down</span></div>'
        }
    });
})(jQuery);