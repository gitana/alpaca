---
layout: documentation-field
title: Array Field
header: Array Field
group: navigation
tags: field
---
{% include JB/setup %}

Test

<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({




    "schema": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "title": {
                    "type": "string",
                    "title": "Title"
                },
                "description": {
                    "type": "string",
                    "title": "Description"
                }
            }
        }
    }




});
</script>
{% endraw %}


