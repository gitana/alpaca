---
layout: documentation-api
title: Templates
header: Templates
group: navigation
tags: field
---
{% include JB/setup %}

Alpaca includes an advanced templating system that is driven by <a href="views.html">views</a>.  You can create your
own views and templates at compile time (when you actually build Alpaca) or you can override them on the fly at
runtime.

Templates can be supplied either as inline functions (which are discovered if you've built them at compile time),
as URLs (which are loaded at runtime), as DOM references (which are then sourced) or as HTML strings.  In the
latter two cases, the templates are acquired and then compiled before use.

Alpaca uses Handlebars by default for its templating engine.  However, you can plug in your own templating engine
if you wish.  In most cases, you won't need to do so since Handlebars is quite capable and easy to extend.

Alpaca renders forms in a nested mechanism, starting from the top and then diving down.  Each layer in the dive is
essentially a <code>container</code> or a <code>control</code>.  Containers are for Arrays and Objects.  Controls are
for everything else.

A detailed explanation of this structure is provided on the <a href="views.html">views</a> documentation page.


## Layouts

You can control the layout of fields using a layout template.  A layout template is simply an HTML block with CSS
identifiers that Alpaca can use to allocate fields into appropriate sections of the DOM.  For example, you might have
a two column layout with two side-by-side columns.  The left might have a CSS class <code>left</code>.  And the
right might have a CSS class <code>right</code>.  These can be used to allocate fields to one column or the other.

For more information on layouts, please read through the <a href="layouts.html">layouts documentation</a>.


## Wizards

You can allocate your fields onto multi-step wizards complete with Previous and Next buttons so that users can
complete some fields before moving on the next set of fields.  This is achieved in a manner similar to
<a href="layouts.html">layouts</a> but includes some additional wizard-specific settings so that you can plug in
custom validation logic and more.

For more information on wizards, please read through the <a href="wizards.html">wizards documentation</a>.


## Specific Template Overrides

From a build perspective, you can override controls and templates that are used to render controls at build time,
allowing you to produce entirely new field types and views to support them.  This is great for developers who want
to build their own field libraries for use in their projects or with their clients.

As you've seen with both <a href="layouts.html">layouts</a> and <a href="wizards.html">wizards</a>, you can also
provide HTML templates at runtime.  Alpaca compiles them and uses them straight away.

Using this mechanism, if you want, you can override specific templates for a given view at runtime.

Here is an example where we override the <code>message</code> template so that messages are displayed in big red text.


<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": {
        "name": "John McClane",
        "age": 101
    },
    "schema": {
        "title": "Your Information",
        "type": "object",
        "properties": {
            "name": {
                "title": "Name",
                "type": "string",
                "required": true
            },
            "age": {
                "title": "Age",
                "type": "integer",
                "minimum": 0,
                "maximum": 100
            }
        }
    },
    "view": {
        "templates": {
            "message": "<div style='text-align:center'><h3 style='color: red;'>Yippee kai yay!</h3><img src='/images/john-mcclaine.jpg'><p style='color: red;'>{{{message}}}</p></div>"
        }
    }
});
</script>
{% endraw %}


## Individual Field Overrides

In the previous example, we changed the <code>message</code> template for all fields in the form.  We can also
do this for individual fields, on at a time, if we wish.

Here is an example of a form where we override just the <code>name</code> field.  Note that for field overrides
referencing of fields is done via path.  The path <code>/name</code> corresponds to the <code>name</code> field right
below root.  In this example, we use a URL to load a template from another file.

In this case, we override the template <code>control-text</code> which is the template for the <code>text</code>
field control.


<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": {
        "name": "John McClane",
        "age": 32
    },
    "schema": {
        "title": "Your Information",
        "type": "object",
        "properties": {
            "name": {
                "title": "Name",
                "type": "string"
            },
            "age": {
                "title": "Age",
                "type": "integer",
                "minimum": 0,
                "maxiumum": 100
            }
        }
    },
    "view": {
        "fields": {
            "/name": {
                "templates": {
                    "control-text": "./templates-example2-template.html"
                }
            }
        }
    }
});
</script>
{% endraw %}


## Field Overrides, Paths and Arrays

In the example above, we did a very simple field-level override using a single path element.  If you have nested fields,
you can use the very sample approach and reference fields using the path semantics.  For example, a form with an
<code>address</code> object that has a <code>city</code> text field on it could be referenced like this:

    /address/city

Using these mechanics, you can override individual fields anywhere in your form.

Alpaca expresses paths for array elements using [x] notation.  For example, you might have a form that supports
multiple addresses.  In this case, the <code>address</code> field might be an <code>array</code> instead of an
<code>object</code>.

If you had two elements in the <code>address</code> array, you could reference them like this:

    /address[0]
    /address[1]

And similarly, if you wanted to reference the city field of either one separately, you would do it like this:

    /address[0]/city
    /address[1]/city

