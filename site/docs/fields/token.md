---
layout: documentation-field
title: Token Field
header: Token Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```token``` field.  This provides an implementation of the Bootstrap TokenField plugin on top of a text field
to allow for autocomplete and typeahead tokens in a comma (or alternative separator) delimited string.

For full documentation on the options available for the Bootstrap Tokenfield plugin, see:
http://sliptree.github.io/bootstrap-tokenfield

For full documentation on the options available for the Twitter Bloodhound Suggestion engine, see:
https://github.com/twitter/typeahead.js/blob/master/doc/bloodhound.md

<!-- INCLUDE_API_DOCS: token -->


## Example 1
Here is a token field that lets you pick character first names from the movie Back to the Future.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "schema": {
        "title": "Character Names",
        "type": "string"
    },
    "options": {
        "type": "token",
        "tokenfield": {
            "autocomplete": {
                "source": ["marty", "doc", "george", "biff", "lorraine", "mr. strickland"],
                "delay": 100
            },
            "showAutocompleteOnFocus": true
        }
    },
    "data": "marty,doc,george,biff"    
});
</script>
{% endraw %}


## Example 2
Here is the same thing but using a display-only view.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
    $("#field2").alpaca({
        "schema": {
            "title": "Character Names",
            "type": "string"
        },        
        "options": {
            "type": "token",
            "tokenfield": {
                "autocomplete": {
                    "source": ["marty", "doc", "george", "biff", "lorraine", "mr. strickland"],
                    "delay": 100
                },
                "showAutocompleteOnFocus": true
            }            
        },
        "data": "marty,doc,george,biff",        
        "view": "bootstrap-display"
    });
</script>
{% endraw %}

## Example 3
Here is a form with the token field taking in some of the values.  This form uses Ajax to retrieve the autocomplete values
from a remote source. Click the submit button to see the resulting JSON.
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
// this is an example of a remote engine
/*
var engine = new Bloodhound({
    "remote": {
        "url": "http://myserver/endpoint.php?search=%QUERY"
    },
    "wildcard": "%QUERY",
    "datumTokenizer": function(d) {
        return Bloodhound.tokenizers.whitespace(d.value);
    },    
    "queryTokenizer": Bloodhound.tokenizers.whitespace
});
*/
// this in example of a prefetch engine
var engine = new Bloodhound({
    "prefetch": {
        "url": "http://www.alpacajs.org/data/tokenfield-ajax1.json"
    },
    "datumTokenizer": function(d) {
        return Bloodhound.tokenizers.whitespace(d.value);
    },    
    "queryTokenizer": Bloodhound.tokenizers.whitespace
});
engine.initialize();
$("#field3").alpaca({
    "schema": {
        "title": "Product Attributes",
        "type": "object",
        "properties": {
            "name": {
                "title": "Product Name",
                "type": "string",
                "required": true
            },
            "age": {
                "title": "SKU",
                "type": "integer",
                "required": true
            },
            "facets": {
                "title": "Facets",
                "type": "string"
            }
        }
    },
    "options": {
        "fields": {
            "facets": {
                "type": "token",
                "tokenfield": {
                    "typeahead": [null, {
                        "highlight": true,
                        "source": engine.ttAdapter(),
                        templates:
                        {
                            "suggestion": Handlebars.compile("<div><p style='word-wrap:break-word; white-space: normal'>{{label}}</p></div>")
                        }
                    }]
                }
            }
        },
        "form": {
            "buttons": {
                "submit": {
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
