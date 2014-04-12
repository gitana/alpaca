---
layout: documentation-field
title: Date Time Field
header: Date Time Field
group: navigation
tags: field
---
{% include JB/setup %}


The ```datetime``` field.


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
        "start" : "10/12/2012 01:20",
        "end" : "10/15/2012 18:55"
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
        "renderForm":true,
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
        "datetime": {
            "showSecond": true,
            "timeFormat": 'hh:mm:ss.lZ',
            "dateFormat": 'yy-mm-dd',
            "separator": 'T',
            "stepHour": 2,
            "stepMinute": 10,
            "stepSecond": 10
        }
    },
    "postRender": function(form) {
        var button = $("<div><button>Get Datetime</button></div>");
        button.click(function() {
            alert(form.getDatetime());
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
    "view": "VIEW_BOOTSTRAP_DISPLAY"
});
</script>
{% endraw %}


## Example 5
The DateTime Field uses Trent Richardson's TimePicker extension to the jQuery UI DatePicker
Control to let users pick both dates and times.  If you'd like to customize
the behavior of this control, you can pass in explicit configuration.  For details on the kinds
of things you can pass in, see the documentation for the
<a href="http://trentrichardson.com/examples/timepicker/" target="_blank">TimePicker Extension</a>.

Here is an example that uses dropdowns instead of sliders for time selection.

<div id="field5"> </div>
{% raw %}
<script type="text/javascript" id="field5-script">
$("#field5").alpaca({
    "data" : "02/05/2013 05:00",
    "schema": {
        "format": "datetime"
    },
    "options": {
        "label": "The current date and time",
        "timepicker": {
            "controlType": "select",
            "timeFormat": "hh:mm:tt"
        }
    }
});
</script>
{% endraw %}