---
layout: documentation-api
title: Observables
header: Observables
group: navigation
tags: field
---
{% include JB/setup %}

Alpaca maintains observables that can be subscribed to by listeners that want to listen for changes to values
in the form.  An observable exists for every field and registration can be either programmatic or driven from
configuration.

In general, if you're sticking to straight JSON-schema, you won't find much use for observables.  JSON schema is fairly
fixed in terms of its interdependency of fields (see <a href="/docs/api/dependencies.html">dependencies</a>).

Rather, observables are most useful when you really want to take full control of how fields refresh, update or change
their state based on one or more values elsewhere in the form (at any level).

## Simple Listener

Here's an example that lets you pick a city and then lets you pick your favorite sports team.  The sports teams
that are available for selection change depending on what city you select.

After the form renders, the <code>team</code> field subscribes to the <code>city</code> field.
When the <code>city</code> field's value changes, the <code>team</code> listener fires.
This gives it a chance to update it's schema and refresh.

Incidentally, this example also defines a form and a button that, when clicked, submits the form in a background
Ajax post.  You can use the <code>submit</code> method to submit directly (which will redirect your browser) or the
<code>ajaxSubmit</code> to run the submit in the background and get a promise.

<div id="field1"></div>
{% raw %}
<script type="text/javascript" id="field1-script">
var teams = {
    "Milwaukee": ["Brewers", "Bucks"],
    "Cleveland": ["Indians", "Cavaliers", "Browns"],
    "Boston": ["Red Sox", "Celtics", "Patriots", "Bruins"]
};
$("#field1").alpaca({
    "schema": {
        "type": "object",
        "properties": {
            "city": {
                "title": "Pick a City",
                "type": "string",
                "enum": ["Milwaukee", "Cleveland", "Boston"],
                "default": "Milwaukee"
            },
            "team": {
                "title": "Team",
                "type": "string",
                "enum": teams["Milwaukee"]
            }
        }
    },
    "options": {
        "form": {
            "attributes": {
                "action": "http://testcompany.com/echo.php",
                "method": "post"
            },
            "buttons": {
                "save": {
                    "title": "Save",
                    "click": function(e) {
                        alert(JSON.stringify(this.getValue()));
                        //this.submit(); // submit it via regular HTTP post
                        this.ajaxSubmit(); // submit via ajax
                    }
                }
            }
        }
    },
    "postRender": function(control) {
        var city = control.childrenByPropertyId["city"];
        var team = control.childrenByPropertyId["team"];
        team.subscribe(city, function(val) {
            this.schema.enum = this.options.optionLabels = teams[val];
            this.refresh();
        });
    }
});</script>
{% endraw %}


## Using an Observable and a Data Source

This example does the same thing as the one above but uses a data source to load values for the <code>team</code>
field.  After rendering, it sets up an event listener for the <code>change</code> event.  When the <code>city</code>
field changes it's value, the <code>team</code> field is refreshed.

The data source is reloaded.  In doing so, the data source uses the <code>observable</code> method to look up the
value of the <code>city</code> field by path.

This example also uses a key/value object instead of an array to specify both the schema.enum and options.optionLabels.

<div id="field2"></div>
{% raw %}
<script type="text/javascript" id="field2-script">
var teamsMap = {
    "Milwaukee": [{
        "value": "brewers",
        "text": "Brewers"
    }, {
        "value": "bucks",
        "text": "Bucks"
    }],
    "Cleveland": [{
        "value": "browns",
        "text": "Browns"
    }, {
        "value": "cavaliers",
        "text": "Cavaliers"
    }, {
        "value": "indians",
        "text": "Indians"
    }],
    "Boston": [{
        "value": "bruins",
        "text": "Bruins"
    }, {
        "value": "celtics",
        "text": "Celtics"
    }, {
        "value": "patriots",
        "text": "Patriots"
    }, {
        "value": "redsox",
        "text": "Red Sox"
    }]
};
var dataSource = function(callback) {
    var value = this.observable("/city").get();
    callback(teamsMap[value]);
};
$("#field2").alpaca({
    "schema": {
        "type": "object",
        "properties": {
            "city": {
                "title": "Pick a City",
                "type": "string",
                "enum": ["Milwaukee", "Cleveland", "Boston"],
                "default": "Milwaukee"
            },
            "team": {
                "title": "Team",
                "type": "string",
                "enum": []
            }
        }
    },
    "options": {
        "form": {
            "buttons": {
                "save": {
                    "title": "Save",
                    "click": function(e) {
                        alert(JSON.stringify(this.getValue()));
                    }
                }
            }
        },
        "fields": {
            "team": {
                "dataSource": dataSource
            }
        }
    },
    "postRender": function(control) {
        var city = control.childrenByPropertyId["city"];
        var team = control.childrenByPropertyId["team"];
        city.on("change", function() {
            team.refresh();
        });
    }
});</script>
{% endraw %}


## Using Observables Programmatically

Each field control has a set of methods that you can use to set and retrieval observable state.  These methods are:

<ul>
    <li>
        <code>field.subscribe([scope], id, fn)</code>
        <br/>
        <p>
            Subscribes a function as an event handler for an observable identified by it's ID.  The scope variable
            is optional and identifies a namespace for the observable.  If not provided, the namespace is one that
            is global to the form being rendered and can be acquired using <code>field.getObservableScope()</code>.
        </p>
    </li>
    <li>
        <code>field.unsubscribe([scope], id, fn)</code>
        <br/>
        <p>
            Unsubscribes a function as an event handler for an observable identified by it's ID.
        </p>
    </li>
    <li>
        <code>field.observable([scope], id)</code>
        <br/>
        <p>
            Retrieves an observable.  The observable has methods <code>get()</code> (which can return null),
            <code>set(value)</code> and <code>clear()</code>.  Note that setting or changing the value of an
            observable will cause any observable subscribers to trigger.
        </p>
    </li>
    <li>
        <code>field.clearObservable([scope], id)</code>
        <br/>
        <p>
            Clears the value of an observable.  This is equivalent to <code>observable(id).clear()</code>.
            Note that setting or changing the value of an observable will cause any observable subscribers to trigger.
        </p>
    </li>
</ul>

## Observable Scope

By default, each field is rendered with the notion of an observable scope (or namespace) into which the observables
are written and read from.  If you have two forms rendering on the same page, using two separate <code>$.alpaca()</code>
calls, you will have two separate observable namespaces by default.  If you set an observable value in form1, it won't
be accessible by form2.

If you have a nested form, each field in the nested structure will use the same observable scope.

The observable scope can be gotten from a field using <code>field.getObservableScope()</code>.