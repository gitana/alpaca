---
layout: documentation-field
title: Upload Field
header: Upload Field
group: navigation
tags: field
---
{% include JB/setup %}


The ```upload``` field.


## Example 1
A simple upload field.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "view": "VIEW_BOOTSTRAP_CREATE",
    "schema": {
        "type": "object",
        "properties": {
            "files": {
                "type": "string"
            }
        }
    },
    "options": {
        "fields": {
            "files": {
                "type": "upload",
                "label": "Files",
                "upload": {
                    "formData": {
                        "path": "/folder1/folder2/{filename}"
                    },
                    "url": "upload/index.php",
                    "autoUpload": true,
                    "maxFileSize": 25000000,
                    "maxNumberOfFiles": 1,
                    "showSubmitButton": false
                },
                "multiple": true
            }
        },
        "focus": true,
        "renderForm": true,
        "form": {
            "attributes": {
                "method": "POST",
                "action": "form/index.php",
                "enctype": "multipart/form-data"
            },
            "buttons": {
                "submit": {
                    "value": "Submit"
                }
            }
        }
    }
});
</script>
{% endraw %}
