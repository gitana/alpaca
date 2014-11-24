---
layout: demo
title: Clubs (View Selector)
header: Clubs (View Selector)
framework: Twitter Bootstrap
---

This demo lets you change views and select clubs to see how the formatting changes.

<div id="selector1"></div>
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#selector1").alpaca({
    "schema": {
        "type": "string",
        "enum": [
            "bootstrap-edit",
            "bootstrap-edit-horizontal",
            "bootstrap-display",
            "bootstrap-create",
            "bootstrap-create-horizontal"
        ],
        "default": "bootstrap-edit"
    },
    "options": {
        "type": "select",
        "onFieldChange" : function(e) {
            f(this.getValue());
        }
    }
});

var f = function(viewId)
{
    $("#field1").empty();

    $("#field1").alpaca({
        "schema": {
            "type":"object",
            "properties": {
                "name": {
                    "type":"string"
                },
                "birthday": {
                    "type": "string"
                },
                "team": {
                    "type": "string",
                    "enum": [
                        "Anzhi-Makhachkla",
                        "Arsenal",
                        "Atletico-Madrid",
                        "Barcelona",
                        "Bayern-Munich",
                        "Benfica",
                        "Borussia-Dortmund",
                        "Chelsea",
                        "Eintracht-Frankfurt",
                        "FC-Twente",
                        "Juventus",
                        "Malaga",
                        "Manchester-City",
                        "Manchester-United",
                        "Marseille",
                        "Napoli",
                        "Paris-Saint-Germain",
                        "Real-Madrid",
                        "Shakhtar-Donetsk",
                        "Tottenham-Hotspur"
                    ]
                }
            }
        },
        "options":{
            "fields": {
                "name": {
                    "size": 20,
                    "label": "Name"
                },
                "birthday": {
                    "type" : "date",
                    "size": 20,
                    "label": "Date of Birth"
                },
                "team": {
                    "type" : "select",
                    "size": 20,
                    "label": "Team",
                    "helper": "Select your preferred team",
                    "onFieldChange" : function(e) {

                        $("#logo1").empty();

                        var value = this.getValue();
                        if (value) {
                            var img = $("<img src='/images/club-logos/" + value + ".png'>");
                            $("#logo1").append(img);
                        }
                    }

                }
            }
        },
        "view": {
            "parent": viewId,
            "layout": {
                "template": "./clubs-template.html",
                "bindings": {
                    "name": "left",
                    "birthday": "left",
                    "team": "left"
                }
            }
        }
    });
};

f("bootstrap-edit");

</script>
{% endraw %}

