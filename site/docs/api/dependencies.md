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

Each property in your JSON Schema can have an option <code>dependencies</code> property which is either a string
identifying a single property on which to depend or an array of multiple properties on which to depend.

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
                "enum": ["Vanilla", "Chocolate", "Coffee", "Strawberry", "Mint"],
                "dependencies": "fan"
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
                "enum": ["Vanilla", "Chocolate", "Coffee", "Strawberry", "Mint"],
                "dependencies": "fan"
            },
            "topping": {
                "title": "Ah... and what is your favorite topping?",
                "type": "String",
                "enum": ["Marshmellow", "Chocolate Chip", "Caramel", "Cookie Dough"],
                "dependencies": ["icecream"]
            }
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
