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


## Example 1
Option Tree field.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "schema": {
        "type": "number",
        "title": "What is your favorite number?"
    },
    "options": {
        "type": "optiontree",
        "tree": {
            "selectors": {
                "sport": {
                    "schema": {
                        "type": "text"
                    },
                    "options": {
                        "label": "Pick a Sport...",
                        "size": 3
                    }
                },
                "team": {
                    "schema": {
                        "type": "text"
                    },
                    "options": {
                        "label": "Pick a Team..."
                    }
                },
                "player": {
                    "schema": {
                        "type": "text"
                    },
                    "options": {
                        "label": "Pick a Player..."
                    }
                }
            },
            "selectorOrder": ["sport", "team", "player"],
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
            }]
        }
    }
});
</script>
{% endraw %}


