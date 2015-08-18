---
layout: documentation-api
title: Dependencies
header: Dependencies
group: navigation
tags: field
---
{% include JB/setup %}

JSON Schema provides support for dependencies as a means for describing dependencies between fields.  Using
dependencies, you can establish that <code>property2</code> should be supplied when <code>property1</code> is supplied.

Alpaca supports both JSON Schema v3 and v4 syntax for declaring dependencies.  We recommend using JSON Schema v4 syntax.

In JSON Schema v4, a single <code>dependencies</code> block within the container object stores key/values which consist
of the ID of the property (key) and an array of property IDs that must be in provided in order to be shown (value).

Here is an example with two properties (<code>a</code> and <code>b</code>).  Property B should only be shown when
Property A has been supplied.

````
    ...,
    "properties": {
        "a": {
            "type": "string"
        },
        "b": {
            "type": "string"
        }
    },
    "dependencies": {
        "b": ["a"]
    }
````

In JSON Schema v3, each property has it's own dependencies array.  This simply identifies the sibling properties that
must be included for this property to be shown.  Here is the same example with this legacy V3 structure.

````
    ...,
    "properties": {
        "a": {
            "type": "string"
        },
        "b": {
            "type": "string",
            "dependencies": ["a"]
        }
    }
````

All of the examples below use the V4 syntax.  We recommend this for everything that you do!

If you're interested in more powerful dependency management, take a look at
<a href="conditional-dependencies.html">Conditional Dependencies</a> which offer an Alpaca extension on top of
JSON schema to give you a bit more power.

And finally, if you really need to take full control, Alpaca offers programmatic ways to manage your dependencies.
Please take a look at <a href="observables.html">Observables</a> for examples of tying field state together to
make you forms more dynamic.

## A Really Simple Case

This example shows how to set up a single dependent field.  The <code>icecream</code>
field only renders when the user specifies that they are a lover of ice cream.

This also wraps a form.  When you hit submit, the JSON is printed for you.

<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": {},
    "schema": {
        "title": "Survey",
        "description": "Please participate in our survey",
        "type": "object",
        "properties": {
            "fan": {
                "title": "Are you an Ice Cream fanatic?",
                "type": "boolean"
            },
            "icecream": {
                "title": "What is your Favorite Ice Cream?",
                "type": "String",
                "enum": ["Vanilla", "Chocolate", "Coffee", "Strawberry", "Mint"]
            }
        },
        "dependencies": {
            "icecream": "fan"
        }
    },
    "options": {
        "fields": {
            "fan": {
                "rightLabel": "Why yes, I am..."
            }
        },
        "form": {
            "buttons": {
                "submit": {
                    "click": function() {
                        alert(JSON.stringify(this.getValue(), null, "  "));
                    }
                }
            }
        }
    }
});
</script>
{% endraw %}


## Layered Dependencies

This example introduces a second dependency.  If the user specifies the flavour of ice
cream they prefer, they are then additionally asked for the kind of topping they would prefer.
This demonstrates chained-dependencies.  By unselecting the first check box, all downstream
dependent fields are hidden and removed.

<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": {},
    "schema": {
        "title": "Survey",
        "description": "Please participate in our survey",
        "type": "object",
        "properties": {
            "fan": {
                "title": "Are you an Ice Cream fanatic?",
                "type": "boolean"
            },
            "icecream": {
                "title": "I see... so what is your favorite flavor?",
                "type": "String",
                "enum": ["Vanilla", "Chocolate", "Coffee", "Strawberry", "Mint"]
            },
            "topping": {
                "title": "Ah... and what is your favorite topping?",
                "type": "String",
                "enum": ["Marshmellow", "Chocolate Chip", "Caramel", "Cookie Dough"]
            }
        },
        "dependencies": {
            "icecream": ["fan"],
            "topping": ["icecream"]
        }
    },
    "options": {
        "fields": {
            "fan": {
                "rightLabel": "Why yes, I am..."
            }
        }
    }
});
</script>
{% endraw %}

## An Example of V3 syntax

Here is an example using the V3 syntax.  It's provided here for legacy purposes.

<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "schema": {
        "title": "Survey",
        "description": "Please participate in our survey",
        "type": "object",
        "properties": {
            "fan": {
                "title": "Are you an Ice Cream fanatic?",
                "type": "boolean"
            },
            "icecream": {
                "title": "What is your Favorite Ice Cream?",
                "type": "String",
                "enum": ["Vanilla", "Chocolate", "Coffee", "Strawberry", "Mint"],
                "dependencies": ["fan"]
            }
        }
    },
    "options": {
        "fields": {
            "fan": {
                "rightLabel": "Why yes, I am..."
            }
        },
        "form": {
            "buttons": {
                "submit": {
                    "click": function() {
                        alert(JSON.stringify(this.getValue(), null, "  "));
                    }
                }
            }
        }
    }
});
</script>
{% endraw %}