---
layout: documentation-field
title: Map Field
header: Map Field
group: navigation
tags: field
---
{% include JB/setup %}


The ```map``` field.


## Example 1
Map field for user profiles.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": {
        "john316" : {
            "firstName" : "Tim",
            "lastName" : "Tebow",
            "gender" : "Male"
        },
        "ladygaga" : {
            "firstName" : "Stefani",
            "lastName" : "Germanotta",
            "gender" : "Female"
        }
    },
    "schema": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "_key" : {
                    "title" : "User Id"
                },
                "firstName" : {
                    "title" : "First Name",
                    "description" : "Enter user's first name."
                },
                "lastName" : {
                    "title" : "Last Name",
                    "description" : "Enter user's last name."
                },
                "gender" : {
                    "title" : "Gender",
                    "description" : "Select user's gender",
                    "enum" : ["Male","Female"]
                }
            }
        }
    },
    "options" : {
        "type" : "map",
        "toolbarSticky" : true,
        "fields": {
            "item" : {
                "fields" : {
                    "_key" : {
                        "size" : 60,
                        "helper" : "Provide a unique user id."
                    }
                }
            }
        }
    }
});
</script>
{% endraw %}


## Example 2
Map field rendered in display-only mode.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": {
        "john316" : {
            "firstName" : "Tim",
            "lastName" : "Tebow",
            "gender" : "Male"
        },
        "ladygaga" : {
            "firstName" : "Stefani",
            "lastName" : "Germanotta",
            "gender" : "Female"
        }
    },
    "schema": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "_key" : {
                    "title" : "User Id"
                },
                "firstName" : {
                    "title" : "First Name",
                    "description" : "Enter user's first name."
                },
                "lastName" : {
                    "title" : "Last Name",
                    "description" : "Enter user's last name."
                },
                "gender" : {
                    "title" : "Gender",
                    "description" : "Select user's gender",
                    "enum" : ["Male","Female"]
                }
            }
        }
    },
    "options" : {
        "type" : "map",
        "toolbarSticky" : true,
        "fields": {
            "item" : {
                "fields" : {
                    "_key" : {
                        "size" : 60,
                        "helper" : "Provide a unique user id."
                    }
                }
            }
        }
    },
    "view": "bootstrap-display"
});
</script>
{% endraw %}


## Example 3: Map Validation
This example shows an object with an empty ```_key``` property.  As a result, the form renders with a validation error.
If a non-empty key is filled in, the form validates just fine.
<div id="field3"></div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "data": {
        "": {
            "firstName": "Bruce",
            "lastName": "Springsteen"
        }
    },
    "schema": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "_key" : {
                    "title" : "User Id"
                },
                "firstName" : {
                    "title" : "First Name"
                },
                "lastName" : {
                    "title" : "Last Name"
                }
            }
        }
    },
    "options" : {
        "type" : "map",
        "toolbarSticky" : true
    }
});
</script>
{% endraw %}