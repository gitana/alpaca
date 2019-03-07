---
layout: documentation-field
title: Chooser Field
header: Chooser Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```chooser``` field.

<!-- INCLUDE_API_DOCS: chooser -->


## Example 1
A simple example for a `string` field with enumerated values.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "schema": {
        "type": "string",
        "title": "Select your favorite colors",
        "enum": ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
    },
    "options": {
        "type": "chooser",
        "optionLabels": ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"],
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
    "data": ["red", "yellow", "green"]
});
</script>
{% endraw %}


## Example 2
An example of a string value where enumerated values are loaded from a data source.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "schema": {
        "type": "string",
        "title": "Select your favorite ice cream"
    },
    "options": {
        "type": "chooser",
        "dataSource": "/data/icecream-list.json",
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
An example with `showAllSelections` set to `true`.  This makes it so that the left-hand side always shows all values.
Selected values are grayed out (or disabled).
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "schema": {
        "type": "string",
        "title": "Select your favorite colors",
        "enum": ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
    },
    "options": {
        "type": "chooser",
        "optionLabels": ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"],
        "showAllSelections": true
    },
    "data": ["red", "yellow", "green"]
});
</script>
{% endraw %}

## Example 4
In this example, we set `height` to `90px` which lets you control the amount of vertical screen real estate the control
will use.  This introduces scroll bars for selecting values.
<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "schema": {
        "type": "string",
        "title": "Select your favorite colors",
        "enum": ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
    },
    "options": {
        "type": "chooser",
        "optionLabels": ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"],
        "height": "90px"
    },
    "data": ["red", "yellow", "green"]
});
</script>
{% endraw %}

## Example 5
Here we show how to mount the control on top of an array.
<div id="field5"> </div>
{% raw %}
<script type="text/javascript" id="field5-script">
$("#field5").alpaca({
    "schema": {
        "type": "array",
        "title": "Select your favorite colors",
        "items": {
            "type": "string"
        },
        "enum": ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
    },
    "options": {
        "type": "chooser",
        "optionLabels": ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"],
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
    "data": ["red", "yellow", "green"]
});
</script>
{% endraw %}

## Example 6
Here we include buttons to enable and disable the control.
<div id="field6"> </div>
{% raw %}
<script type="text/javascript" id="field6-script">
$("#field6").alpaca({
    "schema": {
        "type": "array",
        "title": "Select your favorite colors",
        "items": {
            "type": "string"
        },
        "enum": ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
    },
    "options": {
        "type": "chooser",
        "optionLabels": ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"],
        "form": {
            "buttons": {
                "enable": {
                    "label": "Enable",
                    "click": function() {
                        this.enable();
                    }
                },
                "disable": {
                    "label": "Disable",
                    "click": function() {
                        this.disable();
                    }
                }
            }
        }
    },
    "data": ["red", "yellow", "green"]
});
</script>
{% endraw %}

## Example 7
A display version of the control.
<div id="field7"> </div>
{% raw %}
<script type="text/javascript" id="field7-script">
$("#field7").alpaca({
    "schema": {
        "type": "array",
        "title": "Your favorite colors",
        "items": {
            "type": "string"
        },
        "enum": ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
    },
    "options": {
        "type": "chooser",
        "optionLabels": ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"]
    },
    "data": ["red", "yellow", "green"],
    "view": "bootstrap-display"
});
</script>
{% endraw %}


## Example 8
An example where we set the value after render.
<div id="field8"> </div>
{% raw %}
<script type="text/javascript" id="field8-script">
$("#field8").alpaca({
    "schema": {
        "type": "string",
        "title": "Select your favorite colors",
        "enum": ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
    },
    "options": {
        "type": "chooser",
        "optionLabels": ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"],
        "multiple": true
    },
    "postRender": function(control) {
        control.setValue("red,yellow,green");
    }
});
</script>
{% endraw %}

## Example 9
An example using custom delimiters
<div id="field9"> </div>
{% raw %}
<script type="text/javascript" id="field9-script">
$("#field9").alpaca({
    "schema": {
        "type": "string",
        "title": "Select your favorite colors",
        "enum": ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
    },
    "options": {
        "type": "chooser",
        "optionLabels": ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"],
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
    },
    "data": ["red", "yellow", "green"]
});
</script>
{% endraw %}