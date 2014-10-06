---
layout: demo
title: Multi-Column Layouts
header: Multi-Column Layouts
framework: Twitter Bootstrap
---
{% include JB/setup %}

This page includes demos using a two column layout.

## Two Column Layout

This example defines an inline custom view that extends <code>bootstrapedit-horizontal</code>.
It tells the view to use a specific layout template (<code>two-column-layout-template.html</code>).
The <code>bindings</code> block then tells the view where to place field elements within the template.

The layout template file
(<a href="two-column-layout-template.html" target="_source">two-column-layout-template.html</a>)
has two <code>DIV</code> blocks with IDs <code>leftcolumn</code> and <code>rightcolumn</code>.
The properties are placed into each column as defined by the <code>bindings</code> block.

This example loads <a href="customer-profile-data.json" target="_source">data</a>,
<a href="customer-profile-schema.json" target="_source">schema</a> and
<a href="customer-profile-options.json" target="_source">options</a> parameters through ajax calls.

<div id="field1"></div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "dataSource": "/data/customer-profile-data.json",
    "schemaSource": "/data/customer-profile-schema.json",
    "optionsSource": "/data/customer-profile-options.json",
    "view": {
        "parent": "bootstrap-edit-horizontal",
        "layout": {
            "template": './two-column-layout-template.html',
            "bindings": {
                "name": "leftcolumn",
                "age": "leftcolumn",
                "gender": "leftcolumn",
                "member": "leftcolumn",
                "photo": "leftcolumn",
                "phone": "leftcolumn",
                "icecream": "leftcolumn",
                "address": "rightcolumn"
            }
        }
    }
});
</script>
{% endraw %}


## Three Column Layout

This example provides a three-column layout for properties.  As in Example #1, the layout template is
provided and the fields are bound to specific <code>DIV</code> elements within the layout file using the
<code>bindings</code> properties.

In this case, we provide the template inline (as a string).  We could provide this string as either the
view's <code>layout.template</code> property or as a property of our choosing under <code>templates</code>.

Here we take the latter path.  We define a general purpose view template called <code>threeColumnGridLayout</code>
and then reference it from our view's <code>layout.template</code> property.  The Alpaca view compiler discovers this
and reuses the template.

<div id="field2"></div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "dataSource": "/data/customer-profile-data.json",
    "schemaSource": "/data/customer-profile-schema.json",
    "optionsSource": "/data/customer-profile-options.json",
    "view": {
        "parent": "bootstrap-edit",
        "layout": {
            "template": "threeColumnGridLayout",
            "bindings": {
                "name": "column-1",
                "age": "column-1",
                "gender": "column-2",
                "member": "column-2",
                "photo": "column-2",
                "phone": "column-2",
                "icecream": "column-3",
                "address": "column-3"
            }
        },
        "templates": {
            "threeColumnGridLayout": '<div class="row">'
                    + '{{#if options.label}}<h2>{{options.label}}</h2><span></span>{{/if}}'
                    + '{{#if options.helper}}<p>{{options.helper}}</p>{{/if}}'
                    + '<div id="column-1" class="col-md-6"> </div>'
                    + '<div id="column-2" class="col-md-6"> </div>'
                    + '<div id="column-3" class="col-md-12"> </div>'
                    + '<div class="clear"></div>'
                    + '</div>'
        }
    }
});
</script>
{% endraw %}
