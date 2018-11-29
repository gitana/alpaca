---
layout: documentation-field
title: Array Field
header: Array Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```array``` field.

<!-- INCLUDE_API_DOCS: array -->


## Example 1
Array field for an array of text items.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": ["test1", "test2", "test3"]
});
</script>
{% endraw %}


## Example 2
Array field with options for sticky toolbar, min items, max items etc.
Here we use the <code>hideToolbarWithChildren</code> option to keep the top-most button available to add new items
to the list.  We also hide the <code>add</code> button in the action bar for each row.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": ["Mint Chocolate"],
    "options": {
        "label": "Ice Cream",
        "helper": "Favorite Ice Cream",
        "itemLabel": "Favorite",
        "toolbarSticky" : true,
        "fields" : {
            "item" : {
                "size" : 20
            }
        },
        "hideToolbarWithChildren": false,
        "actionbar": {
            "actions": [{
                "action": "add",
                "enabled": false
            }]
        }
    },
    "schema": {
        "description": "My Favorite Ice Creams",
        "type": "array",
        "items": {
            "title": "Ice Cream",
            "type": "string",
            "minLength": 3,
            "maxLength": 8
        },
        "minItems": 2,
        "maxItems": 5        
    }
});
</script>
{% endraw %}


## Example 3
Array field with array default value.
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "schema": {
        "description": "My Favorite Ice Creams",
        "type": "array",
        "default": '["Vanilla","Mint","Moose Track"]',
        "items": {
            "title": "Ice Cream",
            "type": "string",
            "minLength": 3,
            "maxLength": 8
        },
        "minItems": 2,
        "maxItems": 5        
    }
});
</script>
{% endraw %}


## Example 4
Array field with string default value.
<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "schema": {
        "description": "My Favorite Ice Creams",
        "type": "array",
        "default": "Vanilla",
        "items": {
            "title": "Ice Cream",
            "type": "string"
        }
    }
});
</script>
{% endraw %}


## Example 5
Array field with item type as object.
<div id="field5"> </div>
{% raw %}
<script type="text/javascript" id="field5-script">
$("#field5").alpaca({
    "schema": {
        "description": "My Favorite Ice Creams",
        "type": "array",
        "items": {
            "title": "Ice Cream",
            "type": "object",
            "properties": {
                "flavor": {
                    "title": "Flavor",
                    "description": "Ice cream flavor",
                    "type": "string"
                },
                "topping": {
                    "title": "Topping",
                    "description": "Ice cream topping",
                    "type": "string"
                }
            }
        }
    },
    "data": [{
        "flavor": "strawberry",
        "topping": "nuts"
    }, {
        "flavor": "chocolate",
        "topping": "raisin"
    }]
});
</script>
{% endraw %}


## Example 6
Nested array field.
<div id="field6"> </div>
{% raw %}
<script type="text/javascript" id="field6-script">
$("#field6").alpaca({
    "schema": {
        "description": "Ice Cream Prices",
        "type": "array",
        "items": {
            "title": "Flavor Price",
            "type": "array",
            "items": {
                "title": "Price",
                "type": "number"
            }
        }
    }
});
</script>
{% endraw %}


## Example 7
Array field name.  Here we set the `toolbarPosition` option to `bottom` to position the toolbar below the array.
<div id="field7"> </div>
{% raw %}
<script type="text/javascript" id="field7-script">
$("#field7").alpaca({
    "schema": {
        "type": "object",
        "properties": {
            "list": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "type": {
                            "enum": ["internal", "external"]
                        },
                        "url": {
                            "type": "string",
                            "format": "uri"
                        }
                    }
                }                
            }
        }
    },
    "options" : {
        "fields": {
            "list": {
                "toolbarSticky": true,
                "toolbarPosition": "bottom",
                "items": {
                    "fields": {
                        "type": {
                            "label": "Type",
                            "optionLabels": ["Internal", "External"]
                        },
                        "url": {
                            "label": "URL"
                        }
                    }
                }
            }
        },
        "form": {
            "attributes": {
                "action": "save",
                "method": "post",
                "enctype": "multipart/form-data"
            },
            "buttons": {
                "submit": {}
            }
        }
    },
    "data": {
        "list": [{
            "type": "internal",
            "url": "http://alpacajs.org"
        },{
            "type": "external",
            "url": "https://cloudcms.com"
        }]
    }
});
</script>
{% endraw %}


