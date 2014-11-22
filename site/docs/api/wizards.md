---
layout: documentation-api
title: Wizards
header: Wizards
group: navigation
tags: field
---
{% include JB/setup %}

Alpaca lets you arrange your form into simple multi-step wizards along with buttons for previous, next and submit
using a simple configuration-driven approach.  Wizards are essentially fields within a single form that are split
across multiple DIVS, letting you orchestrate a single and non-conditional flow path as DIVs are hidden and shown
in sequence.

In addition, wizards optionally allow for configuration-driven options to assert the validation state of the set of
shown fields before allowing the user to proceed to the next page.

The basic wizard functionality in Alpaca is an extension of custom layouts.  It may help to read up on
<a href="/docs/api/layouts.html">custom layouts</a> to get a better understanding of wizards as much of the
wizard functionality depends on it.

## Multi-Step Example
In this example, we use our customer profile data, schema and options, all of which are loaded via HTTP by Alpaca
at the onset.  These files are acquired here:

<ul>
    <li><a href="/data/customer-profile-data.json">customer-profile-data.json</a></li>
    <li><a href="/data/customer-profile-schema.json">customer-profile-schema.json</a></li>
    <li><a href="/data/customer-profile-options.json">customer-profile-options.json</a></li>
</ul>

We use a special <code>wizard</code> block to tell Alpaca that we want the wizard to be built upon the layout.
We can also use this block to configure the wizard as we see fit.

<ul>
    <li><code>title</code> - (optional) title for the wizard</li>
    <li><code>description</code> - (optional) description for the wizard</li>
    <li><code>bindings</code> - (optional) maps fields to steps of the wizard</li>
    <li><code>steps</code> - (optional) provides labels and descriptions for the navigation</li>
</ul>

All that is required for the wizard to be rendered is for the <code>wizard</code> block to be present.  Everything
inside of the wizard block is optional.

<div id="field1"></div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "dataSource": "/data/customer-profile-data.json",
    "schemaSource": "/data/customer-profile-schema.json",
    "optionsSource": "/data/customer-profile-options.json",
    "view": {
        "parent": "bootstrap-edit-horizontal",
        "wizard": {
            "title": "Welcome to the Wizard",
            "description": "Please fill things in as you wish",
            "bindings": {
                "name": 1,
                "age": 1,
                "gender": 1,
                "photo": 1,
                "member": 2,
                "phone": 2,
                "icecream": 3,
                "address": 3
            },
            "steps": [{
                "title": "Getting Started",
                "description": "Basic Information"
            }, {
                "title": "Details",
                "description": "Personal Information"
            }, {
                "title": "Preferences",
                "description": "Customize your Profile"
            }]
        }
    }
});</script>
{% endraw %}


## Using a Custom Wizard Template

You can control the layout of individual steps of the wizard by using a wizard layout template.  A wizard
layout template is simply a layout template that has some specific DOM attributes in it to identify the containers
for your steps.  These containers are then hidden and shown as the wizard is navigated through.

If you haven't read up on <a href="layouts.html">layouts</a> yet, we recommend that you do as many of the concepts
expressed here are covered over there.

In this example, we use the layout <a href="./wizards-example2-template.html">wizards-example2-template.html</a>
to generate the HTML that ultimately will be injected for each step of the wizard.

The wizard requires that the layout identify step containers.  Each step must be wrapped in a DOM element
with the attribute <code>data-alpaca-wizard-role="step"</code>.  Alpaca uses this attribute to find the steps
and sequence them.

<div id="field2"></div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "dataSource": "/data/customer-profile-data.json",
    "schemaSource": "/data/customer-profile-schema.json",
    "optionsSource": "/data/customer-profile-options.json",
    "view": {
        "parent": "bootstrap-edit-horizontal",
        "layout": {
            "template": './wizards-example2-template.html'
        },
        "wizard": {
            "title": "Welcome to the Wizard",
            "description": "Please fill things in as you wish",
            "bindings": {
                "name": 1,
                "age": 1,
                "gender": 1,
                "photo": 1,
                "member": 2,
                "phone": 2,
                "icecream": 3,
                "address": 3
            },
            "steps": [{
                "title": "Getting Started",
                "description": "Basic Information"
            }, {
                "title": "Details",
                "description": "Personal Information"
            }, {
                "title": "Preferences",
                "description": "Customize your Profile"
            }]
        }
    }
});</script>
{% endraw %}

## Wizard Template-Driven Configuration

With wizard templates, you can also configure the wizard from within the DOM itself.  This lets you configure some
aspects of the wizard from right within the HTML.  In addition, you can use DOM selectors to identify the field
bindings, giving you a bit more flexibility.

There are a number of DOM-driven configurations that can be supplied from within the HTML.