You can use this fine-grained path specification to override templates at a field level for specific parts of your form.
For example, you might want to override the <code>city</code> field for the first address but not the second.

At other times, you might want to generally describe an override for all items in an array.  In this case, you can use
a generalized field path match like this:

    /address/city

Alpaca uses a best-fit approach to find a matching path override.  Exact index-based ([x]) path matches are preferred.
If you have a path with multiple index-based elements (for example, <code>/a[0]/b[1]/c[2]/d</code>), then multiple
matching path overrides might be specified (such as <code>/a/b/c/d</code> or <code>/a[0]/b/c[2]/d</code>).  Alpaca
does it's thing and finds all matches.  It then picks the one that is the most specific to the path.

Here is a list of names with a <code>people</code> array.  Each person has a <code>name</code>.  We override the second
entry (John Rambo)'s name field (<a href="./templates-example3-control.html">templates-example3-control.html</a>).
We override to draw a blue box around the control field.  We also override all of the fields using a non-index
specific path and set names to italics and read-only
(<a href="./templates-example3-control-text.html">templates-example3-control-text.html</a>).

Note: At present, adding and removing new elements only performs DOM creation once (when the new element is inserted).
Field overrides are respected at creation time and do not recalibrate on each incremental insert.  Thus, be careful
with the matching path overrides.  They are often more useful for slight tweaks and adjustments.  If you're looking
for more full-blown custom layout and formatting, <a href="/docs/api/views.html">custom views</a>,
<a href="/docs/api/layouts.html">custom layouts</a>
and <a href="/docs/api/custom-fields.html">custom fields</a> will prove to be more powerful.

<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "data": {
        "people": [{
            "name": "John McClane",
            "age": 32
        }, {
            "name": "John Rambo",
            "age": 37
        }, {
            "name": "Chuck Norris",
            "age": 35
        }]
    },
    "schema": {
        "type": "object",
        "properties": {
            "people": {
                "title": "People",
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "title": "Name",
                            "type": "string"
                        },
                        "age": {
                            "title": "Age",
                            "type": "integer"
                        }
                    }
                }
            }
        }
    },
    "view": {
        "parent": "bootstrap-edit",
        "fields": {
            "/people[1]/name": {
                "templates": {
                    "control": "./templates-example3-control.html",
                }
            },
            "/people/name": {
                "templates": {
                    "control-text": "./templates-example3-control-text.html"
                }
            }
        }
    }
});
</script>
{% endraw %}


## Global Templates

If you want to completely do away with Alpaca's views engine and simply provide your own global template to do the
rendering, you can also do that!  A global template is a template that has access to the data and can elect
to represent it any way you want.

These kinds of global templates are useful when you want to display content for rendering purposes.  For editing and
form interaction, the view engine is extremely useful because it works its way down to actual HTML controls and does
all the actual data binding management for you.  However, for pure display purposes, global templates can be quite
a valuable thing.

Here's a simple display template.  This just provides the HTML template as a string.

<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "data": {
        "name": "John McClane",
        "age": 32
    },
    "schema": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string"
            },
            "age": {
                "type": "integer",
                "minimum": 0,
                "maximum": 100
            }
        }
    },
    "view": {
        "globalTemplate": "<div><p>Name: {{{data.name}}}</p><p>Age: {{{data.age}}}</p></div>"
    }
});
</script>
{% endraw %}


## Loading Templates from DOM

We saw how one option to render templates is to provide a URI to a template.  That works nicely since the template
file is distinct and reusable.  However, it also incurs an HTTP load when the browser is rendering.  Another option
is to reference a DOM element and use the DOM element as a template.

Here is that same global template example using a DOM element.

Note:  To use this DOM approach, you have to be sure that the DOM is ready before Alpaca starts.  Alpaca will look to
the DOM to retrieve the template when Alpaca is initialized (which is right away when you call $.alpaca).  Thus, be
sure to use the <code>$(document).ready</code> method to ensure the DOM has loaded before Alpaca inits.

You'll have to view source to find the <code>script</code tag with ID <code>#template5</code>.  But for reference,
it looks like this:

````
<script type="text/x-handlebars-template" id="template5">
    <div>
        <p>Name: {% raw %}{{data.name}}{% endraw %}</p>
        <p>Age: {% raw %}{{data.age}}{% endraw %}</p>
    </div>
</script>
````

<div id="field5"> </div>
{% raw %}
<script type="text/javascript" id="field5-script">
$(document).ready(function() {
    $("#field5").alpaca({
        "data": {
            "name": "John McClane",
            "age": 32
        },
        "schema": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "age": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 100
                }
            }
        },
        "view": {
            "globalTemplate": "#template5"
        }
    });
});
</script>
{% endraw %}
{% raw %}
<script type="text/x-handlebars-template" id="template5">
    <div>
        <p>Name: {{data.name}}</p>
        <p>Age: {{data.age}}</p>
    </div>
</script>
{% endraw %}
