---
layout: documentation-field
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
    <li><code>renderWizard</code> - whether a wizard should be rendered</li>
    <li><code>title</code> - (optional) title for the wizard</li>
    <li><code>description</code> - (optional) description for the wizard</li>
    <li><code>bindings</code> - (optional) maps fields to steps of the wizard</li>
    <li><code>steps</code> - (optional) provides labels and descriptions for the navigation</li>
</ul>

The only required property is <code>renderWizard</code>.  If <code>bindings</code> is not provided, all of the fields
will be placed on a single step wizard.  By providing <code>bindings</code>, you can split fields out onto individual
steps of the wizard.

<div id="field1"></div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "dataSource": "/data/customer-profile-data.json",
    "schemaSource": "/data/customer-profile-schema.json",
    "optionsSource": "/data//customer-profile-options.json",
    "view": {
        "parent": "bootstrap-edit-horizontal",
        "wizard": {
            "renderWizard": true,
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

If you want to make control of the wizard layout, you can optionally use a template to lay out your fields.
A template provides you with a way to lay out each step of the wizard exactly as you might wish.  For example, you
might want step 1 to have stacked fields whereas step 2 has a completely different arrangement.  In this case, the
simple <code>bindings</code> based configuration of the previous example might prove insufficient.

The solution is to use a layout.  If you haven't read up on <a href="layouts.html">layouts</a> yet, we recommend
that <a href="layouts.html">learn about layouts</a>.

In this example, we use the layout <a href="./wizards-example1-template.html">wizards-example1-template.html</a>
to generate the HTML that ultimately will be injected for each step of the wizard.

The wizard has 1 special requirement of layouts that intend to automatically bind in as steps.  Each step must be
wrapped in a DOM element with the attribute <code>data-alpaca-wizard-role="step"</code>.  Alpaca uses this attribute
to find the steps and sequence them.

Alpaca also supports some DOM-driven configuration that can be done right within the layout as an alternative to
providing it within the JSON.

For the top-level DOM element:
<ul>
    <li><code>data-alpaca-wizard-title</code> - the wizard title (<code>wizard.title</code>)</li>
    <li><code>data-alpaca-wizard-description</code> - the wizard description (<code>wizard.description</code>)</li>
</ul>

And for each step:
<ul>
    <li><code>data-alpaca-wizard-step-title</code> - the step title (<code>wizard.steps[i].title</code>)
    <li><code>data-alpaca-wizard-step-description</code> - the step description (<code>wizard.steps[i].description</code>)</li>
</ul>

In this example, we use this DOM-based configuration to reduce the amount of JSON we pass in for the wizard config.
It's all contained in the template HTML.  And the bindings are contained in the layout.

<div id="field2"></div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "dataSource": "/data/customer-profile-data.json",
    "schemaSource": "/data/customer-profile-schema.json",
    "optionsSource": "/data//customer-profile-options.json",
    "view": {
        "parent": "bootstrap-edit-horizontal",
        "layout": {
            "template": './wizards-example1-template.html',
            "bindings": {
                "name": "step1",
                "age": "step1",
                "gender": "step1",
                "photo": "step1",
                "member": "step2",
                "phone": "step2",
                "icecream": "step2",
                "address": "step3"
            }
        },
        "wizard": {
            "renderWizard": true
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

<div id="field3"></div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "dataSource": "/data/customer-profile-data.json",
    "schemaSource": "/data/customer-profile-schema.json",
    "optionsSource": "/data//customer-profile-options.json",
    "view": {
        "parent": "bootstrap-edit-horizontal",
        "wizard": {
            "renderWizard": true,
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


