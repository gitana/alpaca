---
layout: documentation-field
title: Text Area Field
header: Text Area Field
group: navigation
---
{% include JB/setup %}

The ```textarea``` field is used to represent text within a form.

<!-- INCLUDE_API_DOCS: textarea -->


## Example 1
A simple textarea field with a string of text.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "Ice cream or ice-cream is a frozen dessert usually made from dairy products, such as milk and cream, and often combined with fruits or other ingredients and flavours.",
    "options": {
        "type": "textarea"
    }
});
</script>
{% endraw %}


## Example 2
Textarea field with options parameter.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data":"Ice cream or ice-cream is a frozen dessert usually made from dairy products, such as milk and cream, and often combined with fruits or other ingredients and flavours.",
    "options": {
        "type": "textarea",
        "label": "Receipt",
        "helper": "Receipt for Best Homemade Ice Cream",
        "rows": 6,
        "cols": 80
    }
});
</script>
{% endraw %}


## Example 3
Textarea field rendered in display-only mode.
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "data":"Ice cream or ice-cream is a frozen dessert usually made from dairy products, such as milk and cream, and often combined with fruits or other ingredients and flavours.",
    "options": {
        "type": "textarea",
        "label": "Receipt",
        "helper": "Receipt for Best Homemade Ice Cream",
        "rows": 6,
        "cols": 80
    },
    "view": "bootstrap-display"
});
</script>
{% endraw %}


## Example 4
This example uses the <code>placeholder</code> option to set up the placeholder text
for a text area field.
<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "schema": {
        "type": "string"
    },
    "options": {
        "type": "textarea",
        "label": "Tell us about yourself",
        "placeholder": "Enter your bio here..."
    }
});
</script>
{% endraw %}

## Example 5
This example overrides the <code>view</code> property on the field to have just the single field render
in an alternate, display-only view.
<div id="field5"> </div>
{% raw %}
<script type="text/javascript" id="field5-script">
$("#field5").alpaca({
    "data": "My name is Dr. Jacobian and I am a neuroscientist from the Cornell University.  I've perfected a DNA transcription process which makes it possible for the first time to use DNA nucleotides to store pedabytes of information in real-time.",
    "schema": {
        "type": "string"
    },
    "options": {
        "type": "textarea",
        "label": "Tell us about yourself",
        "view": "bootstrap-display"
    }
});
</script>
{% endraw %}