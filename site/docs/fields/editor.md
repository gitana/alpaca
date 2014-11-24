---
layout: documentation-field
title: Editor Field
header: Editor Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```editor``` field.

The editor field uses the <a target="_blank" href="http://ace.ajax.org">Cloud 9 ACE Editor</a> plugin to
render an inline editor that supports a wide array of textual content types.  The editor provides a number of
very powerful features and allows for the creation and modification of markup and code such as HTML, JavaScript,
Java and other languages.

<!-- INCLUDE_API_DOCS: editor -->


## Requirements
The Editor field requires the <a target="_blank" href="http://ace.ajax.org">Cloud 9 ACE Editor</a> to be loaded
ahead of its use.

Be sure to load <code>lib/ace/src-min-noconflict/ace.js</code> before rendering your forms.  You can
download ACE from <a target="_blank" href="http://ace.ajax.org">the ACE project on GitHub</a>.


## Example 1: Simple Configuration
You can instantiate an editor field by simply setting the ```type``` option to ```editor```.  The editor field produces text so make sure that the field type into which the editor places its results is a ```text``` field.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    'data': '{"firstName":"Pablo","lastName": "Neruda","age": 81}',
    'schema': {
        "type": "string"
    },
    'options': {
        "type": "editor"
    }
});
</script>
{% endraw %}


## Example 2: Using a different theme ("twilight")
The ACE editor supports <a href="https://github.com/ajaxorg/ace/tree/master/lib/ace/theme" target="_blank">a number of out-of-the-box themes</a>.  You can specify these themes
using the options configuration.  Here, we configure the ```twilight``` theme.  We also explicitly
set the width and the height of the editor.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    'data': '{"firstName": "Pablo","lastName": "Neruda","age": 81}',
    'schema': {
        'type': 'string'
    },
    'options': {
        'type': 'editor',
        'aceTheme': 'ace/theme/twilight',
        'aceWidth': '300px',
        'aceHeight': '200px'
    }
});
</script>
{% endraw %}


## Example 3: Editing a different content type (HTML)
The ACE editor also lets you configure for <a href="https://github.com/ajaxorg/ace/tree/master/lib/ace/mode">the editing different types of content</a>.  By default, the editor
configures itself to edit ```ace/mode/javascript``` which is the plugin for JavaScript files.  Here, we configure the editor
to edit HTML files by setting ```aceMode``` to ```ace/mode/html```.

We also set the ```aceFitContentHeight``` option to ```true``` to tell the editor to
automatically resize the height to fit its contents.
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "data": "<html><body><p>A sample paragraph</p></body></html>",
    "schema": {
        "type": "string"
    },
    "options": {
        "type": "editor",
        "aceMode": "ace/mode/html",
        "aceFitContentHeight": true
    }
});
</script>
{% endraw %}


## Example 4: Customizing the editor
The editor can be customized programmatically using the ACE editor API.  You can grab the reference
to the editor control via the ```postRender``` callback.

Take a look at <a href="http://ace.ajax.org/#nav=howto" target="_blank">ACE How To Guide</a> for some good
starting points on API customization.
<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "data": ".myclass {font-size:20px;}",
    "schema": {
        "type": "string"
    },
    "options": {
        "type": "editor",
        "aceTheme": "ace/theme/solarized_light",
        "aceMode": "ace/mode/css",
        "aceFitContentHeight": true
    },
    "postRender": function(control) {
        var editor = control.getEditor();
        editor.gotoLine(3);
        editor.insert("color: blue;");
    }
});
</script>
{% endraw %}


## Example 5: Multiple editors
You can use Alpaca to instantiate multiple editors if you'd like.  Here we instantiate
three editors - one for JavaScript, one for CSS and one for HTML.  When the JavaScript
editor's value changes, we update the HTML editor.
<div id="field5"> </div>
{% raw %}
<script type="text/javascript" id="field5-script">
$("#field5").alpaca({
    "schema": {
        "type": "object",
        "properties": {
            "js": {
                "type": "string"
            },
            "css": {
                "type": "string"
            },
            "html": {
                "type": "string",
                "readonly": true
            }
        }
    },
    "options": {
        "fields": {
            "js": {
                "label": "JavaScript",
                "type": "editor",
                "aceMode": "ace/mode/javascript",
                "aceFitContentHeight": true
            },
            "css": {
                "label": "CSS",
                "type": "editor",
                "aceMode": "ace/mode/css",
                "aceFitContentHeight": true
            },
            "html": {
                "label": "HTML",
                "type": "editor",
                "aceMode": "ace/mode/html",
                "aceFitContentHeight": true
            }
        }
    },
    "postRender": function(control) {
        var jsEditor = control.childrenByPropertyId["js"].getEditor();
        var cssEditor = control.childrenByPropertyId["css"].getEditor();
        var htmlEditor = control.childrenByPropertyId["html"].getEditor();
        jsEditor.insert("var title = 'Hello World';");
        cssEditor.insert(".field4-code {color:blue;}");
        var changeFunction = function() {
            var value = "&lt;style&gt;\r";
            value += cssEditor.getValue() + "\r";
            value += "&lt;/style&gt;\r";
            value += "&lt;pre class='field4-code'&gt;\r";
            value += jsEditor.getValue() + "\r";
            value += "&lt;/pre&gt;\r";
            htmlEditor.setValue(value);
            htmlEditor.clearSelection();
        };
        changeFunction();
        jsEditor.getSession().on('change', function(e) {
            changeFunction();
        });
        cssEditor.getSession().on('change', function(e) {
            changeFunction();
        });
    }
});
</script>
{% endraw %}


## Example 6: Editing Markdown
The editor can be used to edit a variety of formats including markdown.
<div id="field6"> </div>
{% raw %}
<script type="text/javascript" id="field6-script">
$("#field6").alpaca({
    "data": "## Hello World",
    "schema": {
        "type": "string"
    },
    "options": {
        "type": "editor",
        "aceMode": "ace/mode/markdown"
    }
});
</script>
{% endraw %}
