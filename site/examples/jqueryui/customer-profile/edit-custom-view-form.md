---
layout: example
title: Customer Profile - Edit with Custom View Example
header: Customer Profile - Edit with Custom View Example
group: navigation
tags: field
framework: jQuery-UI
---

This example loads <a href="two-column-layout-template.html" target="_source">layout template</a>, <a href="data.json" target="_source">data</a>, <a href="options.json" target="_source">options</a> and <a href="schema.json" target="_source">schema</a> parameters through ajax calls.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "dataSource": "./data.json",
    "optionsSource": "./options.json",
    "schemaSource": "./schema.json",
    "view": {
        "parent": "VIEW_WEB_EDIT_LAYOUT_TWO_COLUMN",
        "layout": {
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
        "styles": {
            ".alpaca-controlfield-label": {
                "min-width": "50px",
                "padding-right": "2px"
            }
        },
        "fields": {
            "/name": {
                "templates": {
                    "fieldOuterEl": "<span class='alpaca-field' id='${id}-outer' alpaca-field-id='${id}'><div>Full Name</div>{{html this.html}}</span>",
                    "controlFieldHelper": "{{if options.helper}}<div class='{{if options.helperClass}}${options.helperClass}{{/if}}' id='${helperId}'>${options.helper}</div>{{/if}}"
                },
                "styles": {
                    ".alpaca-field": {
                        "border": "1px solid #555",
                        "padding": "2px"
                    },
                    ".alpaca-controlfield-label": {
                        "float": "left",
                        "margin-top": "0.3em"
                    }
                }
            },
            "/age": {
                "messages": {
                    "stringNotANumber": "Invalid Age (Must be a number)!"
                },
                "styles": {
                    ".alpaca-controlfield-label": {
                        "text-decoration": "underline",
                        "float": "left",
                        "margin-top": "0.3em"
                    }
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
                    "template": 'twoColumnLayout',
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
                    "controlFieldText": "<input type='text' readonly='on' size='20' id='${id}' {{if options.size}}size='${options.size}'{{/if}} {{if options.readonly}}readonly='on'{{/if}} {{if options.formName}}name='${options.formName}'{{/if}} {{each(i,v) options.data}}data-${i}='${v}'{{/each}}/>"
                }
            }
        }
    },
    "postRender": function (renderedField) {
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


