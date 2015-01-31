---
layout: documentation-field
title: CKEditor Field
header: CKEditor Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```ckeditor``` field.

The CK Editor field renders the CK editor control that allows users to visually work with HTML
and save the results back into a text property.

<!-- INCLUDE_API_DOCS: ckeditor -->


## Requirements
The CK Editor field depends on the CKEditor library.  You can acquire this library from
<a href="http://www.ckeditor.com">http://www.ckeditor.com</a>.  This must be included in your page ahead of the control
loading in order for this to work properly.


## Example 1
A full example of the CK Editor at work.  This has a lot of buttons.  The point here is to show how it looks in full.
In the examples that follow, we'll trim this down.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "Ice cream is a <b>frozen</b> dessert usually made from <i>dairy products</i>, such as milk and cream, and often combined with fruits or other ingredients and flavors.",
    "options": {
        "type": "ckeditor"
    }
});
</script>
{% endraw %}


## Example 2
Here is a simplified version of the CK Editor with many of the buttons removed.

A full example of the CK Editor at work.  This has a lot of buttons.  The point here is to show how it looks in full.
In the examples that follow, we'll trim this down.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "Ice cream is a <b>frozen</b> dessert usually made from <i>dairy products</i>, such as milk and cream, and often combined with fruits or other ingredients and flavors.",
    "options": {
        "type": "ckeditor",
        "ckeditor": {
            "toolbar": [
                ['Format','Font','FontSize'],
                ['Bold','Italic','Underline','StrikeThrough','-','Undo','Redo','-','Cut','Copy','Paste','Find','Replace','-','Outdent','Indent','-','Print'],
                '/',
                ['NumberedList','BulletedList','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
                ['Image','Table','-','Link','Flash','Smiley','TextColor','BGColor','Source']
            ]
        }
    }
});
</script>
{% endraw %}


## Example 3
Here we bind multiple CK Editors into the same form.

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
                "type": "ckeditor"
            },
            "body": {
                "type": "ckeditor"
            }
        }
    }
});
</script>
{% endraw %}
