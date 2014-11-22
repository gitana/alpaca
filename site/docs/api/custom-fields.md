---
layout: documentation-api
title: Custom Fields
header: Custom Fields
group: navigation
tags: field
---
{% include JB/setup %}

Alpaca has a pretty inclusive field library that you can use straight away.  Fields are simply referenced by their
<code>type</code> within your Alpaca forms configuration.  If you don't provide specific field types to use, Alpaca
guesses at sensible defaults for you.

You can also create your own fields.  Alpaca fields are object-oriented (essentially) so that you can extend existing
fields, override methods and modify behaviors.  The result is less work and a complete extensibility layer so that you
can use Alpaca in your projects while building your own fields and UI components.

For a complete example of how to build fields, the best path is to look at the
<a href="https://github.com/gitana/alpaca">Alpaca source code</a>.  After all, Alpaca is completely open-source and
so the source code is always going to be the very best place to go.

If you're looking for professional services or support around custom fields, forms or functionality, please
<a href="support.html">contact the Alpaca team</a> and we can put together a services arrangement to deliver what
you need.

Here we provide some lightweight guidance here on how to build your own fields.

## Example: Capitalize all Words

Let's take a look at a quick and dirty example.  Here we create a new field with the type <code>custom1</code>
that extends the <code>text</code> field.  When the user enters a value and it is set onto the field, we override
the <code>setValue</code> method and capitalize all of the words.  We then proceed to the base method to let things
proceed on their merry way.

<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$.alpaca.Fields.Custom1Field = $.alpaca.Fields.TextField.extend({
    getFieldType: function() {
        return "custom1";
    },
    setValue: function(val)
    {
        var words = val.split(" ");
        for (var i = 0; i < words.length; i++)
        {
            var newWord = words[i].substring(0,1).toUpperCase();
            if (words[i].length > 1) {
                newWord += words[i].substring(1).toLowerCase();
            }
            words[i] = newWord;
        }
        this.base(words.join(" "));
    },
    onKeyPress: function(e)
    {
        this.base(e);
        var self = this;
        Alpaca.later(0, this, function() {
            var v = self.getValue();
            self.setValue(v);
        });
    }
});
Alpaca.registerFieldClass("custom1", Alpaca.Fields.Custom1Field);
$("#field1").alpaca({
    "schema": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "title": "What is your name?"
            }
        }
    },
    "options": {
        "fields": {
            "name": {
                "type": "custom1"
            }
        }
    }
});
</script>
{% endraw %}

## Example: Capitalize all Words (with Format)

We can use the same approach as the previous example while extending the JSON schema <code>format</code> settings.
Let's add our own format called "custom2".

<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$.alpaca.Fields.Custom2Field = $.alpaca.Fields.TextField.extend({
    getFieldType: function() {
        return "custom2";
    },
    setValue: function(val)
    {
        var words = val.split(" ");
        for (var i = 0; i < words.length; i++)
        {
            var newWord = words[i].substring(0,1).toUpperCase();
            if (words[i].length > 1) {
                newWord += words[i].substring(1).toLowerCase();
            }
            words[i] = newWord;
        }
        this.base(words.join(" "));
    },
    onKeyPress: function(e)
    {
        this.base(e);
        var self = this;
        Alpaca.later(0, this, function() {
            var v = self.getValue();
            self.setValue(v);
        });
    }
});
Alpaca.registerFieldClass("custom2", Alpaca.Fields.Custom2Field);
Alpaca.registerDefaultFormatFieldMapping("capitalized_words", "custom2");
$("#field2").alpaca({
    "schema": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "title": "What is your name?",
                "format": "capitalized_words"
            }
        }
    }
});
</script>
{% endraw %}


