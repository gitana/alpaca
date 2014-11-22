---
layout: documentation-api
title: Views
header: Views
group: navigation
tags: field
---
{% include JB/setup %}

When Alpaca runs, the very first thing it does is sort out which view implementation it will use to render the schema
and options that you provide.  A view implementation consists of an ID and an implementation class.  The implementation
class serves as a reference object that Alpaca uses to determine things along the way such as:

- which template to render for a given form, container or control type
- what CSS classes to inject into rendered elements
- what callback behaviors to run against rendered elements
- the text values for localized messages
- layout templates
- other rendering overrides
- view type

There are three supported view types: ```display```, ```edit``` and ```create```.

- A ```display``` view, as you might suspect, simply shows the data.  It is non-interactive.
- A ```create``` view renders the form with empty data and suspended invalidation (on first pass) so that users are led
through an optimistic data entry experience.
- An ```edit``` view renders the form with existing data and fires invalidation right away so that users can see what
data is invalid.

You can create your own view at any time.  However, it's worthwhile first reviewing the core concepts here.  Creating
your own views is covered at bottom of this page.

## Default Views

A good number of views are provided out of the box.  You can use these views to render straight up, non-fancy HTML
layouts (```web```), Bootstrap responsive layouts (```bootstrap```), jQueryUI responsive layouts (```jqueryui```)
and JQuery Mobile layouts (```jquerymobile```).

The following views are provided out of the box.  Views are hierarchical such that child views inherit properties
form parent views.  Here is the default hierarchy:

```
base
    web-display
        web-display-horizontal
        bootstrap-display
            bootstrap-display-horizontal
        jqueryui-display
            jqueryui-display-horizontal
        jquerymobile-display
            jquerymobile-display-horizontal
    web-edit
        web-edit-horizontal
        bootstrap-edit
            bootstrap-edit-horizontal
        jqueryui-edit
            jqueryui-edit-horizontal
        jquerymobile-display
            jquerymobile-display-horizontal
    web-create
        web-create-horizontal
        bootstrap-create
            bootstrap-create-horizontal
        jqueryui-create
            jqueryui-create-horizontal
        jquerymobile-create
            jquerymobile-create-horizontal
````

## Using Views
With views in place, you can select views right from your call to Alpaca.  Suppose you have your schema and options at
hand.  The follow two calls are equivalent except that the former chooses the jQuery UI engine to layout the create
form where as the latter uses jQuery Mobile.

Using jQuery UI:

```
{% raw %}
<script type="text/javascript">
    $("#form").alpaca({
        "schema": schema,
        "options": options,
        "data": data,
        "view": "jqueryui-create"
    });
</script>
{% endraw %}
```

Using jQuery Mobile:

```
{% raw %}
<script type="text/javascript">
    $("#form").alpaca({
        "schema": schema,
        "options": options,
        "data": data,
        "view": "jquerymobile-create"
    });
</script>
{% endraw %}
```

## Rendering
Alpaca starts from the top of the schema that you provide and walks down each level.  Since the schema is a tree, it
traverses down each level using a depth-first traversal.  At any level, it finds items that are either "container"
or "scalar" in nature.  Container elements are things like arrays or objects.  Scalar elements are things like
booleans, strings or numbers.  Container elements can contain other container elements.  Scalar elements cannot
contain anything (they are leaves in the tree).

Consider the following JSON schema:

```
{
    "type": "object",                       // 1
    "properties": {
        "title": {
            "type": "string"                // 1.1
        },
        "location": {
            "type": "object",               // 1.2
            "properties": {
                "city": {
                    "type": "string"        // 1.2.1
                },
                "state": {
                    "type": "string"        // 1.2.2
                }
            }
        }
    }
}
````

Alpaca will walk the tree and for every element it finds, it will try to determine what kind of Field implementation to
use to handle the rendering.  There are two families of Fields - Containers and Controls.  A ContainerField implementation
is used to handle container elements.  And a ControlField implementation is used to handle scalars.

In this case, it starts at the top and sees something of schema type "object".  Alpaca will consult its registry and
pick the ObjectField implementation to handle this.  The ObjectField is an instance of ContainerField.  Thus, it first
renders the template ```container```.  This template in turn renders ```container-object```.

And this, in turn, will walk through all child items and render those.  Items of type ```string``` by default will
by handled by TextField instances (which are ControlField descendants).  As such, a TextField will first render the
template ```control```.  This template will, in turn, render ```control-text```.

And so on down the tree.

The inclusive layers of templates essentially look like this:

<div class="view-layer level1">
    container
    <div class="view-layer level2">
        container-object (1)
        <div class="view-layer level3">
            control
            <div class="view-layer level4">
                control-text (1.1)
            </div>
            <div class="view-layer level4">
                container
                <div class="view-layer level5">
                    container-object (1.2)
                    <div class="view-layer level6">
                        control
                        <div class="view-layer level7">
                            control-text (1.2.1)
                        </div>
                    </div>
                    <div class="view-layer level6">
                        control
                        <div class="view-layer level7">
                            control-text (1.2.2)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


## Templates

Alpaca makes heavy use of <a href="http://handlebarsjs.com/" target="_blank">Handlebars</a> templates to render each
layer in the tree.  At the same time, Alpaca attempts to minimalize the number of templates to keep things fast and
smooth.  The structure shown above is essentially the right idea in all cases.

Every Alpaca Field (such as TextField) has a type.  The TextField's type is ```text```.  Alpaca knows that TextField
extends ControlField and so, by convention, it automatically looks for a template named ```control-text``` in the
current view.