For the top-level DOM element:
<ul>
    <li><code>data-alpaca-wizard-title</code> - the wizard title (<code>wizard.title</code>)</li>
    <li><code>data-alpaca-wizard-description</code> - the wizard description (<code>wizard.description</code>)</li>
    <li><code>data-alpaca-wizard-validation</code> - whether to run validation between steps (<code>wizard.validation</code>)</li>
    <li><code>data-alpaca-wizard-show-steps</code> - whether to render the steps selector (<code>wizard.showSteps</code>)</li>
    <li><code>data-alpaca-wizard-show-progress-bar</code> - whether to render the progress bar (<code>wizard.showProgressBar</code>)</li>
</ul>

And for each step:
<ul>
    <li><code>data-alpaca-wizard-step-title</code> - the step title (<code>wizard.steps[i].title</code>)
    <li><code>data-alpaca-wizard-step-description</code> - the step description (<code>wizard.steps[i].description</code>)</li>
</ul>

In this example, we use this DOM-based configuration to reduce the amount of JSON we pass in for the wizard config.
It's all contained in the template HTML.  And the bindings are contained in the layout.

The layout file being used is  <a href="./wizards-example3-template.html">wizards-example3-template.html</a>.

Note that in this case, since everything is driven out of the layout, we don't need to specify much regarding the
wizard within the config at all.  In fact, we can simply pass <code>wizard: {}</code> or <code>wizard: true</code>
to run the wizard, but that's it.

<div id="field3"></div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "dataSource": "/data/customer-profile-data.json",
    "schemaSource": "/data/customer-profile-schema.json",
    "optionsSource": "/data/customer-profile-options.json",
    "view": {
        "parent": "bootstrap-edit-horizontal",
        "layout": {
            "template": './wizards-example3-template.html',
            "bindings": {
                "name": "step1",
                "age": "step1",
                "gender": "step1",
                "photo": "step1",
                "member": "step2",
                "phone": "step2",
                "icecream": "step3",
                "address": "step3"
            }
        },
        "wizard": true
    }
});</script>
{% endraw %}


## Wizard Layout-Driven Field Bindings

Another feature that wizard layouts give you is the ability to bind fields into exact positions within the layout.
This lets you identify the field within the template itself, allowing for exact specification of where the field
should be inserted.  This is an advantage for highly specific forms with needs for exact field placement but
also generally makes your templates less re-usable.  In effect, you trade off reusability for accuracy.

To mark exact field placements, you simply use the <code>data-alpaca-layout-binding</code> attribute.

Here is an example that does just that.  This uses the  <a href="./wizards-example4-template.html">wizards-example4-template.html</a>
template.

<div id="field4"></div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "dataSource": "/data/customer-profile-data.json",
    "schemaSource": "/data/customer-profile-schema.json",
    "optionsSource": "/data/customer-profile-options.json",
    "view": {
        "parent": "bootstrap-edit-horizontal",
        "layout": {
            "template": './wizards-example4-template.html',
        },
        "wizard": {
        }
    }
});</script>
{% endraw %}


## Advanced Options

By default, steps are validated prior to transitioning between previous and next.  You can turn this on and off
using the <code>validation</code> wizard setting.

You can also customize buttons and set up custom validation functions for each transition.  You can add a click
handler for the submit button.  If no click handler is supplied and the wizard is inside of a form, the form will
be submitted.

<div id="field5"></div>
{% raw %}
<script type="text/javascript" id="field5-script">
$("#field5").alpaca({
    "dataSource": "/data/customer-profile-data.json",
    "schemaSource": "/data/customer-profile-schema.json",
    "optionsSource": "/data/customer-profile-options.json",
    "view": {
        "parent": "bootstrap-edit-horizontal",
        "wizard": {
            "title": "Welcome to the Wizard",
            "description": "Please fill things in as you wish",
            "bindings": {
                "name": 1,
                "age": 1,
                "gender": 1,
                "photo": 1,
                "member": 2,
                "phone": 2,
                "icecream": 3,
                "address": 3
            },
            "steps": [{
                "title": "Getting Started",
                "description": "Basic Information"
            }, {
                "title": "Details",
                "description": "Personal Information"
            }, {
                "title": "Preferences",
                "description": "Customize your Profile"
            }],
            "showSteps": true,
            "showProgressBar": false,
            "validation": true,
            "buttons": {
                "previous": {
                    "validate": function(callback) {
                        console.log("Previous validate()");
                        callback(true);
                    }
                },
                "next": {
                    "validate": function(callback) {
                        console.log("Next validate()");
                        callback(true);
                    }
                },
                "submit": {
                    "title": "All Done!",
                    "validate": function(callback) {
                        console.log("Submit validate()");
                        callback(true);
                    },
                    "click": function(e) {
                        alert(JSON.stringify(this.getValue(), null, "  "));
                    }
                }
            }
        }
    }
});</script>
{% endraw %}


