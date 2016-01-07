---
layout: documentation-api
title: Data Sources
header: Data Sources
group: navigation
tags: field
---
{% include JB/setup %}

Alpaca supports lazy loading of data from remote locations via data sources.  Data sources are supported by a limited
number of field types - including <code>select</code>, <code>radio</code> and <code>checkbox</code> fields.

To use a data source, specify the <code>dataSource</code> option for your field.

The <code>dataSource</code> option can be any of the following:

- a set of datasource <code>array</code> elements  directly supplied or a list of text items that will be converted to a data source array.
- an <code>object</code> consisting of key/value pairs to be used to generate the data source array
- the <code>text</code> URL for a remote GET endpoint where the datasource array will be loaded from.
- a <code>function</code> to call to acquire the datasource array.  The function has the signature <code>f(callback)</code> and the <code>this</code> reference is set to the field instance.  You can use this field instance to get at the field's current value and any other values from other members in the form.  You may opt to call out to your own backend and acquire data.  Fire the callback to pass the datasource array results back to Alpaca.
- a connector configuration (<code>object</code>) configuring data source array loading from a connector endpoint

The datasource array that is expected should be in the following format:

````
[{
  "value": "key 1", 
  "text: "display text 1"
}, {
  "value": "key 2", 
  "text: "display text 2"
}, {
  "value": "key 3", 
  "text: "display text 3"
}]
````

## Using a Data Source Array
The easiest way to configure a data source is just to specify the data source array directly.  There is nothing magical here.
Nothing is dynamic and nothing is lazy loaded.  Via this method, we can specify the text and value for each data source element.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "schema": {
        "type": "string",
        "title": "Pick an Action Hero"
    },
    "options": {
        "type": "select",
        "dataSource": [{
            "value": "rambo",
            "text": "John Rambo"
        }, {
            "value": "norris",
            "text": "Chuck Norris"
        }, {
            "value": "arnold",
            "text": "Arnold Schwarzenegger"
        }]
    }
});
</script>
{% endraw %}

## Using a Data Source Array (text)
Another stripped down option is to only specify text in the area.  In this case, Alpaca will assume the text for both the
text and value for the data source array that is generates.  Note that while this approach is simpler, it isn't equivalent
to the previous approach in that you lose the display text.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "schema": {
        "type": "string",
        "title": "Pick an Action Hero"
    },
    "options": {
        "type": "select",
        "dataSource": [
            "rambo", 
            "norris", 
            "arnold"
        ]
    }
});
</script>
{% endraw %}

## Using an Object
If an object is passed to the data source, the key/value pairs of the object will be interpreted to be string/string pairs
supplying the <code>value</code> and <code>text</code> respectively.

Here is how we can achieve the same example using an object.
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "schema": {
        "type": "string",
        "title": "Pick an Action Hero"
    },
    "options": {
        "type": "select",
        "dataSource": {
            "rambo": "John Rambo",
            "norris": "Chuck Norris",
            "arnold": "Arnold Schwarzenegger"
        }
    }
});
</script>
{% endraw %}

## Using a Remote URL
If the data source is text, it is assumed to specify a remote URL where the data source array can be acquired from
If the URL starts with "/" as shown here, Alpaca automatically loads from the base path to the origin server.

The URL connection is assumed to be a GET and unauthenticated.  If you need to control headers or access the underlying
XHR object, consider using a custom function.
<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "schema": {
        "type": "string",
        "title": "Pick an Action Hero"
    },
    "options": {
        "type": "select",
        "dataSource": "/data/datasource-example.json"
    }
});
</script>
{% endraw %}

## Using a Custom Function
We can plug in a custom function if we want to take full control over how we load the data.  The function should create the
data source array and pass it to the callback.
<div id="field5"> </div>
{% raw %}
<script type="text/javascript" id="field5-script">
$("#field5").alpaca({
    "schema": {
        "type": "string",
        "title": "Pick an Action Hero"
    },
    "options": {
        "type": "select",
        "dataSource": function(callback) {
            callback([{
                "value": "rambo",
                "text": "John Rambo"
            }, {
                "value": "norris",
                "text": "Chuck Norris"
            }, {
                "value": "arnold",
                "text": "Arnold Schwarzenegger"
            }]);
        }
    }
});
</script>
{% endraw %}

## Using a Connector
Alpaca has the notion of connectors to integrate with common backends.  Connectors understand how to load data sources based
on a configuration supplied.

For an example of connector usage within a data source, check out <a href="/docs/api/connectors.html">Connectors</a>.
