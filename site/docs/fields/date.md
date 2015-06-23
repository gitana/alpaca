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

With this control, you can pass any of the bootstrap-datetimepicker options information through to the underlying control
via the <code>options.picker</code> setting.

<!-- INCLUDE_API_DOCS: date -->


## Example 1
This is the simplest way that you can render a date.  It's driven purely off of JSON
schema and uses the <code>format</code> schema setting to specify that the value should be a date.
Alpaca renders a date field by default and assumes the American format of <code>MM/DD/YYYY</code>.
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
You can select a different date format using the <a href="http://momentjs.com/docs/#/displaying/format/">moment.js</a>
formatting options.  In this example, we switch to using a simplified European date format of <code>DD/MM/YY</code>.
Here we also skip the <code>schema.format</code> method and specifically spell out that we'd like a <code>date</code>
field control.  The format is passed to the underlying DateTimePicker control directly via the <code>picker</code>
option.

In addition, the <code>manualEntry</code> option is set to false to prevent manual entry of date values into the
text field.  The picker is therefore required to enter the date.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "15/10/01",
    "options": {
        "type": "date",
        "picker": {
            "format": "DD/MM/YY"
        },
        "manualEntry": true
    }
});
</script>
{% endraw %}


## Example 3
Date fields participate in the validation chain along with everything else.

Here is an example of a date field that is invalid.  By default, the date format is MM/DD/YYYY.  As such, the validation
check will determine that the value of this date field is invalid.

The <code>hideInitValidationError</code> setting is provided but it isn't necessary
since it defaults to <code>false</code> anyway for editable views.  You can set it to
<code>true</code> to hide the initial validation message.
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
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

## Example 4
You can specify custom date formats as well using the ```dateFormat``` option.  Here we specify a European date format
and also explicitly say that we want a ```date``` field (as opposed to having Alpaca figure that out from the schema format).
<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "data": "30/12/2013",
    "options": {
        "type": "date",
        "dateFormat": "DD/MM/YYYY"
    }
});
</script>
{% endraw %}


## Example 5
Here we use the <code>bootstrap-display</code> view to tell Alpaca to render a set of
fields in a display-only mode.  Nothing is editable, including the date.
<div id="field5"> </div>
{% raw %}
<script type="text/javascript" id="field5-script">
$("#field5").alpaca({
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


## Example 6
If you'd like to customize the behavior of this control, you can pass in explicit configuration via the ```picker```
option.  Take a look at all of the available options on the
<a href="http://eonasdan.github.io/bootstrap-datetimepicker/Options/">Bootstrap DateTime Picker plugin page</a>.

Here is an example that limits the calendar.  The minimum date is two weeks ago.  The maximum date is two weeks from now.
And we switch the language to Spanish.

<div id="field6"> </div>
{% raw %}
<script type="text/javascript" id="field6-script">
var now = new Date();
$("#field6").alpaca({
    "schema": {
        "format": "date"
    },
    "options": {
        "label": "Por favor, elige una fecha para su visita:",
        "picker": {
            "minDate": new Date().setDate(now.getDate() - 14),
            "maxDate": new Date().setDate(now.getDate() + 14),
            "locale": "es"
        }
    }
});
</script>
{% endraw %}
