---
layout: documentation-field
title: Text Field
header: Text Field
group: navigation
---
{% include JB/setup %}


The ```text``` field is used to represent text within a form.

<!-- INCLUDE_API_DOCS: text -->

## Example 1
A simple example of using Alpaca with nothing more than a string of text.  Alpaca looks at your data and determines that it
is a string.  It then looks for a suitable candidate for representing a string and it decides to use the ```text``` field.

<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "I Love Alpaca Ice Cream!"
});
</script>
{% endraw %}


## Example 2
A more developed example that specifies not only the data but also the schema and options.  In this example, we intentionally set the data to something that is invalid.
The schema specifies that the maximum length of the allowed value is 8 characters.  Our value exceeds that and so we receive
a message straight away indicating this problem.

<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "Mint Chocolate",
    "schema": {
        "minLength": 3,
        "maxLength": 8
    },
    "options": {
        "label": "Ice Cream",
        "helper": "Please tell us the kind of ice cream you love most!",
        "size": 30,
        "placeholder": "Enter an ice cream flavor"
    }
});
</script>
{% endraw %}


## Example 3
Text field with data, schema, options and view parameters. The view parameter is
for injecting additional styles to make the field label float to the left of the
text field.

<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "data": "Mint",
    "schema": {
        "minLength": 3,
        "maxLength": 8
    },
    "options": {
        "label": "Ice Cream",
        "helper": "Your favorite ice cream?",
        "size": 30
    },
    "view": {
        "parent": "bootstrap-edit",
        "styles": {
            ".alpaca-controlfield-label": {
                "float": "left",
                "padding": "6px 0.3em 0 0"
            }
        }
    }
});
</script>
{% endraw %}


## Example 4
Text field with a mask. This feature is based on Josh Bush's <a href="http://digitalbush.com/projects/masked-input-plugin/">Masked Input Plugin</a>.
It allows a user to more easily enter fixed width input where you would like them to enter the data in a certain format (dates,phone numbers, etc).
The maskString parameter supports following predefined characters:

- a - Represents an alpha character (A-Z,a-z)
- 9 - Represents a numeric character (0-9)
- * - Represents an alphanumeric character (A-Z,a-z,0-9)

<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "data": "123-45-6789",
    "options": {
        "label": "Social Security Number",
        "helper": "Please enter your social security number.",
        "size": 30,
        "maskString": "999-99-9999"
    }
});
</script>
{% endraw %}


## Example 5
Text field with an event listener option that listens to keypress event and then prints out your input in an outside div in reverse order.

<div id="output"> </div>
<div id="field5"> </div>
{% raw %}
<script type="text/javascript" id="field5-script">
$("#field5").alpaca({
    "options": {
        "label": "Echo Your Input",
        "helper": "Type whatever you want to type.",
        "onFieldKeyup": function(e) {
            $('#output').html(this.getValue().split("").reverse().join(""));
        }
    }
});
</script>
{% endraw %}


## Example 6
Displays a text field using a display-only view.  The text field simply prints out and is not editable.

<div id="field6"> </div>
{% raw %}
<script type="text/javascript" id="field6-script">
$("#field6").alpaca({
    "data": "Mickey Mantle",
    "schema": {
        "type": "string"
    },
    "options": {
        "label": "Name"
    },
    "view": "bootstrap-display"
});
</script>
{% endraw %}


## Example 7
This example uses $.typeahead auto-completion with a function to provide lookup values.
The <code>config</code> block defines the first argument into the typeahead plugin.
The <code>datasets</code> block defines the second argument into the typeahead plugin.

<div id="field7"> </div>
{% raw %}
<script type="text/javascript" id="field7-script">
$("#field7").alpaca({
    "schema": {
        "type": "string"
    },
    "options": {
        "type": "text",
        "label": "Company Name",
        "helper": "Select the name of a cloud computing company",
        "typeahead": {
            "config": {
                "autoselect": true,
                "highlight": true,
                "hint": true,
                "minLength": 1
            },
            "datasets": {
                "type": "local",
                "source": function(query)
                {
                    var companies = [
                        "Cloud CMS",
                        "Amazon",
                        "HubSpot"
                    ];

                    var results = [];
                    for (var i = 0; i < companies.length; i++)
                    {
                        var add = true;

                        if (query)
                        {
                            add = (companies[i].indexOf(query) === 0);
                        }

                        if (add)
                        {
                            results.push({
                                "value": companies[i]
                            });
                        }
                    }

                    return results;
                }
            }
        }
    }
});
</script>
{% endraw %}


## Example 8
Simple configuration for $.typeahead auto-completion of the field value based on locally provided values.

