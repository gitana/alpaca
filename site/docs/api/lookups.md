---
layout: documentation-api
title: Lookups
header: Lookups
group: navigation
tags: field
---
{% include JB/setup %}

Alpaca provides abstractions for forms, fields, connectors and other types so as to provide a consistent and easy-to-use
interface.  This interface lets you find other objects in the JSON structure and plug in function handlers that
make decisions by drawing from values of other fields.

Every field that renders fundamentally receives an <code>ID</code>.  The ID is a dynamically assigned value of no particular
significance other than that it is unique.  Typically, it is something like <code>alpaca123</code>.  Each field or
element that Alpaca renders will utilize this ID to ensure a unique method of look up.

In addition to this ID, every field maintains a <code>name</code> and a <code>path</code>.  The name is either a
JSON schema property ID (the key for a property) or a JSON array index (for items).  The path is a human readable
path into a JSON data element.

For example, suppose you have this JSON data:

````
{
    "author": {
        "firstName": "Joe",
        "lastName": "Smith",
        "grants": [{
            "id": "read",
            "expiration": "1234567890"
        }, {
            "id": "write",
            "expiration": "1234567890"
        }]
    }
}
````

The author's first name can be referenced with a path like this:

    author/firstName

The "write" grant expiration time can be referenced like this:

    author/grants[1]/expiration

## Lookup within postRender callback

You can look up fields in the rendered Alpaca form using either the ID, the name (property ID) or the path.  Typically,
this is done within a <code>postRender</code> callback:

Here is a pseudo-example that uses a quick and dirty schema for our whack-daddy example from above:

````
$(domEl).alpaca({
    schema: {
        "type": "object",
        "properties": {
            "author": {
                "type": "object",
                "properties": {
                    "firstName": {
                        "type": "string"
                    },
                    "lastName": {
                        "type": "string"
                    },
                    "grants": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "id": {
                                    "type": "string"
                                },
                                "expiration": {
                                    "type": "number"
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    postRender: function(field) {

        // DO SOMETHING AWESOME HERE

    }
});
````

In the <code>postRender</code> callback, we get the field instance.  This is the top-level field.  In the schema above,
the top-level field is an object.  Objects and Arrays are Containers in Alpaca and they allow us to do any of the
following:

1.  Get the author's first name field using the Alpaca ID

````
var authorFirstNameField = field.childrenById["alpaca123"]
````

2.  Get the author's first name field by walking property IDs:

````
var authorFirstNameField = field.childrenByPropertyId["author"].childrenByPropertyId["firstName"]
````

3.  Get the author's first name field using the path:

````
var authorFirstNameField = field.getControlByPath("author/firstName");
````

If you have a reference to a field that isn't the top-most field, you can get to the top-most field by using the
<code>top()</code> function like this:

````
var authorFirstNameField = grantsArrayField.top().getControlByPath("author/firstName");
````

## Lookup using Static Map

Alpaca also maintains a static map of all of the fields that it renders.  As such, once Alpaca has rendered, so long
as you have access to the same root <code>Alpaca</code> object, you can do things like this:

````
var authorFirstNameField = Alpaca.fieldInstances["alpaca123"];
````

If you need to look up by path or property ID using a similar static approach, you're out of luck.  Instead, you should
probably focus on modularizing your code so that references to fields are collected and worked with within the callback
handler.

## DOM Elements

Alpaca marks some of these properties into the DOM for you:

- <code>data-alpaca-field-id</code> gets the Alpaca field ID
- <code>data-alpaca-field-name</code> gets the Alpaca field property ID
- <code>data-alpaca-field-path</code> gets the Alpaca field path

Note that the top-most field will not have the <code>data-alpaca-field-name</code> attribute.
