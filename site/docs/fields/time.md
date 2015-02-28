---
layout: documentation-field
title: Time Field
header: Time Field
group: navigation
---
{% include JB/setup %}

The ```time``` field.

The time Field uses the
<a href="https://github.com/Eonasdan/bootstrap-datetimepicker" target="_blank">https://github.com/Eonasdan/bootstrap-datetimepicker</a>.
plugin under the hood.

For more information on date and time formatting strings, see the Moment.js documentation:
<a href="http://momentjs.com/docs/">http://momentjs.com/docs/</a>.

The default time format is assumed as <code>h:mm:ss a</code>.

<!-- INCLUDE_API_DOCS: time -->


## Example 1
Simple example that displays the time and lets you change it.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "1:15:00 PM",
    "schema": {
        "format": "time"
    }
});
</script>
{% endraw %}


## Example 2
Displays the time in an alternative 24-hour format.  This is passed in using the <code>dateFormat</code> option but
could also be passed in using <code>picker.format</code> as per example 3.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "13:12:34",
    "schema": {
        "format": "time"
    },
    "options": {
        "dateFormat": "HH:mm:ss"
    }
});
</script>
{% endraw %}


## Example 3
The time field with invalid time data.  The time control rounds the time to nearest valid value.
In addition, we can override the time picker plugin's settings directly by specifying them in the ```picker```
option.  Here we set things up so that seconds increment by 2.

In addition, we specify the time picker settings directly so that seconds are shown:
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "data": "05:77:34",
    "options": {
        "type": "time",
        "picker": {
            "stepping": 2,
            "format": "HH:mm:ss"
        }
    }
});
</script>
{% endraw %}


## Example 4
The time field in display-only mode.
<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
    $("#field4").alpaca({
        "data": "12:15:30 PM",
        "options": {
            "type": "time"
        },
        "view": "bootstrap-display"
    });
</script>
{% endraw %}