By convention, the <code>source</code> setting is a function that provides the dataset for a given query (see the typeahead documentation).
To make things easier, we also accept an object with two fields - <code>type</code> and <code>source</code>.

If <code>type</code> is <code>local</code>, then an array can be passed in via <code>source</code>.  The array should be either simple
strings or an array of objects with the structure <code>{'value': ''}</code>.

If <code>type</code> is <code>remote</code>, then the source is a remote URL.  This should hand back an array of objects with the structure <code>{'value': ''}</code>.

If <code>type</code> is <code>prefetch</code>, the source is a prefetch URL.  This should hand back an array of objects with the structure <code>{'value': ''}</code>.

<div id="field8"> </div>
{% raw %}
<script type="text/javascript" id="field8-script">
    var colorNames = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];

    $("#field8").alpaca({
        "schema": {
            "type": "string"
        },
        "options": {
            "type": "text",
            "label": "CSS Color",
            "helper": "Provide the name of a CSS color you would like to use",
            "typeahead": {
                "datasets": {
                    "type": "local",
                    "source": colorNames
                }
            }
        }
    });
</script>
{% endraw %}


## Example 9
This example uses $.typeahead auto-completion with a remote data source.  Auto-completion
is provided for names of cloud computing companies.  It also uses Hogan.js to assist
with template driven rendering of the drop-down list.

The remote values are retrieved from a PHP script that accepts the input text as a query
parameter.  It uses this to perform a simple comparison.  In your own script, you'll likely
query a database or connect to a web service to produce matches.

<div id="field9"> </div>
{% raw %}
<script type="text/javascript" id="field9-script">
$("#field9").alpaca({
    "schema": {
        "type": "string"
    },
    "options": {
        "type": "text",
        "label": "Company Name",
        "helper": "Select the name of a cloud computing company",
        "typeahead": {
            "datasets": {
                "type": "remote",
                "source": "/docs/endpoints/typeahead-sample.php?q=%QUERY",
                "templates": {
                    "empty": "Nothing found...",
                    "header": "<h4>List of companies</h4><br/><br/>",
                    "footer": "<br/><br/><h4>Powered by Alpaca</h4>",
                    "suggestion": "<p style='color: blue'>{{value}}</p>"
                }
            }
        }
    }
});
</script>
{% endraw %}


## Example 10
This example uses the <code>placeholder</code> option to set up the placeholder text
for a text field.

<div id="field10"></div>
{% raw %}
<script type="text/javascript" id="field10-script">
$("#field10").alpaca({
    "schema": {
        "type": "string"
    },
    "options": {
        "type": "text",
        "label": "Speak thy name and enter...",
        "placeholder": "What is your name?"
    }
});
</script>
{% endraw %}


## Example 11
This example constrains the entered text value, forcing it to be at minimum 3 and at most 25.
This not only runs validation checks but also enforces some UI behavior.

This also shows how many characters are left for <code>maxLength</code> as you type.

<div id="field11"></div>
{% raw %}
<script type="text/javascript" id="field11-script">
$("#field11").alpaca({
    "schema": {
        "type": "string",
        "minLength": 3,
        "maxLength": 25
    },
    "options": {
        "type": "text",
        "label": "What is your name?",
        "constrainMaxLength": true,
        "constrainMinLength": true,
        "showMaxLengthIndicator": true
    },
    "data": "Jackie Robinson"
});
</script>
{% endraw %}


## Example 12
A text field with disallowed values.

<div id="field12"></div>
{% raw %}
<script type="text/javascript" id="field12-script">
$("#field12").alpaca({
    "data": "Mickey Mantle",
    "schema": {
        "type": "string",
        "disallow": ["Mickey Mantle", "Mickey"]
    },
    "options": {
        "label": "Name"
    }
});
</script>
{% endraw %}

## Example 13
A text field with autocomplete.

<div id="field13"></div>
{% raw %}
<script type="text/javascript" id="field13-script">
$("#field13").alpaca({
    "data": "Mickey Mantle",
    "schema": {
        "type": "string"
    },
    "options": {
        "label": "Name",
        "autocomplete": true
    }
});
</script>
{% endraw %}

## Example 14
A text with field with <code>disallowEmptySpaces</code> set to <code>true</code>.  This prevents the entry of spaces.
This is useful for things like username entry fields, as configured below.

<div id="field14"></div>
{% raw %}
<script type="text/javascript" id="field14-script">
$("#field14").alpaca({
    "schema": {
        "type": "string"
    },
    "options": {
        "type": "lowercase",
        "label": "User Name",
        "disallowEmptySpaces": true
    }
});
</script>
{% endraw %}

