---
layout: documentation-field
title: Image Field
header: Image Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```image``` field.

<!-- INCLUDE_API_DOCS: image -->


## Example 1
This example simply renders a field for editing a URL to an image.
The image shows up in preview mode below the URL.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "/images/chunio.png",
    "schema": {
        "type": "string"
    },
    "options": {
        "type": "image",
        "label": "Image"
    }
});
</script>
{% endraw %}

## Example 2
This example overrides the <code>view</code> for the field to set the field to display-only mode.
An image field (display mode)
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "/images/chunio.png",
    "schema": {
        "type": "string"
    },
    "options": {
        "type": "image",
        "label": "Image",
        "view": "bootstrap-display"
    }
});
</script>
{% endraw %}

## Example 3
Use of image field in display-only mode within in an object.
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "schema": {
        "type": "object",
        "properties": {
            "title": {
                "type": "string"
            },
            "description": {
                "type": "string"
            },
            "image": {
                "type": "string"
            }
        }
    },
    "options": {
        "fields": {
            "title": {
                "type": "text",
                "label": "Title"
            },
            "description": {
                "type": "textarea",
                "label": "Description"
            },
            "image": {
                "type": "image",
                "label": "Image",
                "view": "bootstrap-display"
            }
        }
    },
    "data": {
        "title": "Chunio",
        "description": "Half Beagle and Half Treeing Walker Coonhound",
        "image": "/images/chunio.png"
    }
});
</script>
{% endraw %}

## Example 4
Display-only view
<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "data": "/images/chunio.png",
    "schema": {
        "type": "string"
    },
    "options": {
        "type": "image"
    },
    "view": "bootstrap-display"
});
</script>
{% endraw %}
