---
layout: documentation-cookbook
title: Nested Tables
header: Nested Tables
group: navigation
tags: field
---
{% include JB/setup %}

<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "data": [{
        "name": "Michael Jordan",
        "bio": "Michael Jeffrey Jordan (born February 17, 1963), also known by his initials, MJ, is an American retired professional basketball player, businessman, and principal owner and chairman of the Charlotte Hornets. Jordan played 15 seasons in the National Basketball Association (NBA) for the Chicago Bulls and Washington Wizards.",
        "attributes": [{
            "name": "sport",
            "value": "basketball"
        }, {
            "name": "height",
            "value": "1.98m"
        }]
    }, {
        "name": "Pele",
        "bio": "Edson Arantes do Nascimento (born 23 October 1940), known as Pelé, is a retired Brazilian professional footballer who played as a forward. He is widely regarded as the greatest football player of all time. Pelé has also been known for connecting the phrase 'The Beautiful Game' with football.",
        "attributes": [{
            "name": "sport",
            "value": "soccer"
        }, {
            "name": "height",
            "value": "1.73m"
        }]
    }, {
        "name": "Wayne Gretzky",
        "bio": "Wayne Douglas Gretzky (born January 26, 1961) is a Canadian former professional ice hockey player and former head coach. He played twenty seasons in the National Hockey League (NHL) for four teams from 1979 to 1999. Nicknamed 'The Great One', he has been called 'the greatest hockey player ever' by many sportswriters, players, and the league itself.",
        "attributes": [{
            "name": "sport",
            "value": "hockey"
        }, {
            "name": "height",
            "value": "1.83m"
        }]
    }],
    "schema": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "bio": {
                    "type": "string"
                },
                "attributes": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string"
                            },
                            "value": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        }
    },
    "options": {
        "type": "table",
        "label": "Athletes",
        "items": {
            "fields": {
                "name": {
                    "type": "personalname",
                    "label": "Name"
                },
                "bio": {
                    "type": "ckeditor",
                    "label": "Biography",
                    "ckeditor": {
                        "toolbar": [
                            ['Format', 'Font', 'FontSize'],
                            ['Bold', 'Italic', 'Underline', 'StrikeThrough']
                        ]
                    }
                },
                "attributes": {
                    "type": "table",
                    "label": "Attributes",
                    "items": {
                        "fields": {
                            "name": {
                                "type": "text",
                                "label": "Name"
                            },
                            "value": {
                                "type": "text",
                                "label": "Value"
                            }
                        }
                    },
                    "showActionsColumn": true,
                    "actionbar": {
                        "actions": [{
                            "action": "up",
                            "enabled": false
                        }, {
                            "action": "down",
                            "enabled": false
                        }]
                    }
                }
            }
        },
        "datatables": {
            "searching": true
        },
        "form": {
            "buttons": {
                "submit": {
                    "title": "Show JSON",
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
