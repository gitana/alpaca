---
layout: documentation-field
title: Option Tree Field
header: Option Tree Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```optiontree``` field.

<!-- INCLUDE_API_DOCS: optiontree -->

The <code>optiontree</code> field provides a text entry field with optional selectors that serve to lead the user down
a selection path to a value.  The field is useful in scenarios where a user must provide information that they may
not have at hand.  The selectors provide the user with an ability to narrow down their criteria until they arrive
at the result.

This field is essentially a composite field in that it allows you to wire together multiple sub-fields to serve as
the selectors.  These include drop-down lists, checkbox selectors and anything else you elect to wire in.  The only
requirement is that the selector fields must return scalar (non-object, non-array) values.

This field takes in a configuration object that describes:

- ```options``` - the field configuration for selectors
- ```order``` - the order of option fields
- ```data``` - the data attributes and value

The field sorts through the data and handles the creation and display of sub-fields as the user clicks and changes
values.

## Example 1
This example asks a user what number they would like on the sports jersey.  They're always able to just type in a
value.  Here, we provide a sequence of dropdowns to let them select a sport, team and athlete.  The jersey number
is then automatically filled in.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "schema": {
        "type": "number",
        "title": "What number would like for your sports jersey?"
    },
    "options": {
        "type": "optiontree",
        "tree": {
            "selectors": {
                "sport": {
                    "schema": {
                        "type": "string"
                    },
                    "options": {
                        "type": "select",
                        "noneLabel": "Pick a Sport..."
                    }
                },
                "team": {
                    "schema": {
                        "type": "string"
                    },
                    "options": {
                        "type": "select",
                        "noneLabel": "Pick a Team..."
                    }
                },
                "player": {
                    "schema": {
                        "type": "string"
                    },
                    "options": {
                        "type": "select",
                        "noneLabel": "Pick a Player..."
                    }
                }
            },
            "order": ["sport", "team", "player"],
            "data": [{
                "value": 23,
                "attributes": {
                    "sport": "Basketball",
                    "team": "Chicago Bulls",
                    "player": "Michael Jordan"
                }
            }, {
                "value": 33,
                "attributes": {
                    "sport": "Basketball",
                    "team": "Chicago Bulls",
                    "player": "Scotty Pippen"
                }
            }, {
                "value": 4,
                "attributes": {
                    "sport": "Football",
                    "team": "Green Bay Packers",
                    "player": "Brett Favre"
                }
            }, {
                "value": 19,
                "attributes": {
                    "sport": "Baseball",
                    "team": "Milwaukee Brewers",
                    "player": "Robin Yount"
                }
            }, {
                "value": 99,
                "attributes": {
                    "sport": "Hockey",
                    "player": "Wayne Gretzky"
                }
            }],
            "horizontal": true
        },
        "form": {
            "buttons": {
                "submit": {
                    "click": function() {
                        alert("Value is: " + this.getValue());
                    }
                }
            }
        }
    }
});
</script>
{% endraw %}

## Example 2
This example produces the same form but uses a connector to load the schema and options.  The options JSON is loaded and
merged with some inline options that provide to override a submit click handler.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "schemaSource": "../../data/optiontree-custom-schema.json",
    "optionsSource": "../../data/optiontree-custom-options.json",
    "options": {
        "form": {
            "buttons": {
                "submit": {
                    "click": function() {
                        alert("Value is: " + this.getValue());
                    }
                }
            }
        }
    }
});
</script>
{% endraw %}

