---
layout: documentation-field
title: Address Field
header: Address Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```address``` field.

<!-- INCLUDE_API_DOCS: address -->


## Example 1
This example shows an address field that utilizes the Google Maps API to allow the
end user to modify an address and view it on a map.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
    $("#field1").alpaca({
        "schema": {
            "title": "Home Address",
            "type": "any"
        },
        "options": {
            "type": "address",
            "addressValidation": true,
            "showMapOnLoad": true
        },
        "data": {
            "street": [
                "308 Eddy Street",
                "Apartment #3"
            ],
            "city": "Ithaca",
            "state": "NY",
            "zip": "14850"
        }
    });
</script>
{% endraw %}


## Example 2
<p>Address field rendered in display-only mode.</p>
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
    $("#field2").alpaca({
        "data": {
            "street": [
                "308 Eddy Street",
                "Apartment #3"
            ],
            "city": "Ithaca",
            "state": "NY",
            "zip": "14850"
        },
        "options": {
            "type": "address"
        },
        "schema": {
            "title": "Home Address",
            "type": "any"
        },
        "view": "bootstrap-display"
    });
</script>
{% endraw %}