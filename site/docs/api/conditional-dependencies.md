---
layout: documentation-api
title: Conditional Dependencies
header: Conditional Dependencies
group: navigation
tags: field
---
{% include JB/setup %}

Alpaca extends JSON Schema's <a href="dependencies.html">dependencies</a> capabilities by allowing you to define
conditional dependencies where dependencies are only valid based on conditional value matches with other fields.
This lets you get more precise with your dependency management.

If you want to go further and wire together completely custom form inter-dependencies that have little or nothing to
do with the underlying JSON Schema definition, take a look at Alpaca's support for
<a href="observables.html">observables</a> and <a href="events.html">events</a>.  These let you wire together fields
and plug in custom data source loaders so that values can be acquired on the fly as people use your form.

## Simple Example

Here is the Ice Cream Picker example from the <a href="dependencies.html">dependencies</a> page.  In this example,
the schema is similar (it's standard JSON schema).  However, in the options block we provide some more information
allowing us to specify that certain dependent fields should only appears when specific values are selected for
the <code>choice</code> field.

<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "schema": {
        "type": "object",
        "properties": {
            "choice": {
                "title": "Do you want to pick a Flavour or a Topping?",
                "type": "string",
                "enum": ["Flavour", "Topping"],
                "required": true
            },
            "flavour": {
                "title": "Pick a Flavour",
                "type": "string",
                "enum": ["Vanilla", "Chocolate", "Coffee", "Strawberry", "Mint"]
            },
            "topping": {
                "title": "Pick a Topping",
                "type": "string",
                "enum": ["Marshmellow", "Chocolate Chip", "Caramel", "Cookie Dough"]
            }
        },
        "dependencies": {
            "flavour": ["choice"],
            "topping": ["choice"]
        }
    },
    "options": {
        "fields": {
            "flavour": {
                "dependencies": {
                    "choice": "Flavour"
                }
            },
            "topping": {
                "dependencies": {
                    "choice": "Topping"
                }
            }
        }
    }
});
</script>
{% endraw %}


## Registration Form

Here is a simple registration form that lets people provide some information and then indicate whether they will be
 bringing their own meals to the event.  If they are not bringing their own meals, they can pick a meal plan to be
 provided to them.

<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": {
        "ownmeals": true
    },
    "schema": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string"
            },
            "age": {
                "type": "number"
            },
            "ownmeals": {
                "type": "boolean"
            },
            "mealplans": {
                "type": "object",
                "properties": {
                    "breakfast": {
                        "type": "boolean"
                    },
                    "lunch": {
                        "type": "boolean"
                    },
                    "dinner": {
                        "type": "boolean"
                    }
                },
                "dependencies": "ownmeals"
            }
        },
        "dependencies": {
            "mealplans": ["ownmeals"]
        }
    },
    "options": {
        "fields": {
            "name": {
                "type": "text",
                "label": "Name"
            },
            "age": {
                "type": "integer",
                "label": "Age"
            },
            "ownmeals": {
                "type": "checkbox",
                "rightLabel": "I will pay for my own meals"
            },
            "mealplans": {
                "label": "Select which pre-paid meals you would like",
                "fields": {
                    "breakfast": {
                        "type": "checkbox",
                        "rightLabel": "Five Star Continental Breakfast"
                    },
                    "lunch": {
                        "type": "checkbox",
                        "rightLabel": "Lunch at Statler Hall"
                    },
                    "dinner": {
                        "type": "checkbox",
                        "rightLabel": "Concourse Dinner at Okenshields"
                    }
                },
                "dependencies": {
                    "ownmeals": false
                }
            }
        }
    }
});
</script>
{% endraw %}


## Multi-Level / Nested Example

Demonstrates multi-level nested conditionals.  Everything is wrapped in a form so you can inspect the JSON
by clicking "Inspect".

<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "schema": {
        "title": "Conditional Field Test Case",
        "type": "object",
        "properties": {
            "ConditionalField": {
                "type": "string",
                "enum": [
                    "Don't Show Dependent Fields",
                    "Show Dependent Field A",
                    "Show Dependent Field B"
                ],
                "required": true,
                "default": "Don't Show Dependent Fields"
            },
            "DependentFieldA": {
                "type": "string",
                "title": "Dependent Field A"
            },
            "DependentFieldB": {
                "type": "string",
                "title": "Dependent Field B"
            },
            "ArrayOfFields": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "ConditionalFieldInArray": {
                            "type": "string",
                            "enum": [
                                "Don't Show Dependent Fields",
                                "Show Dependent Field in Array A",
                                "Show Dependent Field in Array B"
                            ],
                            "required": true,
                            "default": "Don't Show Dependent Fields"
                        },
                        "DependentFieldInArrayA": {
                            "type": "string",
                            "title": "Dependent Field In Array A"
                        },
                        "DependentFieldInArrayB": {
                            "type": "string",
                            "title": "Dependent Field In Array B"
                        }
                    },
                    "dependencies": {
                        "DependentFieldInArrayA": ["ConditionalFieldInArray"],
                        "DependentFieldInArrayB": ["ConditionalFieldInArray"],
                    }
                }
            }
        },
        "dependencies": {
            "DependentFieldA": ["ConditionalField"],
            "DependentFieldB": ["ConditionalField"]
        }
    },
    "options": {
        "fields": {
            "DependentFieldA": {
                "dependencies": {
                    "ConditionalField": "Show Dependent Field A"
                }
            },
            "DependentFieldB": {
                "dependencies": {
                    "ConditionalField": "Show Dependent Field B"
                }
            },
            "ArrayOfFields": {
                "fields": {
                    "item": {
                        "fields": {
                            "ConditionalFieldInArray": {
                                "vertical": true
                            },
                            "DependentFieldInArrayA": {
                                "dependencies": {
                                    "ConditionalFieldInArray": "Show Dependent Field in Array A"
                                }
                            },
                            "DependentFieldInArrayB": {
                                "dependencies": {
                                    "ConditionalFieldInArray": "Show Dependent Field in Array B"
                                }
                            }
                        }
                    }
                }
            }
        },
        "form": {
            "buttons": {
                "submit": {
                    "click": function() {
                        alert(JSON.stringify(this.getValue(), null, "  "));
                    }
                }
            }
        }
    }
});
</script>
{% endraw %}


## Arrays of Values

Conditional dependencies can also leverage arrays of possible values.

<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "schema": {
        "title": "Survey",
        "type": "object",
        "properties": {
            "fan": {
                "title": "Are you an Ice Cream fanatic?",
                "type": "string",
                "enum": ["Yes", "No", "Maybe"]
            },
            "icecream": {
                "title": "I see... so what is your favorite flavor?",
                "type": "String",
                "enum": ["Vanilla", "Chocolate", "Coffee", "Strawberry", "Mint"]
            }
        },
        "dependencies": {
            "icecream": ["fan"]
        }
    },
    "options": {
        "fields": {
            "fan": {
                "removeDefaultNone": true,
            },
            "icecream": {
                "dependencies": {
                    "fan": ["Yes", "Maybe"]
                }
            }
        },
        "form": {
            "buttons": {
                "submit": {
                    "title": "Show Results",
                    "click": function() {
                        alert(JSON.stringify(this.getValue()));
                    }
                }
            }
        }
    }
});
</script>
{% endraw %}