Incidentally, here is what the ```control-text``` template looks like:

```
{% raw %}
<script type="text/x-handlebars-template">

    <input type="text" id="{{id}}" {{#if options.placeholder}}placeholder="{{options.placeholder}}"{{/if}} {{#if options.size}}size="{{options.size}}"{{/if}} {{#if options.readonly}}readonly="readonly"{{/if}} {{#if name}}name="{{name}}"{{/if}} {{#each options.data}}data-{{@key}}="{{this}}"{{/each}}/>

</script>
{% endraw %}
````

The current view can either explicitly provide this template.  Or the template can be provided by a parent view.  The
template can consist of a URI to a template file or an inline text string.  In the former case, the resource will be
loaded and the compiled.  In the latter case, the template will be compiled straight away.

The out-of-the-box templates are all precompiled for Handlebars during the build.  And so they're optimized for speed.
If you want to override them, you can do so at runtime.  Here's an example where we create our own view called
```my-view``` by extending the ```bootstrap-create``` view.  We spice up the ```control-text``` template by adding
the ```wow``` class to it.

Note: what exactly the <b>wow</b> class does is left as an exercise for the imagination.  wow.

```
var newTemplate = ' \
<script type="text/x-handlebars-template"> \
    <input class="wow" type="text" id="{{id}}" {{#if options.placeholder}}placeholder="{{options.placeholder}}"{{/if}} {{#if options.size}}size="{{options.size}}"{{/if}} {{#if options.readonly}}readonly="readonly"{{/if}} {{#if name}}name="{{name}}"{{/if}} {{#each options.data}}data-{{@key}}="{{this}}"{{/each}}/> \
</script>';

Alpaca.registerView({
    "id": "my-view",
    "parent": "bootstrap-create",
    "templates": {
        "control-text": newTemplate
    }
});
````

You can now use the ```my-view``` view in your Alpaca calls.  Alpaca will compile your template and you'll be off to the races.

Here's an example of extending using a URI:

```
Alpaca.registerView({
    "id": "my-view",
    "parent": "bootstrap-create",
    "templates": {
        "control-text": "./templates/wow.html"
    }
});
````

Same idea.  This lets you cleanly separate your templates into neat and elegant HTML files.  However, it also incurs a runtime cost
since Alpaca has to go over the wire to load your templates.  So keep that in mind.


## Field Callbacks
During the course of processing the levels of your schema, Alpaca fires off specific callbacks to your view.  This lets your view
plug in custom behaviors or make adjustments to the DOM ahead of Alpaca plugging it into the web page.

All field callbacks have their scope (<b>this</b>) set to the field instance.  Using this, callback implementors can use
```this.getFieldEl()``` to grab the outer DOM layer (```control``` or ```container```) and either ```this.getControlEl()```
or ```this.getContainerEl()``` to grab the inner DOM layer (```control-text```, for example).

The following callbacks are supported

- <b>field</b> - fires after a field renders
- <b>control</b> - fires after a control renders
- <b>container</b> - fires after a container renders
- <b>form</b> - fires after a form renders
- <b>required</b> - fires when a field is marked as required
- <b>optional</b> - fires when a field is marked as optional
- <b>readonly</b> - fires when a field is marked as readonly
- <b>disabled</b> - fires when a field is marked as disabled
- <b>enabled</b> - fires when a field is marked as enabled
- <b>invalid</b> - fires when a field switches to an invalid state
- <b>valid</b> - fires when a field switches to a valid state

Callbacks can be overridden within your view declaration.  Here is an example which builds on the example from the
templates section above.  Here, we add the illustrious <b>wow</b> class to the input control without
overriding the template.  We simply plug the class in via the callback:

```
Alpaca.registerView({
    "id": "my-view",
    "parent": "bootstrap-create",
    "callbacks": {
        "control": function() {
            this.getControlEl().addClass("wow");
        }
    }
});
````



## Styles

Views also allow you to specify the classes that you wish to have applied to various elements.  Alpaca consults a
registry of class names on the view to see what should be applied.

The following class overrides are supported:

- <b>commonIcon</b> - TODO
- <b>addIcon</b> - TODO
- <b>removeIcon</b> - TODO
- <b>upIcon</b> - TODO
- <b>downIcon</b> - TODO
- <b>containerExpandedIcon</b> - TODO
- <b>containerCollapsedIcon</b> - TODO

These can be overridden like this:

```
Alpaca.registerView({
    "id": "my-view",
    "parent": "bootstrap-create",
    "styles": {
        "commonIcon": "fa fa-open-o"
    }
});
````


## Horizontal Orientation
Each view supports a ```horizontal``` flag which you can set true in order to tell the view to render the forms
with labels and controls oriented horizontally.  By default, Alpaca oriented forms vertically so that labels appear
above the control.

With a horizontal orientation, labels are placed to the left of the control and padded appropriately.


## Creating your own Views
Use the following syntax to create and register your own views with Alpaca.

```
Alpaca.registerView({
    "id": "<viewId>",
    "parent": "<parentViewId>",
    "type": "<type>", // either "display", "edit" or "create"
    "ui": "<ui>", // usually "web", "bootstrap", "jqueryui", "jquerymobile" or your own
    "title": "<title>"
    "displayReadonly": <boolean>, // whether to display read only properties
    "templates": {
        "<templateId>": "<templateOrURI>"
    },
    "callbacks": {
        "<callbackId>": <callbackFunction>
    },
    "styles": {
        "<styleId>": "<cssClasses>"
    },
    "horizontal": <boolean> // whether to render in horizontal mode
});
````