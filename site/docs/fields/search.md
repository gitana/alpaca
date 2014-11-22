---
layout: documentation-field
title: Search Field
header: Search Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```search``` field implements a search box that provides a search-optimized control running in most modern
browsers.  It allows for the specification of search terms with an optimized user interface.

Note: This control does not perform the actual search for you.  It uses the HTML5 'search' input type to inform
the mobile device or web browser that you've focused into an input control intended for search term specification.

<!-- INCLUDE_API_DOCS: search -->


## Example 1
A simple search box with a pre-populated search term.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "Where for art thou Romeo?",
    "schema": {
        "type": "string"
    },
    "options": {
        "type": "search"
    }
});
</script>
{% endraw %}

## Example 2
A search box rendered in display-only mode.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "Where for art thou Romeo?",
    "view": "bootstrap-display",
    "options": {
        "label": "So, I asks ya...",
        "type": "search"
    }
});
</script>
{% endraw %}