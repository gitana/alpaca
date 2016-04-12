---
layout: documentation-field
title: Summernote Editor Field
header: Summernote Editor Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```summernote``` field.

The Summernote Editor field renders the Summernote editor control that allows users to visually work with HTML
and save the results back into a text property.

<!-- INCLUDE_API_DOCS: summernote -->


## Requirements
The Summernote Editor field depends on the Summernote Editor library.  You can acquire this library from
<a href="http://summernote.org/">http://summernote.org/</a>.  This must be included in your page ahead of the control
loading in order for this to work properly.


## Example 1
A full example of the Summernote Editor at work.  This has a lot of buttons.  The point here is to show how it looks in full.
In the examples that follow, we'll trim this down.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "Ice cream is a <b>frozen</b> dessert usually made from <i>dairy products</i>, such as milk and cream, and often combined with fruits or other ingredients and flavors.",
    "options": {
        "type": "summernote",
        "form": {
            "buttons": {
                "json": {
                    "title": "View JSON",
                    "click": function(e) {
                        alert(JSON.stringify(this.getValue(), null, "  "));
                    }
                }
            }
        }
    }
});
</script>
{% endraw %}


## Example 2
Here is a simplified version of the Summernote Editor with many of the buttons removed.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "Ice cream is a <b>frozen</b> dessert usually made from <i>dairy products</i>, such as milk and cream, and often combined with fruits or other ingredients and flavors.",
    "options": {
        "type": "summernote",
        "summernote": {
            "toolbar": [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']]
            ],
            "popover": {
                "air": [
                    ['color', ['color']],
                    ['font', ['bold', 'underline', 'clear']]
                ]
            }            
        },
        "form": {
            "buttons": {
                "json": {
                    "title": "View JSON",
                    "click": function(e) {
                        alert(JSON.stringify(this.getValue(), null, "  "));
                    }
                }
            }
        }
    }
});
</script>
{% endraw %}


## Example 3
Here we bind multiple Summernote Editors into the same form.

<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "schema": {
        "type": "object",
        "properties": {
            "summary": {
                "type": "string",
                "title": "Summary"
            },
            "body": {
                "type": "string",
                "title": "Body"
            }
        }
    },
    "options": {
        "fields": {
            "summary": {
                "type": "summernote"
            },
            "body": {
                "type": "summernote"
            }
        }
    }
});
</script>
{% endraw %}
