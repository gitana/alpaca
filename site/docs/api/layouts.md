---
layout: documentation-api
title: Layouts
header: Layouts
group: navigation
tags: field
---
{% include JB/setup %}

 Alpaca features both automatic and layout-driven mechanisms for placing your fields onto a page.
 The automatic mechanism simply walks through your fields in the order they are expressed in schema and places them
 one by one in a stacked order.  The layout-driven mechanism allows you to provide a layout template that finely
 describes where your fields should be placed using DOM-driven injection.

 To use a layout, you simply need to provide a view that has a <code>layout</code> block.  The <code>layout</code>
 block defines the HTML template to use and then optionally defines the bindings of fields into sections of the HTML.

 The layout block requires a <code>template</code> value to identify the HTML template that will render the fields.
 The template is a Handlebars template, generally, though Alpaca supports custom rendering engines if you choose to
 use one.  The template has access to the <code>schema</code>, <code>options</code> and other parameters if you need
 them for any rendering purpose.

 An optional <code>bindings</code> block can be supplied which provides key/value mappings of field IDs to DOM elements.
 The field IDs are the keys and a CSS selector is the value.  The CSS selector must resolve down to a single DOM
 element otherwise you will get some weird behavior.

 If a <code>bindings</code> block is not provided, Alpaca supports looking up exact field matches within the template
 using the <code>data-alpaca-layout-binding</code> attribute where the value is the name of the field.


## Explicit Bindings Example

Here is an example of a form with two fields that uses a custom layout with explicit bindings.  The layout
renders fields into an HTML TABLE.
The layout file is <a href="./layouts-example1-template.html">layouts-example1-template.html</a>.

Note that the <code>bindings</code> property of that layout allocates the fields to the right place inside of the
layout.

<div id="field1"></div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "schema": {
        "type": "object",
        "properties": {
            "firstName": {
                "type": "string",
                "title": "First Name"
            },
            "lastName": {
                "type": "string",
                "title": "Last Name"
            }
        }
    },
    "view": {
        "parent": "bootstrap-edit",
        "layout": {
            "template": './layouts-example1-template.html',
            "bindings": {
                "firstName": "#left",
                "lastName": "#right"
            }
        }
    }
});
</script>
{% endraw %}


## Customer Profile Example

Here is a more elaborate exmaple with a more complex set of data.  The concept is the same.  We use explicit
bindings via the <code>bindings</code> property of the layout.  The layout here is a bit more interesting as it
employs some Handlebars directives to work with the <code>options</code> context.

The layout file is <a href="./layouts-example2-template.html">layouts-example2-template.html</a> and is used to
render a Bootstrap two-column layout.

<div id="field2"></div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "dataSource": "/data/customer-profile-data.json",
    "schemaSource": "/data/customer-profile-schema.json",
    "optionsSource": "/data/customer-profile-options.json",
    "view": {
        "parent": "bootstrap-edit-horizontal",
        "layout": {
            "template": './layouts-example2-template.html',
            "bindings": {
                "name": "#left",
                "age": "#left",
                "gender": "#left",
                "member": "#left",
                "photo": "#left",
                "phone": "#left",
                "icecream": "#left",
                "address": "#right"
            }
        }
    }
});</script>
{% endraw %}


## Layout-driven bindings

We can also let the layout explicitly tell us where it wants things to be placed.  This is a more rigid approach
but one that is useful if you have complex forms and want to take further control of the layout.

The <code>data-alpaca-layout-binding</code> attributes within the layout determine where fields are placed.

<div id="field3"></div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "dataSource": "/data/customer-profile-data.json",
    "schemaSource": "/data/customer-profile-schema.json",
    "optionsSource": "/data/customer-profile-options.json",
    "view": {
        "parent": "bootstrap-edit-horizontal",
        "layout": {
            "template": './layouts-example3-template.html'
        }
    }
});</script>
{% endraw %}


## Two-Column Layout with sub-properties

Here is a simple two column layout with sub-properties.  They layout is provided as a string in the config.

<div id="field4"></div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "data": {
        "name": {
            "first": "John",
            "last": "McClane"
        }
    },
    "schema": {
        "type": "object",
        "properties": {
            "name": {
                "type": "object",
                "properties": {
                    "first": {
                        "type": "string"
                    },
                    "last": {
                        "type": "string"
                    }
                }
            },
            "address": {
                "type": "object",
                "properties": {
                    "street": {
                        "type": "string"
                    },
                    "city": {
                        "type": "string"
                    },
                    "state": {
                        "type": "string"
                    }
                }
            },
            "preferences": {
                "type": "object",
                "properties": {
                    "meal": {
                        "type": "boolean"
                    },
                    "hotel": {
                        "type": "boolean"
                    },
                    "taxi": {
                        "type": "boolean"
                    }
                }
            }
        }
    },
    "options": {
        "fields": {
            "name": {
                "label": "Name",
                "fields": {
                    "first": {
                        "label": "First Name",
                        "type": "text"
                    },
                    "last": {
                        "label": "Last Name",
                        "type": "text"
                    }
                }
            },
            "address": {
                "label": "Address",
                "fields": {
                    "street": {
                        "label": "First Name",
                        "type": "text"
                    },
                    "city": {
                        "label": "City",
                        "type": "text"
                    },
                    "state": {
                        "label": "State",
                        "type": "state"
                    }
                }
            },
            "preferences": {
                "label": "Preferences",
                "fields": {
                    "meal": {
                        "rightLabel": "Sign me up for a meal plan",
                        "type": "checkbox"
                    },
                    "hotel": {
                        "rightLabel": "Book a hotel for me",
                        "type": "checkbox"
                    },
                    "taxi": {
                        "rightLabel": "Schedule a taxi for me from the airport",
                        "type": "checkbox"
                    }
                }
            }
        }
    },
    "view": {
        "parent": "bootstrap-edit",
        "layout": {
            "template": "<div class='row'><div class='col-md-6' id='column-1'></div><div class='col-md-6' id='column-2'></div></div>",
            "bindings": {
                "name": "column-1",
                "address": "column-1",
                "preferences": "column-2"
            }
        }
    }
});</script>
{% endraw %}