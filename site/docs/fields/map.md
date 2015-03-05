---
layout: documentation-field
title: Map Field
header: Map Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```map``` field.

<!-- INCLUDE_API_DOCS: map -->


## Example 1
Map field for user profiles.  A map field allows you express unique key IDs for an associative array object.
Click on the "view" button to show the resulting JSON.
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
                    "title" : "User ID",
                    "type": "string"
                },
                "firstName" : {
                    "title" : "First Name",
                    "type": "string"
                },
                "lastName" : {
                    "title" : "Last Name",
                    "type": "string"
                },
                "gender" : {
                    "title" : "Gender",
                    "type": "string",
                    "enum" : ["Male","Female"]
                }
            }
        }
    },
    "options" : {
        "type" : "map",
        "toolbarSticky" : true,
        "items" : {
            "fields" : {
                "_key" : {
                    "size" : 60,
                    "helper" : "This value serves as a unique key into the associative array."
                }
            }
        },
        "form": {
            "buttons": {
                "submit": {
                    "title": "View",
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


## Example 2
Here is an example where we hide the <code>_key</code> field.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": {
        "sonny" : {
            "firstName" : "Santino",
            "lastName" : "Corleone",
            "gender" : "Male"
        },
        "fredo" : {
            "firstName" : "Fredo",
            "lastName" : "Corleone",
            "gender" : "Male"
        },
        "michael" : {
            "firstName" : "Michael",
            "lastName" : "Corleone",
            "gender" : "Male"
        },
        "connie" : {
            "firstName" : "Connie",
            "lastName" : "Corleone",
            "gender" : "Female"
        }
    },
    "schema": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "_key" : {
                    "title" : "User ID",
                    "type": "string"
                },
                "firstName" : {
                    "title" : "First Name",
                    "type": "string"
                },
                "lastName" : {
                    "title" : "Last Name",
                    "type": "string"
                },
                "gender" : {
                    "title" : "Gender",
                    "type": "string",
                    "enum" : ["Male","Female"]
                }
            }
        }
    },
    "options" : {
        "type" : "map",
        "toolbarSticky" : true,
        "items" : {
            "fields" : {
                "_key" : {
                    "type": "hidden"
                }
            }
        },
        "form": {
            "buttons": {
                "submit": {
                    "title": "View",
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


## Example 3
Map field rendered in display-only mode.
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
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
        "items" : {
            "fields" : {
                "_key" : {
                    "size" : 60,
                    "helper" : "Provide a unique user id."
                }
            }
        }
    },
    "view": "bootstrap-display"
});
</script>
{% endraw %}


## Example 4: Map Validation
This example shows an object with an empty ```_key``` property.  As a result, the form renders with a validation error.
If a non-empty key is filled in, the form validates just fine.
<div id="field4"></div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
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