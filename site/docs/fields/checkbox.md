---
layout: documentation-field
title: Checkbox Field
header: Checkbox Field
group: navigation
tags: field
---
{% include JB/setup %}


The ```checkbox``` field.

<!-- INCLUDE_API_DOCS: checkbox -->


## Example 1
Simple checkbox field for boolean data.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": false
});
</script>
{% endraw %}


## Example 2
Checkbox field with both field label and right label.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": true,
    "options": {
        "label": "Question:",
        "rightLabel": "Do you like Alpaca?",
        "form": {
            "buttons": {
                "view": {
                    "label": "View JSON",
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


## Example 3
Simple checkbox field rendered in display-only mode.
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "data": false,
    "view": "bootstrap-display",
    "options": {
        "label": "Registered?"
    }
});
</script>
{% endraw %}


## Example 4
Checkbox Field used for multiple values provided as an array.
<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "data": ["sandwich", "cookie", "drink"],
    "schema": {
        "type": "array",
        "enum": [
            "sandwich",
            "chips",
            "cookie",
            "drink"
        ]
    },
    "options": {
        "type": "checkbox",
        "label": "What would you like with your order?",
        "optionLabels": [
            "A Sandwich",
            "Potato Chips",
            "A Cookie",
            "Soft Drink"
        ]
    }
});
</script>
{% endraw %}


## Example 5
Checkbox Field used for multiple values provided as a comma-delimited string.
We also hook up some form buttons to get at the JSON.  Click the "View JSON" button to see it.
<div id="field5"> </div>
{% raw %}
<script type="text/javascript" id="field5-script">
$("#field5").alpaca({
    "data": "sandwich, cookie, drink",
    "schema": {
        "type": "string",
        "enum": [
            "sandwich",
            "chips",
            "cookie",
            "drink"
        ]
    },
    "options": {
        "type": "checkbox",
        "label": "What would you like with your order?",
        "optionLabels": [
            "A Sandwich",
            "Potato Chips",
            "A Cookie",
            "Soft Drink"
        ],
        "form": {
            "buttons": {
                "view": {
                    "label": "View JSON",
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


## Example 6
Checkbox Field for multiple values with it's selection options loaded from a data source.
<div id="field6"> </div>
{% raw %}
<script type="text/javascript" id="field6-script">
$("#field6").alpaca({
    "data": ["Vanilla", "Chocolate"],    
    "options": {
        "label": "Ice cream",
        "type": "checkbox",
        "multiple": true,
        "dataSource": "/data/icecream-list.json"
    }
});
</script>
{% endraw %}



## Example 7
A checkbox field that uses an enumerated value set on an array to specify the selection options.  This is in accordance
with JSON schema v4.
<div id="field7"> </div>
{% raw %}
<script type="text/javascript" id="field7-script">
$("#field7").alpaca({
    "schema": {
        "type": "object",
        "properties": {
            "checkboxArrayEnum": {
                "type": "array",
                "items": {
                    "type": "string",
                    "enum": [
                        "option1",
                        "option2",
                        "option3"
                    ]
                }
            }
        },
        "required": [
            "checkboxArrayEnum"
        ]
    },
    "options": {
        "fields": {
            "checkboxArrayEnum": {
                "label": "Checkbox Array Enum",
                "type": "checkbox",
                "optionLabels": [
                        "Option #1",
                        "Option #2",
                        "Option #3"
                ]
            }
        },
        "form": {
            "buttons": {
                "view": {
                    "label": "View JSON",
                    "click": function() {
                        alert(JSON.stringify(this.getValue(), null, "  "));
                    }
                }
            }        
        }
    },
    "data": {
        "checkboxArrayEnum": [
            "option1",
            "option3"
        ]
    }
});
</script>
{% endraw %}

## Example 8
Checkbox Field as a dependency
<div id="field8"> </div>
{% raw %}
<script type="text/javascript" id="field8-script">
$("#field8").alpaca({
    "data": {
        "hidememberinfo": true
    },
    "schema": {
        "type": "object",
        "properties": {
            "hidememberinfo": {
                "type": "boolean"
            },
            "level": {
                "type": "string",
                "title": "Membership Level",
                "enum": ["silver", "gold", "platinum"]
            }
        },
        "dependencies": {
            "level": ["hidememberinfo"]
        }
    },
    "options": {
        "fields": {
            "hide": {
                "type": "checkbox",
                "rightLabel": "Hide membership information"
            },
            "level": {
                "optionLabels": ["Silver", "Gold", "Platinum"],
                "dependencies": {
                    "hidememberinfo": false
                }
            }
        }
    }
});
</script>
{% endraw %}

## Example 9
Checkbox Field with custom delimiters
<div id="field9"> </div>
{% raw %}
<script type="text/javascript" id="field9-script">
$("#field9").alpaca({
    "data": "sandwich | cookie | drink",
    "schema": {
        "type": "string",
        "enum": ["sandwich", "chips", "cookie", "drink"]
    },
    "options": {
        "type": "checkbox",
        "label": "What would you like with your order?",
        "optionLabels": ["A Sandwich", "Potato Chips", "A Cookie", "Soft Drink"],
        "form": {
            "buttons": {
                "view": {
                    "label": "View JSON",
                    "click": function() {
                        alert(JSON.stringify(this.getValue(), null, "  "));
                    }
                }
            }
        },
        "split": function(val) {
            return val.split("|");  
        },
        "join": function(vals) {
            return vals.join("|");
        }
    }
});
</script>
{% endraw %}