---
layout: documentation-field
title: State Field
header: State Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```state``` field.

<!-- INCLUDE_API_DOCS: state -->


## Example 1
State field with US territories and states.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "options": {
        "type": "state"
    }
});
</script>
{% endraw %}


## Example 2
State field with US states only and capitalized.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "options": {
        "type": "state",
        "includeStates": true,
        "includeTerritories": false,
        "capitalize": true
    }
});
</script>
{% endraw %}


## Example 3
State field with US states only and state codes.
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "options": {
        "type": "state",
        "includeStates": true,
        "includeTerritories": false,
        "format": "code"
    }
});
</script>
{% endraw %}


## Example 4
State field rendered in a display-only view.
<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "data": "WI",
    "options": {
        "type": "state",
        "includeStates": true,
        "includeTerritories": false,
        "format": "code",
        "label": "State"
    },
    "view": "bootstrap-display"
});
</script>
{% endraw %}