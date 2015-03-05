---
layout: documentation-field
title: TinyMCE Field
header: TinyMCE Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```tinymce``` field.

The TinyMCE Field renders the Tiny MCE editor control to allow users to visually work with HTML
and save the results back into a text property.

<!-- INCLUDE_API_DOCS: tinymce -->


## Requirements
The TinymCE Editor field depends on the TinyMCE library.  You can acquire this library from
<a href="http://www.tinymce.com/">http://www.tinymce.com/</a>.  This must be included in your page ahead of the control
loading in order for this to work properly.


## Example 1
A simple example of the Tiny MCE Editor at work.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "Ice cream is a <b>frozen</b> dessert usually made from <i>dairy products</i>, such as milk and cream, and often combined with fruits or other ingredients and flavors.",
    "options": {
        "type": "tinymce"
    }
});
</script>
{% endraw %}
