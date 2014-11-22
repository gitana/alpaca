---
layout: documentation-api
title: Callbacks
header: Callbacks
group: navigation
tags: field
---
{% include JB/setup %}

Alpaca provides several places where you can hook in callbacks.

* <a href="events.html">Events</a> - events are raised when the user interacts with fields.  You can register callbacks
to handle these events, adjust field state or other operations.
* <a href="observables.html">Observables</a> - each field maintains an observable that you can subscribe to.
Subscribing to an observable means that you're listening for changes to its value.  You can also use observables to
interrogate and find values of fields within namespaces.  This lets you find values of other fields on the same form
or within other forms on the same page (using scopes).
* <a href="validation.html">Validation</a> - each field has its own validation logic which is coded into the field
and runs by default, respecting the underlying JSON schema mechanics.  You can also register custom validation logic
within your JSON config on a per-field basis.
* <a href="forms.html">Forms</a> - let you define buttons and submit handlers.
* <a href="wizards.html">Wizards</a> - let you define Next, Previous and Submit handlers including custom validation
between transitions.

In general, the Alpaca model is an asynchronous one.  The framework assumes that external, third-party systems may need
to be consulted for things like validation, and so in general callbacks are utilized to indicate completion of the
handling.  Exceptions to this are event handlers (which are modeled off of DOM event handlers, also synchronous) and
the primary postRender callback.

## The postRender callback

The <code>postRender</code> callback is the most common callback that you will use.  This is a top-level callback that
gets fired once the form has completely rendered.  It carries a single argument which is the top level control instance.
You can use this control instance to get all all of the child fields.

Here is an example of its use.  This simply logs the initial values to console.

<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "schema": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string"
            },
            "job": {
                "type": "string"
            }
        }
    },
    "options": {
        "fields": {
            "name": {
                "label": "Name"
            },
            "job": {
                "label": "Job"
            }
        }
    },
    "data": {
        "name": "John McClane",
        "job": "Police Officer"
    },
    "postRender": function(control)
    {
        var nameField = control.childrenByPropertyId["name"];
        var jobField = control.childrenByPropertyId["job"];

        console.log("Welcome aboard, " + jobField.getValue() + " " + nameField.getValue());
    }
});
</script>
{% endraw %}