## Example 8
Nested Array field name.
<div id="field8"> </div>
{% raw %}
<script type="text/javascript" id="field8-script">
$("#field8").alpaca({
    "schema": {
        "type": "object",
        "readonly": false,
        "properties": {
            "title": {
                "type": "string",
                "required": true,
                "default": "channelName"
            },
            "array_videoClips": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "array_videoClipMedias": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "mediaUrl": {
                                        "type": "string",
                                        "format": "uri"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "options": {
        "fields":{
            "title": {
                "label": "Channel Title"
            },
            "array_videoClips": {
                "label": "Clip Details",
                "toolbarSticky": true,
                "collapsed": true,
                "items": {
                    "fields": {
                        "array_videoClipMedias": {
                            "label": "Clip Medias",
                            "toolbarSticky": true,
                            "collapsed": true,
                            "items": {
                                "fields": {
                                    "mediaUrl": {
                                        "label": "Media URL",
                                        "helper": "Sample URL"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "form":{
            "attributes":{
                "action":"save",
                "method":"post",
                "enctype":"multipart/form-data"
            },
            "buttons":{
                "submit":{}
            }
        }
    }
});
</script>
{% endraw %}


## Example 9
Array field with an extra "clear" button in each item's action bar.
<div id="field9"> </div>
{% raw %}
<script type="text/javascript" id="field9-script">
$("#field9").alpaca({
    "data": ["test1", "test2", "test3"],
    "options": {
        "actionbar": {
            "showLabels": true,
            "actions": [{
                "label": "Clear",
                "action": "clear",
                "iconClass": "fa fa-cancel",
                "click": function(key, action, itemIndex) {
                    var item = this.children[itemIndex];
                    item.setValue("");
                }
            }]
        }
    }
});
</script>
{% endraw %}


## Example 10
Array fields support <code>toolbar</code> and <code>actionbar</code> options for defining custom actions.  Actions are
rendered by the view into the form and usually appear as a button bar.

For the toolbar, Alpaca assumes and auto-populates a single button - <code>add</code>.

For the actionbar (per item), Alpaca assumes and auto-populates the following buttons:
<ul>
    <li><code>add</code></li>
    <li><code>remove</code></li>
    <li><code>up</code></li>
    <li><code>down</code></li>
</ul>

Any properties you define for these actions will override the existing presets.  Any new actions you define will be
added to the overall set.  You can explicitly enable or disable actions via the <code>enabled</code> property.
Disabled actions are removed from display.

By default, the array field keeps labels turned off. If you want to turn labels on, use the <code>toolbar.showLabels</code>
and <code>actionbar.showLabels</code> options.
<div id="field10"> </div>
{% raw %}
<script type="text/javascript" id="field10-script">
$("#field10").alpaca({
    "data": ["test1", "test2", "test3"],
    "options": {
        "toolbar": {
            "showLabels": true,
            "actions": [{
                "label": "I addeth thee",
                "action": "add"
            }]
        },
        "actionbar": {
            "showLabels": true,
            "actions": [{
                "label": "Gimme another!",
                "action": "add"
            }, {
                "label": "Begone ye' item",
                "action": "remove"
            }, {
                "label": "Movin' on up",
                "action": "up",
                "enabled": false
            }, {
                "label": "Get down",
                "action": "down",
            }, {
                "label": "I do amazing things!",
                "action": "custom",
                "iconClass": "fa fa-file",
                "click": function(key, action, itemIndex) {
                    alert("forsooth! i have been clicked and my value is: " + this.children[itemIndex].getValue());
                }
            }]
        }
    }
});
</script>
{% endraw %}


## Example 11
Array field rendered in display-only mode.
<div id="field11"> </div>
{% raw %}
<script type="text/javascript" id="field11-script">
$("#field11").alpaca({
    "data": ["test1", "test2", "test3"],
    "view": "bootstrap-display"
});
</script>
{% endraw %}

## Example 12
An array field with four levels of nesting.
<div id="field12"> </div>
{% raw %}
<script type="text/javascript" id="field12-script">
$("#field12").alpaca({
    "schema": {
        "title": "Level1",
        "type": "array",
        "items": {
            "title": "Level2",
            "type": "array",
            "items": {
                "title": "Level3",
                "type": "array",
                "items": {
                    "title": "Level4",
                    "type": "array",
                    "items": {
                        "type": "string",
                        "enum": ["five", "six", "seven", "eight"]
                    }
                }
            }
        }
    }
});
</script>
{% endraw %}

## Example 13
An array field with nested radio elements.
<div id="field13"> </div>
{% raw %}
<script type="text/javascript" id="field13-script">
$("#field13").alpaca({
    "schema": {
        "title": "Array Test",
        "type": "object",
        "properties": {
            "devices": {
                "title": "Array test",
                "type": "array",
                "items": {
                    "title": "Device",
                    "type": "radio",
                    "enum": ["Android", "iOS"],
                    "default": "Android",
                    "required": true
                }
            }
        }
    },
    "options": {
        "collapsible": false,
        "fields": {
            "devices": {
                "type": "array",
                "toolbarSticky": true,
                "items": {
                    "type": "radio"
                }
            }
        }
    },
    "data": {
        "devices": ["iOS", "Android"]
    }
});</script>
{% endraw %}


## Example 14
An array field with unique items enforced.
<div id="field14"> </div>
{% raw %}
<script type="text/javascript" id="field14-script">
$("#field14").alpaca({
    "schema": {
        "title": "Product",
        "type": "object",
        "properties": {
            "id": {
                "title": "Product Identifier",
                "type": "integer"
            },
            "name": {
                "title": "Product Name",
                "type": "string"
            },
            "price": {
                "title": "Product Price",
                "type": "number",
                "minimum": 0,
                "exclusiveMinimum": true
            },
            "tags": {
                "title": "Product Tags",
                "type": "array",
                "items": {
                    "type": "string"
                },
                "minItems": 1,
                "uniqueItems": true
            }
        },
        "required": ["id", "name", "price"]
    },
    "options": {
        "fields": {
            "tags": {
                "toolbarSticky": true
            }
        }
    },
    "data": {
        "id": "1234",
        "name": "MyProduct",
        "price": 999,
        "tags": ["electric", "sale"]
    }
});</script>
{% endraw %}


## Example 15
An array field with radio selection embedded.
<div id="field15"> </div>
{% raw %}
<script type="text/javascript" id="field15-script">
$("#field15").alpaca({
    "schema": {
        "type": "object",
        "properties": {
            "list": {
                "type": "array",
                "title": "Layout",
                "items": {
                    "type": "string",
                    "title": "Box Size",
                    "enum": ["Small", "Medium", "Large"]
                }
            }
        }
    },
    "options": {
        "fields": {
            "list": {
                "type": "array",
                "label": "Slots",
                "items": {
                    "type": "radio",
                    "label": "Box Size",
                    "removeDefaultNone": true,
                    "vertical": false,
                    "emptySelectFirst": true,
                    "optionLabels": ["Small", "Medium", "Large"]
                },
                "toolbarSticky": true
            }
        },
        "form": {
            "buttons": {
                "view": {
                    "label": "View JSON",
                    "click": function() {
                        alert(JSON.stringify(this.getValue(), null, "  "));
                    }
                }
            }
        }
    }
});</script>
{% endraw %}


## Example 16
An array field with <code>dragAndDrop</code> enabled.
<div id="field16"> </div>
{% raw %}
<script type="text/javascript" id="field16-script">
$("#field16").alpaca({
    "data": ["test1", "test2", "test3"],
    "schema": {
        "type": "array"
    },
    "options": {
        "toolbarSticky": true,
        "dragAndDrop": true,
        "type": "array"
    }
});</script>
{% endraw %}


## Example 17
A nested array field with <code>dragAndDrop</code> enabled.
<div id="field17"> </div>
{% raw %}
<script type="text/javascript" id="field17-script">
$("#field17").alpaca({
    "schema": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "author": {
                    "type": "string"
                },
                "books": {
                    "items": {
                        "type": "string"
                    },
                    "type": "array"
                }
            }
        }
    },
    "options": {
        "type": "array",
        "toolbarSticky": true,
        "dragAndDrop": true,
        "label": "Author List",
        "items": {
            "fields": {
                "author": {
                    "type": "text",
                    "label": "Author"
                },
                "books": {
                    "type": "array",
                    "toolbarSticky": true,
                    "dragAndDrop": true,
                    "label": "Books",
                    "items": {
                        "type": "text"
                    }
                }
            }
        }
    },
    "data": [{
        "author": "George Orwell",
        "books": ["Animal Farm", "Nineteen Eighty-Four"]
    }, {
        "author": "余华",
        "books": ["活着", "现实一种", "许三观卖血记"]
    }]
});</script>
{% endraw %}