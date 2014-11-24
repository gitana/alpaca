---
layout: documentation-api
title: Serialization
header: Serialization
group: navigation
tags: field
---
{% include JB/setup %}

Serialization is the process of taking the data contained in a form and converting it into JSON or some other format
so that you can transport it.  Alpaca serializes data for you automatically, taking into account references, nested
structures, types and more.  By default, Alpaca serializes into JSON that is compatible with the underlying
JSON schema model.

## Simple Example

Here is a really simple form that is loaded from JSON and then serialized back out when you click "Serialize".

<div id="field1"></div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": {
        "firstName": "John",
        "lastName": "McClane"
    },
    "schema": {
        "type": "object",
        "properties": {
            "firstName": {
                "type": "string",
                "title": "First Name"
            },
            "lastName": {
                "type": "string",
                "title": "Last Name"
            }
        }
    },
    "options": {
        "form": {
            "buttons": {
                "submit": {
                    "title": "Serialize",
                    "click": function() {
                        var value = this.getValue();
                        alert(JSON.stringify(value, null, "  "));
                    }
                }
            }
        }
    }
});
</script>
{% endraw %}

## Objects with References

This example provides a complex object with nested references.  It is loaded with
data.  When you click the "serialize" button, the JSON is produced and displayed.

<div id="field2"></div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "dataSource": "/data/serialization-data.json",
    "schemaSource": "/data/serialization-schema.json",
    "options": {
        "form": {
            "buttons": {
                "submit": {
                    "title": "Serialize",
                    "click": function() {
                        var value = this.getValue();
                        alert(JSON.stringify(value, null, "  "));
                    }
                }
            }
        }
    }
});
</script>
{% endraw %}
