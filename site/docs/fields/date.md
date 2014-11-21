---
layout: documentation-field
title: Date Field
header: Date Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```date``` field.

The Date Field uses the Bootstrap Datetime picker under the hood.  You can learn more about the picker at it's GitHub
project page:
<a href="https://github.com/Eonasdan/bootstrap-datetimepicker" target="_blank">https://github.com/Eonasdan/bootstrap-datetimepicker</a>.

For more information on date and time formatting strings, see the Moment.js documentation:
<a href="http://momentjs.com/docs/">http://momentjs.com/docs/</a>.

<!-- INCLUDE_API_DOCS: date -->


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
Here is an example of a date field that is invalid.  By default, the date format is MM/DD/YYYY.  As such, the validation
check will determine that the value of this date field is invalid.

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
You can specify custom date formats as well using the ```dateFormat``` option.  Here we specify a European date format
and also explicitly say that we want a ```date``` field (as opposed to having Alpaca figure that out from the schema format).
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "data": "30/12/2013",
    "options": {
        "type": "date",
        "dateFormat": "DD/MM/YYYY"
    }
});
</script>
{% endraw %}


## Example 4
Here we use the <code>bootstrap-display</code> view to tell Alpaca to render a set of
fields in a display-only mode.  Nothing is editable, including the date.
<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
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
    "view": "bootstrap-display"
});
</script>
{% endraw %}


## Example 5
If you'd like to customize the behavior of this control, you can pass in explicit configuration via the ```picker```
option.

Here is an example that limits the calendar.  The minimum date is two weeks ago.  The maximum date is two weeks from now.
And we switch the language to Spanish.

<div id="field5"> </div>
{% raw %}
<script type="text/javascript" id="field5-script">
var now = new Date();
$("#field5").alpaca({
    "schema": {
        "format": "date"
    },
    "options": {
        "label": "Por favor, elige una fecha para su visita:",
        "picker": {
            "minDate": new Date().setDate(now.getDate() - 14),
            "maxDate": new Date().setDate(now.getDate() + 14),
            "language": "es"
        }
    }
});
</script>
{% endraw %}
