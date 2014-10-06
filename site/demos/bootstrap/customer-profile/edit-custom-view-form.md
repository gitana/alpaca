---
layout: demo
title: Customer Profile - Edit with Custom View
header: Customer Profile - Edit with Custom View
framework: Twitter Bootstrap
---

This example loads <a href="two-column-layout-template.html" target="_source">two-column-layout-template.html</a>,
<a href="data.json" target="_source">data</a>,
<a href="options.json" target="_source">options</a> and
<a href="schema.json" target="_source">schema</a> parameters through ajax calls.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "dataSource": "./data.json",
    "optionsSource": "./options.json",
    "schemaSource": "./schema.json",
    "view": {
        "parent": "bootstrap-edit",
        "layout": {
            "template": "./two-column-layout-template.html",
            "bindings": {
                "name": "leftcolumn",
                "age": "leftcolumn",
                "gender": "leftcolumn",
                "member": "leftcolumn",
                "photo": "leftcolumn",
                "phone": "rightcolumn",
                "icecream": "leftcolumn",
                "address": "rightcolumn"
            }
        },
        "fields": {
            "/name": {
                "templates": {
                    "control-text": "<input type='text' id='{{id}}'/>"
                },
                "styles": {
                    ".alpaca-field": {
                        "border": "1px solid #555",
                        "padding": "2px"
                    }
                }
            },
            "/age": {
                "messages": {
                    "stringNotANumber": "Invalid Age (Must be a number)!"
                }
            },
            "/gender": {
                "styles": {
                    ".alpaca-controlfield-label": {
                        "text-decoration": "underline",
                        "float": "left",
                        "margin-top": "0.5em"
                    },
                    ".alpaca-controlfield-radio-label:eq(0)": {
                        "text-decoration": "underline"
                    }
                }
            },
            "/member": {
                "styles": {
                    ".alpaca-controlfield-label": {
                        "float": "left",
                        "margin-top": "0.3em"
                    }
                }
            },
            "/address": {
                "layout": {
                    "template": "./two-column-layout-template.html",
                    "bindings": {
                        "street": "leftcolumn",
                        "city": "rightcolumn",
                        "state": "rightcolumn",
                        "zip": "rightcolumn"
                    }
                },
                "styles": {
                    "h3": {
                        "font-size": "14px",
                        "margin": "0px"
                    }
                }
            },
            "/address/city": {
                "templates": {
                    "context-text": "<input type='text' readonly='on' size='20' id='{{id}}' {{#if options.size}}size='{{options.size}}'{{/if}} {{#if options.readonly}}readonly='on'{{/if}} {{#if options.formName}}name='{{options.formName}}'{{/if}} {{#each options.data}}data-{{@index}}='{{.}}'{{/each}}/>"
                }
            }
        }
    },
    "postRender": function(renderedField) {
        var form = renderedField.form;
        if (form)
        {
            form.registerSubmitHandler(function (e) {
                alert("Custom Submit Handler");
                return false;
            });
        }
    }
});
</script>
{% endraw %}


