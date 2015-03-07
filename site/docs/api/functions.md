---
layout: documentation-api
title: Functions
header: Functions
group: navigation
tags: field
---
{% include JB/setup %}

## General Usage

The general usage of Alpaca is one where you pass a JSON object into the $.alpaca method to inspire the rendering
of your form.  The general usage follows a structure like this:

````
$("#id").alpaca({
    "data": {},
    "schema": {},
    "options": {},
    "postRender": function(control) {
    }
});
````

This will use the information provided by <code>schema</code> and <code>options</code> to render a form containing
<code>data</code> into the DOM element with ID <code>id</code>.  Once the form has finished rendering, the
<code>postRender</code> method will be triggered and will be given the form's control instance.

The $.alpaca method is a jQuery plugin method and, as such, in conforming with the way that jQuery plugins are
intended to work, it hands itself back.  Thus, in the code block above, the $("#id").alpaca() invocation hands back
the $("#id") array itself.

If you call $.alpaca on a DOM element that already has an Alpaca form rendered into it, the existing form will be
discovered and no operation will take place.

## DOM-driven Usage

If no form configuration is provided, Alpaca will inspect the underlying DOM element as best it can to determine what
to render.

Consider the following in all of its glory:

HTML:
{% raw %}
````
<div id='thor'>
{
    "data": {
        "name": "Thor"
    },
    "schema": {
        "type": "string"
    },
    "options": {
        "type": "text",
        "label": "Name"
    }
}
</div>
````
{% endraw %}


JS:
{% raw %}
````
$("#thor").alpaca();
````
{% endraw %}

This renders thusly:

<div id='thor'>
{
    "data": "Thor",
    "schema": {
        "type": "string"
    },
    "options": {
        "type": "text",
        "label": "Name"
    }
}
</div>
{% raw %}
<script type="text/javascript" id="thor-script">
$("#thor").alpaca();
</script>
{% endraw %}



## Special Functions

You can also use the $.alpaca method to fire one of a special set of functions.

<table class="table table-bordered table-hover">
    <thead>
        <tr>
            <th>Function Name</th>
            <th>Returns</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>get</td>
            <td>Control Field</td>
            <td>Retrieves the control instance for an existing Alpaca form</td>
        </tr>
        <tr>
            <td>exists</td>
            <td>boolean</td>
            <td>Whether the DOM element has an existing Alpaca form bound to it</td>
        </tr>
        <tr>
            <td>destroy</td>
            <td>undefined</td>
            <td>Destroys an existing Alpaca form bound to the DOM element.  If none exists, this simply returns</td>
        </tr>
    </tbody>
</table>

## get

Use the <code>get</code> function to get the control instance for a previously rendered form.
Here is an example where we retrieve the control via the $.alpaca method.
And then, for giggles, we put a blue border around the underlying input element.

<div id="field2"></div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "Hello World",
    "postRender": function() {
        var control = $("#field2").alpaca("get");
        control.getControlEl().css("border", "5px blue solid");
    }
})
</script>
{% endraw %}

## exists

Use the <code>exists</code> function to check whether a DOM element has an Alpaca form.
Here is a nifty example:

<div id="field3"></div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "data": "Hello World",
    "postRender": function() {
        var exists = $("#field3").alpaca("exists"); // true
    }
})
</script>
{% endraw %}

## destroy

Use the <code>destroy</code> function to tear down an existing Alpaca form that is bound to a DOM element.
Here is how the destruction is dealt:

<div id="field4"></div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "data": "Hello World",
    "postRender": function() {
        $("#field4").alpaca("destroy");
    }
})
</script>
{% endraw %}

<br/>
<br/>

Here is an example where we do the same thing against a more complex form.  We create a few buttons for 'show', 'hide'
 and 'destroy'.  The buttons use special functions to find the form instance and do things with it.

<div id="field5"></div>
{% raw %}
<script type="text/javascript" id="field5-script">
$("#field5").alpaca({
    "data": {
        "name": "Joe Smith",
        "age": 35
    },
    "schema": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "title": "Name"
            },
            "age": {
                "type": "number",
                "title": "Age"
            }
        }
    },
    "options": {
        "fields": {
            "name": {
                "type": "text"
            },
            "age": {
                "type": "integer"
            }
        },
        "form": {
            "buttons": {
                "show": {
                    "label": "Show",
                    "click": function()
                    {
                        var form = $("#field5").alpaca("get");
                        form.show();
                    }
                },
                "hide": {
                    "label": "Hide",
                    "click": function() {
                        var form = $("#field5").alpaca("get");
                        form.hide();
                    }
                },
                "destroy": {
                    "label": "Destroy",
                    "click": function() {
                        $("#field5").alpaca("destroy");
                    }
                }
            }
        }
    }
})
</script>
{% endraw %}


