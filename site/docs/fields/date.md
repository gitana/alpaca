---
layout: documentation-field
title: Date Field
header: Date Field
group: navigation
tags: field
---
{% include JB/setup %}


The ```date``` field.


## Example 1
This is the simplest way that you can render a date.  It's driven purely off of JSON
schema and uses the <code>format</code> setting to specify that the value should be a date.
Alpaca renders a date field by default.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "10/15/2001",
    "schema": {
        "format": "date"
    }
});
</script>
{% endraw %}


## Example 2
Date fields participate in the validation chain along with everything else.
Here is an example of a date field that is invalid.
The <code>hideInitValidationError</code> setting is provided but it isn't necessary
since it defaults to <code>false</code> anyway for editable views.  You can set it to
<code>true</code> to hide the initial validation message.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "10/105/2001",
    "schema": {
        "format": "date"
    },
    "options": {
        "hideInitValidationError": false
    }
});
</script>
{% endraw %}


## Example 3
Here we use the <code>VIEW_BOOTSTRAP_DISPLAY</code> view to tell Alpaca to render a set of
fields in a display-only mode.  Nothing is editable, including the date.
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "data": {
        "eventDate": "10/15/2001",
        "eventName": "Bob's Retirement Party"
    },
    "schema": {
        "type": "object",
        "properties": {
            "eventDate": {
                "type": "string",
                "format": "date",
                "title": "Date of Event"
            },
            "eventName": {
                "type": "string",
                "title": "Event Name"
            }
        }
    },
    "view": "VIEW_BOOTSTRAP_DISPLAY"
});
</script>
{% endraw %}


## Example 4
The Date Field uses the jQuery UI DatePicker Control under the hood.  If you'd like to customize
the behavior of this control, you can pass in explicit configuration.  For details on the kinds
of things you can pass in, see the documentation for the
<a href="http://api.jqueryui.com/datepicker/" target="_blank">jQuery UI DatePicker Control</a>.

Here is an example that limits the calendar to just 2 weeks from today.

<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "schema": {
        "format": "date"
    },
    "options": {
        "label": "Please choose an appointment date:",
        "helper": "The appointment date must be within the next two weeks",
        "datepicker": {
            "hideIfNoPrevNextType": true,
            "minDate": 0,
            "maxDate": "+2w"
        }
    }
});
</script>
{% endraw %}
