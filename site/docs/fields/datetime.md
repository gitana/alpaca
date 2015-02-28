---
layout: documentation-field
title: Date Time Field
header: Date Time Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```datetime``` field.

The DateTime Field builds on the standard Date Field and leverages the Bootstrap DateTime plugin under the hood.
You can learn more about this plugin on its GitHub page:
<a href="https://github.com/Eonasdan/bootstrap-datetimepicker">https://github.com/Eonasdan/bootstrap-datetimepicker</a>.

For more information on date and time formatting strings, see the Moment.js documentation:
<a href="http://momentjs.com/docs/">http://momentjs.com/docs/</a>.

The default date time format is assumed to be <code>MM/DD/YYYY HH:mm:ss</code>.  This is an American approach to the
date with a 24-hour clock.  If you want to have an AM/PM selector, you can set the dateFormat to
<code>MM/DD/YYYY hh:mm:ss a</code>.

<!-- INCLUDE_API_DOCS: datetime -->


## Example 1
Single datetime field.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "schema": {
        "format": "datetime"
    }
});
</script>
{% endraw %}


## Example 2
Multiple datetime fields wrapped in a FORM.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data" : {
        "start" : "10/12/2015 13:20",
        "end" : "10/15/2015 18:55"
    },
    "schema": {
        "type" : "object",
        "properties" : {
            "start" : {
                "title" : "Start",
                "description" : "Select your start datetime.",
                "format": "datetime"
            },
            "end" : {
                "title" : "End",
                "description" : "Select your end datetime.",
                "format": "datetime"
            }
        }
    },
    "options" : {
        "form":{
            "attributes":{
                "action":"../../endpoints/echo.php",
                "method":"post"
            },
            "buttons":{
                "submit":{},
                "reset":{}
            }
        }
    }
});
</script>
{% endraw %}


## Example 3
Datetime field with timepicker options and a button that returns field value as date.
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "schema": {
        "title" : "Datetime",
        "description" : "Pick your datetime.",
        "format": "datetime"
    },
    "options": {
        "picker": {
            "format": "DD/MM/YYYY HH:mm:ss",
            "extraFormats": [
                "DD/MM/YYYY hh:mm:ss a"
            ]
        }
    },
    "postRender": function(form) {
        var button = $("<div><button class='btn btn-default'>Get Datetime</button></div>");
        button.click(function() {
            alert(form.getDate());
        }).appendTo($("#field3"));
    }
});
</script>
{% endraw %}


## Example 4
Single datetime field rendered in display-only mode.
<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "data" : "02/05/2013 05:00",
    "schema": {
        "format": "datetime"
    },
    "options": {
        "label": "The current date and time"
    },
    "view": "bootstrap-display"
});
</script>
{% endraw %}


## Example 5
If you'd like to customize the behavior of this control, you can pass in explicit configuration using the ```picker```
option.

Here is an example that uses a 24 hour clock format and an alternative layout.  Note that a 24 hour clock is specified
with HH.

<div id="field5"> </div>
{% raw %}
<script type="text/javascript" id="field5-script">
$("#field5").alpaca({
    "data" : "02/05/2014 05:00",
    "schema": {
        "format": "datetime"
    },
    "options": {
        "label": "The current date and time",
        "picker": {
            "sideBySide": false,
        },
        "dateFormat": "YYYY-MM-DD HH:mm:ss"
    }
});
</script>
{% endraw %}