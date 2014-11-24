---
layout: documentation-field
title: Select Field
header: Select Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```select``` field.

<!-- INCLUDE_API_DOCS: select -->


## Example 1
Select field with data, options and schema parameters. As default, select field will be rendered if schema enum property has more than 3 options.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "coffee",
    "options": {
        "label": "Ice cream",
        "helper": "What flavor of ice cream do you prefer?"
    },
    "schema": {
        "enum": ["vanilla", "chocolate", "coffee", "strawberry", "mint"]
    }
});
</script>
{% endraw %}


## Example 2
Here is the same select field but labels in French.  The important thing to note is that the schema stays the same.
The options change, letting you customize forms into different languages.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "coffee",
    "options": {
        "label": "Crème Glacée",
        "helper": "Quelle saveur de crème glacée préférez-vous?",
        "optionLabels": ["Vanille", "Chocolat", "Café", "Fraise", "Comme"]
    },
    "schema": {
        "enum": ["vanilla", "chocolate", "coffee", "strawberry", "mint"]
    }
});
</script>
{% endraw %}


## Example 3
Select field with options loaded from external <a href="/data/icecream-list.json" target="_datasource">data source</a>.
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "options": {
        "label": "Ice cream",
        "helper": "Guess my favorite ice cream?",
        "type": "select",
        "dataSource": "/data/icecream-list.json"
    }
});
</script>
{% endraw %}


## Example 4
Multiple select field with options loaded from external <a href="/data/icecream-list.json" target="_datasource">data source</a>.
<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "data": ["Vanilla", "Chocolate"],
    "options": {
        "label": "Ice cream",
        "helper": "Guess my favorite ice cream?",
        "type": "select",
        "multiple": true,
        "size": 3,
        "dataSource": "/data/icecream-list.json"
    }
});
</script>
{% endraw %}


## Example 5
Select field with an onField event listener option that reacts to select change event.
<div id="field5"> </div>
{% raw %}
<script type="text/javascript" id="field5-script">
$("#field5").alpaca({
    "data": "Coffee",
    "options": {
        "label": "Ice cream",
        "helper": "Guess my favorite ice cream?",
        "optionLabels": ["Vanilla Flavor", "Chocolate Flavor", "Coffee Flavor"],
        "onFieldChange" : function(e) {
            alert("You picked: " + this.getValue());
        }
    },
    "schema": {
        "enum": ["Vanilla", "Chocolate", "Coffee", "Strawberry", "Mint"]
    }
});
</script>
{% endraw %}


## Example 6
Multiple select field for array data.
<div id="field6"> </div>
{% raw %}
<script type="text/javascript" id="field6-script">
$("#field6").alpaca({
    "data": ["Vanilla", "Chocolate"],
    "schema" : {
        "type": "array",
        "items": {
            "title": "Ice Cream",
            "type": "string",
            "enum" : ["Vanilla", "Chocolate", "Strawberry", "Mint"],
            "minItems": 2,
            "maxItems": 3
        }
    },
    "options": {
        "label": "Ice cream",
        "helper": "Guess my favorite ice cream?",
        "type": "select",
        "size": 5
    }
});
</script>
{% endraw %}


## Example 7
Select field in display-only mode
<div id="field7"> </div>
{% raw %}
<script type="text/javascript" id="field7-script">
$("#field7").alpaca({
    "data": "Coffee",
    "options": {
        "label": "Ice cream",
        "helper": "Guess my favorite ice cream?"
    },
    "schema": {
        "enum": ["Vanilla", "Chocolate", "Coffee", "Strawberry", "Mint"]
    },
    "view": "bootstrap-display"
});
</script>
{% endraw %}


## Example 8
Multiple select field that works with a local data source file (array of string values).
<div id="field8"> </div>
{% raw %}
<script type="text/javascript" id="field8-script">
$("#field8").alpaca({
    "options": {
        "label": "Select your favorite flavor of ice cream",
        "type": "select",
        "multiple": true,
        "size": 3,
        "dataSource": "/data/icecream-list.json"
    }
});
</script>
{% endraw %}


## Example 9
Multiple select field that works with a local data source file (array of object values).
<div id="field9"> </div>
{% raw %}
<script type="text/javascript" id="field9-script">
$("#field9").alpaca({
    "options": {
        "label": "Select your favorite flavor of ice cream",
        "type": "select",
        "multiple": true,
        "size": 3,
        "dataSource": "/data/icecream-list-array.json"
    }
});
</script>
{% endraw %}


## Example 10
Multiple select field that works with an inline datasource function.
<div id="field10"> </div>
{% raw %}
<script type="text/javascript" id="field10-script">
$("#field10").alpaca({
    "options": {
        "dataSource": function(callback) {
            callback([{
                "value": "vanilla",
                "text": "Vanilla"
            }, {
                "value": "chocolate",
                "text": "Chocolate"
            }, {
                "value": "coffee",
                "text": "Coffee"
            }, {
                "value": "strawberry",
                "text": "Strawberry"
            }, {
                "value": "mint",
                "text": "Mint"
            }]);
        },
        "label": "Select your favorite flavor of ice cream",
        "type": "select",
        "multiple": true,
        "size": 3
    }
});
</script>
{% endraw %}


## Example 11
Multiple select field that works with an inline datasource function.
<div id="field11"> </div>
{% raw %}
<script type="text/javascript" id="field11-script">
$("#field11").alpaca({
    "options": {
        "dataSource": function(callback) {
            callback(["vanilla", "chocolate", "coffee", "strawberry", "mint"]);
        },
        "label": "Select your favorite flavor of ice cream",
        "type": "select",
        "multiple": true,
        "size": 3
    }
});
</script>
{% endraw %}


## Example 12
A select field that uses the <code>removeDefaultNone</code> option to remove the option for the end user to select <code>None</code>
from the list of available options.

Note that if the property that the field describes is required for data integrity to be maintained,
consider setting the property schema's <code>required</code> setting to <code>true</code>.
This produces the same effect and also allows your data to validate appropriately.

<div id="field12"> </div>
{% raw %}
<script type="text/javascript" id="field12-script">
$("#field12").alpaca({
    "data": "Jimi Hendrix",
    "schema": {
        "enum": [
            "Jimi Hendrix",
            "Mark Knopfler",
            "Joe Satriani",
            "Eddie Van Halen",
            "Orianthi"
        ]
    },
    "options": {
        "type": "select",
        "label": "Who is your favorite guitarist?",
        "removeDefaultNone": true
    }
});
</script>
{% endraw %}

## Example 13
A select field that is required but which keeps the <code>None</code> option.  By default, required fields do not
have a <code>None</code> option.  Here we set the <code>removeDefaultNone</code> option to false explicitly so that
the none option still appears.

This also changes the label from <code>"None"</code> to <code>"-- Select --"</code>.

<div id="field13"> </div>
{% raw %}
<script type="text/javascript" id="field13-script">
$("#field13").alpaca({
    "schema": {
        "enum": [
            "Jimi Hendrix",
            "Mark Knopfler",
            "Joe Satriani",
            "Eddie Van Halen",
            "Orianthi"
        ],
        "required": true
    },
    "options": {
        "type": "select",
        "label": "Who is your favorite guitarist?",
        "noneLabel": "-- Select --",
        "removeDefaultNone": false
    }
});
</script>
{% endraw %}