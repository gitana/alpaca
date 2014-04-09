---
layout: documentation-field
title: WYSIWYG Field
header: WYSIWYG Field
group: navigation
tags: field
---
{% include JB/setup %}


The ```wysiwyg``` field.


The WYSIWYG field renders an HTML editor control that allows users to visually work with HTML
and save the results back into a text field.


## Requirements
The WYSIWYG field depends on the jQuery WYSIWYG plugin (
<a href="../../../lib/jquery.wysiwyg/jquery.wysiwyg.js">jquery.wysiwyg.js</a>
and
<a href="../../../lib/jquery.wysiwyg/jquery.wysiwyg.css">jquery.wysiwyg.css</a>).
These must be included in your page for the Date field to work properly.


## Example 1
WYSIWYG editor with full list of buttons.
<div id="field1"> </div>
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "Ice cream is a <b>frozen</b> dessert usually made from <i>dairy products</i>, such as milk and cream, and often combined with fruits or other ingredients and flavors.",
    "options": {
        "type": "wysiwyg"
    }
});
</script>


## Example 2
WYSIWYG editor with selected list of buttons.
<div id="field2"> </div>
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "Ice cream is a <b>frozen</b> dessert usually made from <i>dairy products</i>, such as milk and cream, and often combined with fruits or other ingredients and flavors.",
    "options": {
        "type": "wysiwyg",
        "wysiwyg" : {
            "controls": {
                "html": { "visible": true },
                "createLink": { "visible": false },
                "unLink": { "visible": false },
                "h1": { "visible": false },
                "h2": { "visible": false },
                "h3": { "visible": false },
                "indent": { "visible": false },
                "insertHorizontalRule": { "visible": false },
                "insertImage": { "visible": false },
                "insertOrderedList": { "visible": false },
                "insertTable": { "visible": false },
                "insertUnorderedList": { "visible": false },
                "justifyCenter": { "visible": false },
                "justifyFull": { "visible": false },
                "justifyLeft": { "visible": false },
                "justifyRight": { "visible": false },
                "outdent": { "visible": false },
                "redo": { "visible": false },
                "removeFormat": { "visible": false },
                "subscript": { "visible": false },
                "superscript": { "visible": false },
                "undo": { "visible": false },
                "code": { "visible": false },
                "strikeThrough": { "visible": false }
            }
        }
    }
});
</script>


## Example 3
WYSIWYG editor with on-demand option. Move your mouse over the textarea and see the difference it makes.
<div id="field3"> </div>
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "data": "Ice cream is a <b>frozen</b> dessert usually made from <i>dairy products</i>, such as milk and cream, and often combined with fruits or other ingredients and flavors.",
    "options": {
        "type": "wysiwyg",
        "onDemand": true,
        "rows": 10,
        "cols": 60
    }
});
</script>


## Example 4
WYSIWYG editor with validation.
<div id="field4"> </div>
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "data": "picture",
    "options": {
        "type": "wysiwyg",
        "onDemand": true,
        "rows": 10,
        "cols": 60
    },
    "schema": {
        "type" : "string",
        "enum": ["pen","eraser","book"]
    }
});
</script>


## Example 5
WYSIWYG editor with display only.
<div id="field5"> </div>
<script type="text/javascript" id="field5-script">
$("#field5").alpaca({
    "data": "&lt;p&gt;Hello World&lt;p&gt;",
    "options": {
        "type": "wysiwyg",
        "label": "HTML"
    },
    "schema": {
        "type" : "string"
    },
    "view": "VIEW_BOOTSTRAP_DISPLAY"
});
</script>


## Example 6
WYSIWYG editor with simplified buttons.
<div id="field6"> </div>
<script type="text/javascript" id="field6-script">
    $("#field6").alpaca({
        "data": "Ice cream is a <b>frozen</b> dessert usually made from <i>dairy products</i>, such as milk and cream, and often combined with fruits or other ingredients and flavors.",
        "options": {
            "type": "wysiwyg",
            "wysiwyg" : {
                "controls": "simple"
            }
        }
    });
</script>