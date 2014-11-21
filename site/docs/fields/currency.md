---
layout: documentation-field
title: Currency Field
header: Currency Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```currency``` field.

The currency field uses the <a target="_blank" href="http://jquerypriceformat.com/">JQuery Price Format</a> plugin to
render format the input as it's entered.

<!-- INCLUDE_API_DOCS: currency -->

## Requirements
The Editor field requires the <a target="_blank" href="http://jquerypriceformat.com/">JQuery Price Format</a> to be loaded
ahead of its use.

Be sure to load <code>lib/jquery.price_format.2.0/jquery.price_format.2.0.min.js</code> before rendering your forms.  You can
download JQuery Price Format from <a target="_blank" href="http://jquerypriceformat.com/">jquerypriceformat.com</a>.

JQuery Price Format overwrites the <code>unmask</code> method of the JQuery Masked Input plugin.  If you want to use JQuery Masked Input you should load  the price format plugin before you load the masked input plugin.


## Example 1
Currency field with default settings.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "options": {
        "type": "currency"
    }
});
</script>
{% endraw %}


## Example 2
Currency field with euro formatting.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "options": {
        "type": "currency",
        "centsSeparator": ",",
        "prefix": "",
        "suffix": "€",
        "thousandsSeparator": "."
    }
});
</script>
{% endraw %}

