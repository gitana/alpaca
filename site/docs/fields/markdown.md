---
layout: documentation-field
title: Markdown Editor Field
header: Markdown Editor Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```markdown``` field.

The Markdown Editor field renders the SimpleMDE Markdown editor control that allows users to visually work with Markdown.

<!-- INCLUDE_API_DOCS: markdown -->


## Requirements
The Markdown Editor field depends on the SimpleMDE Markdown Editor library.  You can acquire this library from
<a href="https://simplemde.com/">https://simplemde.com/</a>.  This must be included in your page ahead of the control loading in order for this to work properly. Check out more configurable options here <a href="https://github.com/sparksuite/simplemde-markdown-editor/">https://github.com/sparksuite/simplemde-markdown-editor/</a>.


## Example 1
An example of a SimpleMDE Markdown field with a custom toolbar.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "## Custom Toolbar \n\n### This is an example with a custom toolbar \nGo ahead, play around with the editor! Be sure to check out **bold** and *italic* styling, or even [links](http://alpacajs.org). You can type the Markdown syntax, use the toolbar, or use shortcuts like `cmd-b` or `ctrl-b`. \n\n### Ordered List\n1. Book1\n2. Book2",
    "options": {
        "type": "markdown",
        "markdown": {
            "toolbar": ["bold", "italic", "heading", "|", "quote", "code", "ordered-list", "|", "preview"],
        }
    }
});
</script>
{% endraw %}


## Example 2
An example of a SimpleMDE Markdown field with auto-focus and auto-save enabled.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "## Enable autofocus and autosave \nBy default, it saves every 10 seconds, but this can be changed. When this textarea is included in a form, it will automatically forget the saved value when the form is submitted.",
    "options": {
        "type": "markdown",
        "markdown": {
            "autofocus": true,
            "autosave": {
                "enabled": true,
                "uniqueId": "fieldAutoSave"
            }
        }
    }
});
</script>
{% endraw %}


## Example 3
An example of a SimpleMDE Markdown field with spellChecker disabled.

<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "data": "## No spellChecker for this one \nThis is an example with spellChecker disabled.",
    "options": {
        "type": "markdown",
        "markdown": {
            "spellChecker": false
        }
    }
});
</script>
{% endraw %}

## Example 4
A SimpleMDE Markdown field with a button so that you can pull back the resulting JSON.
<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "schema": {
        "type": "string",
    },
    "options": {
        "type": "markdown",
        "markdown": {
            "spellChecker": false
        },
        "form": {
            "buttons": {
                "view": {
                    "label": "View JSON",
                    "click": function() {
                        alert(JSON.stringify(this.getValue(), null, "  "));
                    }
                }
            }
        }
    },
    "data": "Hello World"
});</script>
{% endraw %}