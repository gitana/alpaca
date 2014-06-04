---
layout: documentation-field
title: Events
header: Events
group: navigation
tags: field
---
{% include JB/setup %}

Alpaca allows you to bind event handlers to containers and individual fields that are triggered either
directly or via propagation.

Event handlers can be registered in the following ways:

- Configuration driven by specifying functions within Alpaca options
- Using the ```postRender``` method and calling ```on()``` for individual fields
- By extending Alpaca ```Field``` implementation classes

This document covers how to set these up.

## Event Types

<table class="table table-bordered">
    <tr>
        <th>Event</th>
        <th>Context</th>
        <th>Arguments</th>
        <th>Description</th>
    </tr>

    <!-- "mouseover" -->
    <tr>
        <td>
            mouseover
        </td>
        <td>
            Field
        </td>
        <td>
            <ul>
                <li>event</li>
            </ul>
        </td>
        <td>
            The mouse moved over the dom element for a field
        </td>
    </tr>

    <!-- "mouseout" -->
    <tr>
        <td>
            mouseout
        </td>
        <td>
            Field
        </td>
        <td>
            <ul>
                <li>event</li>
            </ul>
        </td>
        <td>
            The mouse moved out of the dom element for a field
        </td>
    </tr>

    <!-- "change" -->
    <tr>
        <td>
            change
        </td>
        <td>
            ControlField
        </td>
        <td>
            <ul>
                <li>event</li>
            </ul>
        </td>
        <td>
            The value of the field changed
        </td>
    </tr>

    <!-- "focus" -->
    <tr>
        <td>
            focus
        </td>
        <td>
            ControlField
        </td>
        <td>
            <ul>
                <li>event</li>
            </ul>
        </td>
        <td>
            The control field has received focus
        </td>
    </tr>

    <!-- "blur" -->
    <tr>
        <td>
            blur
        </td>
        <td>
            ControlField
        </td>
        <td>
            <ul>
                <li>event</li>
            </ul>
        </td>
        <td>
            The control field has lost focus
        </td>
    </tr>

    <!-- "keypress" -->
    <tr>
        <td>
            keypress
        </td>
        <td>
            ControlField
        </td>
        <td>
            <ul>
                <li>event</li>
            </ul>
        </td>
        <td>
            A key was pressed in the control field
        </td>
    </tr>

    <!-- "keydown" -->
    <tr>
        <td>
            keydown
        </td>
        <td>
            ControlField
        </td>
        <td>
            <ul>
                <li>event</li>
            </ul>
        </td>
        <td>
            A key was pressed down in the control field
        </td>
    </tr>

    <!-- "keyup" -->
    <tr>
        <td>
            keyup
        </td>
        <td>
            ControlField
        </td>
        <td>
            <ul>
                <li>event</li>
            </ul>
        </td>
        <td>
            A key was released in the control field
        </td>
    </tr>

    <!-- "click" -->
    <tr>
        <td>
            click
        </td>
        <td>
            ControlField
        </td>
        <td>
            <ul>
                <li>event</li>
            </ul>
        </td>
        <td>
            The left mouse button was clicked in the control field
        </td>
    </tr>

</table>


## Configuration Driven

For any field, you can specify an ```events``` sub-object that declares handlers by event name.

Here is an example where we register a handler for the ```change``` event on the ```title``` field using a
configuration-driven approach.

<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "schema": {
        "type": "object",
        "properties": {
            "title": {
                "type": "string"
            }
        }
    },
    "options": {
        "fields": {
            "title": {
                "type": "text",
                "label": "Title",
                "events": {
                    "change": function() {
                        alert("The value was changed (example #1)");
                    }
                }
            }
        }
    }
});
</script>
{% endraw %}


## Using the ```postRender``` callback

For any field, you can register an event handler by calling ```on``` for the field instance.

In this example, we register a handler for the ```change``` event on the ```title``` field from within
a ```postHandler``` callback.

<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "schema": {
        "type": "object",
        "properties": {
            "title": {
                "type": "string"
            }
        }
    },
    "options": {
        "fields": {
            "title": {
                "type": "text",
                "label": "Title"
            }
        }
    },
    "postRender": function(control) {
        control.childrenByPropertyId["title"].on("change", function() {
            alert("The value was changed (example #2)");
        });
    }
});
</script>
{% endraw %}


## Extending Field implementation classes

You can extend the base field classes that Alpaca offers and register event handlers directly.

<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">

// register a 'custom' field implementation
// this extends the text field
$.alpaca.Fields.CustomField = $.alpaca.Fields.TextField.extend({

    getFieldType: function() {
        return "custom";
    },

    onChange: function(e)
    {
        alert("The value was changed (example #3)");
    }

});
Alpaca.registerFieldClass("custom", Alpaca.Fields.CustomField);
//
// invoke alpaca using the 'custom' type
$("#field3").alpaca({
    "schema": {
        "type": "object",
        "properties": {
            "title": {
                "type": "string"
            }
        }
    },
    "options": {
        "fields": {
            "title": {
                "type": "custom",
                "label": "Title"
            }
        }
    }
});
</script>
{% endraw %}

