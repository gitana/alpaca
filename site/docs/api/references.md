---
layout: documentation-api
title: References
header: References
group: navigation
tags: field
---
{% include JB/setup %}

This page shows examples of using JSON schema <code>$ref</code> markup to reference
definitions and other structures within your JSON schema definition to generate
more complex and nested schema documents.

The `$ref` convention used by Alpaca builds on top of JSON schema and allows for the `$ref` value
to identify a URI to a remote resource.  It also allows you to point to JSON structures within the
current document, enabling re-use.

Alpaca extends `$ref` by allowing for additional loaders such as a dictionary definition loader for Cloud CMS.
Alapca lets you register <a href="/documentation/connectors.html">Connectors</a> to handle loading of your custom
`$ref` values.

Alpaca also lets you use `$ref` structures within your options blocks.  This lets you load options from remote sources
and reuse configuration across your forms.

By default, if Alpaca encounters a `$ref` in your schema, it look to see if there is a corresponding `$ref` in your
options.  That is, unless you provide a specific `$ref` in your options for the same block, in which case it will use
that instead.


## Example #1: Nested Tree (using Array)

This example demonstrates the use of JSON Schema referencing to include or pull in
schema definitions from other parts of the document.  Alpaca supports referencing within
the same document using simple ids.

In this example, we allow the end user to create a tree structure of repeated leaf
elements that can be nested as many levels deep as they wish.

<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "type": "create",
    "schema": {
        "id": "#leaf",
        "type": "object",
        "properties": {
            "title": {
                "type": "string",
                "title": "Name",
                "required": true
            },
            "children": {
                "type": "array",
                "items": {
                    "$ref": "#leaf"
                }
            }
        }
    }
});
</script>
{% endraw %}


## Example #2: Deeply Nested Tree (loaded from data)

This example shows a deeply nested tree loaded with data.  Note that unlike the previous
example, this example uses a non-'create' view which allows data to bind.

<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": [{
        "title": "Node 1.1",
        "children": [{
            "title": "Node 2.1",
            "children": [{
                "title": "Node 3.1",
                "children": [{
                    "title": "Node 4.1"
                }]
            }, {
                "title": "Node 3.2"
            }]
        }]
    }],
    "schema": {
        "type": "array",
        "items": {
            "type": "object",
            "id": "#leaf",
            "properties": {
                "title": {
                    "type": "string",
                    "required": true,
                    "title": "Title"
                },
                "children": {
                    "type": "array",
                    "items": {
                        "$ref": "#leaf"
                    }
                }
            }
        }
    },
    "options": {
        "toolbarSticky": true
    }
});
</script>
{% endraw %}


## Example #3: Internal Definitions

Here is an example of an object that derives one of its sub-object
properties from a referenced definition.  The definition is stored in a special
<code>definitions</code> sub-object of the schema.  This definitions sub-object
anticipates support for JSON Schema v4.

<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "type": "create",
    "schema": {
        "type": "object",
        "properties": {
            "title": {
                "type": "string",
                "title": "Name",
                "required": true
            },
            "info": {
                "$ref": "#/definitions/info"
            }
        },
        "definitions": {
            "info": {
                "type": "object",
                "title": "Additional Information",
                "properties": {
                    "author": {
                        "type": "string",
                        "title": "Author"
                    },
                    "review": {
                        "type": "string",
                        "enum": [
                            "Good",
                            "Bad",
                            "Ugly"
                        ],
                        "default": "Good"
                    }
                }
            }
        }
    }
});
</script>
{% endraw %}


## Example #4: Using `$ref` within options

Suppose that you have a remote Author schema and options and that their URIs are:

- <a href="/data/author-schema.json">/data/author-schema.json</a>
- <a href="/data/author-options.json">/data/author-options.json</a>
    
Let's define an article that reuses the Author schema and options via `$ref` like this:

<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field4").alpaca({
    "type": "create",
    "schema": {
        "type": "object",
        "properties": {
            "title": {
                "type": "string",
                "title": "Title"
            },
            "body": {
                "type": "string",
                "title": "Body"
            },
            "author": {
                "$ref": "/data/author-schema.json"
            }
        }
    },
    "options": {
        "fields": {
            "body": {
                "type": "ckeditor"
            },
            "author": {
                "$ref": "/data/author-options.json"
            }
        }
    }
});
</script>
{% endraw %}