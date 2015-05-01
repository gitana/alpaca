---
layout: documentation-api
title: Recursive References
header: Recursive References
group: navigation
tags: field
---
{% include JB/setup %}

Alpaca tracks references when looking up schema and options information so as to avoid circular loops.  A circular
loop happens when a child schema points back to a parent schema.  If the reference is a hard reference (meaning that
Alpaca must resolve a schema before it can proceed with rendering), then process of resolving the total document
schema will never complete.

One example of a circular reference might be a <code>box</code> object with a property called <code>contains</code>.
The <code>contains</code> property references another </code>box</code>.  If Alpaca attempts to render the form for
this, each box field will have another box field inside of it... and so on.  The form size is unlimited since you
have infinite nesting of form elements.

Alpaca will catch these kinds of references and raise an error.

JSON Schema itself isn't clear about how to handle these kinds of circular references.  That said, JSON itself
allows for many different scalar values and only two container types - <code>array</code> and <code>object</code>.
These containers are similar but vary in one very interesting property.  The empty value of an array is
<code>[]</code> and the empty value of an object is <code>{}</code>.  The former does the not require the rendering
of any nested field whereas the latter, even though it is empty, is still assumed to be a valid value for
an object field.  This means that in the former case, Alpaca can stop rendering whereas in the latter case, Alpaca
must continue.

In other words, an object reference is a hard reference.  It requires Alpaca to resolve it's referenced type before
it can proceed.

# Using Arrays to model recursive references

One solution to this problem is to utilize an Array to model the recursive reference instead of an object.  Using an
array allows an empty array to cease rendering and delays the schema and option lookup until a later point when
something is actually added to the array.

Here is an example of a form that lets you define fields for rendering on the page.  The top-level form lets you plug
in an array of fields.  Each field is a definition that is referenced.  The field, in turn, lets you add sub-fields
which reference the same field definition.

The trick here is that we use an array to model the recursive reference.  We also use some schema and options magic
to limit the array to size 1 and toggle the stickiness of the toolbars.  Click on the Show JSON button to see the
resulting JSON.

<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "type": "create",
    "schema": {
        "title": "Define your New Form",
        "type": "object",
        "definitions": {
            "form_field": {
                "type": "object",
                "properties": {
                    "field_name": {
                        "title": "Name",
                        "type": "string",
                        "required": true
                    },
                    "field_title": {
                        "title": "Title",
                        "type": "string",
                        "required": true
                    },
                    "field_type": {
                        "title": "Type",
                        "type": "string",
                        "enum": ["Text", "Textarea", "Date", "Single Checkbox", "Checkboxes", "Radio", "Dropdown", "Array", "Object"],
                        "required": true
                    },
                    "object_fields": {
                        "type": "array",
                        "title": "Object Fields",
                        "dependencies": "field_type",
                        "items": {
                            "$ref": "#/definitions/form_field"
                        },
                        "maxItems": 1,
                        "minItems": 1
                    },
                    "array_fields": {
                        "type": "array",
                        "title": "Array Fields",
                        "dependencies": "field_type",
                        "items": {
                            "$ref": "#/definitions/form_field"
                        }
                    }
                }
            }
        },
        "properties": {
            "form_title": {
                "title": "Form Title",
                "type": "string",
                "required": true
            },
            "form_description": {
                "title": "Description",
                "type": "string"
            },
            "form_fields": {
                "type": "array",
                "title": "Fields",
                "items": {
                    "$ref": "#/definitions/form_field"
                }
            }
        }
    },
    "options": {
        "definitions": {
            "form_field": {
                "fields": {
                    "object_fields": {
                        "dependencies": {
                            "field_type": "Object"
                        },
                        "toolbarSticky": false
                    },
                    "array_fields": {
                        "dependencies": {
                            "field_type": "Array"
                        },
                        "toolbarSticky": true
                    }
                }
            }
        },
        "fields": {
            "form_fields": {
                "items": {
                    "$ref": "#/definitions/form_field"
                },
                "toolbarSticky": true
            }
        },
        "focus": true,
        "form": {
            "buttons": {
                "show": {
                    "title": "Show JSON",
                    "click": function() {
                        alert("aha: " + JSON.stringify(this.getValue(), null, "  "));
                    }
                }
            }
        }
    }
});
</script>
{% endraw %}
