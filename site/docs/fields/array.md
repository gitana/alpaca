---
layout: documentation-field
title: Array Field
header: Array Field
group: navigation
tags: field
---
{% include JB/setup %}


The ```array``` field.


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
        }
    },
    "schema": {
        "description": "My Favorite Ice Creams",
        "type": "array",
        "items": {
            "title": "Ice Cream",
            "type": "string",
            "minLength": 3,
            "maxLength": 8,
            "minItems": 2,
            "maxItems": 5
        }
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
            "maxLength": 8,
            "minItems": 2,
            "maxItems": 5
        }
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
    }
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
Array field name.
<div id="field7"> </div>
{% raw %}
<script type="text/javascript" id="field7-script">
$("#field7").alpaca({
    "schema": {
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
    },
    "options" : {
        "toolbarSticky": true,
        "renderForm": true,
        "fields": {
            "item": {
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
    schema: {
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
        "renderForm":true,
        "fields":{
            "title": {
                "label": "Channel Title"
            },
            "array_videoClips": {
                "label": "Clip Details",
                "toolbarSticky": true,
                "collapsed": true,
                "fields": {
                    "item": {
                        "fields": {
                            "array_videoClipMedias": {
                                "label": "Clip Medias",
                                "toolbarSticky": true,
                                "collapsed": true,
                                "fields": {
                                    "item": {
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
Array field with an extra "clear" button on each item.
<div id="field9"> </div>
{% raw %}
<script type="text/javascript" id="field9-script">
$("#field9").alpaca({
    "data": ["test1", "test2", "test3"],
    "options": {
        "items": {
            "extraToolbarButtons" : [{
                "feature": "clear",
                "icon": "ui-icon-cancel",
                "label": "Clear inputs",
                "clickCallback": function(id, arrayField) {
                    var item = arrayField.childrenById[id];
                    $(item.field).val('');
                }
            }]
        }
    }
});
</script>
{% endraw %}


## Example 10
Array field with up and down buttons disabled and custom button text.
<div id="field10"> </div>
{% raw %}
<script type="text/javascript" id="field10-script">
$("#field10").alpaca({
    "data": ["test1", "test2", "test3"],
    "options": {
        "items": {
            "moveUpItemLabel" : "Get on up",
            "moveDownItemLabel": "Get down",
            "removeItemLabel": "Begone ye' item",
            "addItemLabel": "I addeth thee",
            "showMoveDownItemButton": false,
            "showMoveUpItemButton": false
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
    "view": "VIEW_BOOTSTRAP_DISPLAY"
});
</script>
{% endraw %}