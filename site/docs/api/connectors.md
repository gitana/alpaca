---
layout: documentation-api
title: Connectors
header: Connectors
group: navigation
tags: field
---
{% include JB/setup %}

Alpaca supports Connectors as a means for loading schema, options, view and data information from remote data sources.
By default, Alpaca comes with a <code>default</code> connector that handles loading of data from public / unprotected
HTTP/HTTPS URLs.

Connectors are used to load information based on what they receive in the following properties:

- schemaSource
- optionsSource
- dataSource
- viewSource

Information loaded from any of these sources is merged with information that is fed directly into Alpaca.  This allows
you to provide some of the information within code and load the rest of it via the Connector.  An example is shown
below.

You can implement your own Connector classes by extending the <code>Alpaca.Connector</code> class.  This is shown
in one of the examples below as well.

## The Default Connector

The default connector supports the use of the following configuration properties to load remote files:

- dataSource
- schemaSource
- optionsSource
- viewSource

Here is an example where we load remote files into Alpaca:

- <a href="/data/connector-custom-data.json">connector-custom-data.json</a>
- <a href="/data/connector-custom-schema.json">connector-custom-schema.json</a>
- <a href="/data/connector-custom-options.json">connector-custom-options.json</a>
- <a href="/data/connector-custom-view.json">connector-custom-view.json</a>

<div id="field1"></div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "dataSource": "/data/connector-custom-data.json",
    "schemaSource": "/data/connector-custom-schema.json",
    "optionsSource": "/data/connector-custom-options.json",
    "viewSource": "/data/connector-custom-view.json"
});
</script>
{% endraw %}


## Merging Remote Data

Anything that is loaded via a connector is merged with whatever was passed into Alpaca.  This lets you do things like
instantiate Alpaca with a base configuration that might include default settings or inline functions while automatically
merging dynamically configurable stuff that comes from a remote source.

Let's extend what we did in the previous example.

Here is an example where we merge the <code>options</code> to override the validation logic for the <code>title</code>
field.  We plug in a custom validator using an inline function.  Since functions don't serialize via JSON over the wire,
we provide this function implementation when we invoke Alpaca and then let the Connector sort out the options data
retrieved over the wire.  This options data is merged with our block below and the resulting options are used
to render the form.

<div id="field2"></div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "dataSource": "/data/connector-custom-data.json",
    "schemaSource": "/data/connector-custom-schema.json",
    "optionsSource": "/data/connector-custom-options.json",
    "viewSource": "/data/connector-custom-view.json",
    "options": {
        "fields": {
            "title": {
                "validator": function(callback) {
                    var length = 0;
                    if (this.getValue()) {
                        length = this.getValue().replace(/[^A-Z]/g, "").length;
                    }
                    if (length > 4) {
                        callback({
                            "status": false,
                            "message": "There cannot be more than 4 capital letters in the title"
                        });
                        return;
                    }
                    callback({
                        "status": true
                    });
                }
            }
        }
    }
});
</script>
{% endraw %}


## Connect to Cloud CMS

Alpaca comes with a <code>cloudcms</code> connector that lets you load form information and data directly from
Cloud CMS.  The Cloud CMS connector requires that you first load the
<a href="https://www.cloudcms.com/javascript.html">Cloud CMS JavaScript Driver</a>.

To use it, simply set the <code>connector.id</code> property to <code>cloudcms</code> and provide the following
information to connect to your tenant:

- clientKey
- clientSecret
- username
- password
- application

You can get these bits by downloading your
<a href="https://www.cloudcms.com/apikeys.html">Developer API Keys</a>.

The Cloud CMS Connector lets you load content type definitions (schema), forms (options) and nodes (data)
seamlessly by referencing their QNames or Node IDs directly.

- schemaSource - the node ID or QName of the Cloud CMS content type definition
- optionSource - the node ID or form key of the Cloud CMS form
- dataSource - the node ID of the Cloud CMS JSON object holding your data

In the end, it ends up looking something like this:

<div id="field3"></div>
{% raw %}
<script type="text/javascript" src="http://code.cloudcms.com/gitana-javascript-driver/1.0.143/gitana.min.js"></script>
<script type="text/javascript" id="field3-script">
var connectionInfo = {
    "clientKey": "71abcafc-95c3-4ac7-ab53-10505c670dcd",
    "clientSecret": "rW8okB7ibSDJdG6ZRsqNUeNVMpv5HoE06dWOzS9VIt5e+MH5ih6dSRae45MclFYaNeL7ppkEBQu7SQIjqmabtivOk8eGDFeoMmjxKqoxIms=",
    "username": "8cfc5cf4-edb0-4682-8b69-d02993d7476e",
    "password": "koRU7MR6uYdYRCDKIB4whpyudqN5hAxegOzXkk0TR59/FJSAd7wZb24l2ZFGkTOOXoslY5ab54D5KaAPsCU/oB5P+DbWRySRyza0xRF4LiU=",
    "application": "825a3174818814c223db",
    "baseURL": "https://api.cloudcms.com"
};
$("#field3").alpaca({
    "connector": {
        "id": "cloudcms",
        "config": connectionInfo
    },
    "schemaSource": "custom:recipe",
    "optionsSource": "cdc16ae0748cf1520f31",
    "dataSource": "f68ed587eabf597738b3"
});
</script>
{% endraw %}


## Custom Connector (using SSO Header)

You can implement your own custom connectors and use them by specifying the <code>connector.id</code> configuration
option.  Simply declare your connector and register it with the framework first.

Here is an example where we extend the default connector and set a custom SSO header for use in connecting
to a backend server to load things:

<div id="field4"></div>
{% raw %}
<script type="text/javascript" id="field4-script">
var CustomConnector = Alpaca.Connector.extend({
    buildAjaxConfig: function(uri, isJson)
    {
        var ajaxConfig = this.base(uri, isJson);
        ajaxConfig.headers = {
            "ssoheader": "abcdef1"
        };
        return ajaxConfig;
    }
});
Alpaca.registerConnectorClass("custom", CustomConnector);
$("#field4").alpaca({
    "connector": "custom",
    "dataSource": "/data/connector-custom-data.json?a=1",
    "schemaSource": "/data/connector-custom-schema.json?a=1",
    "optionsSource": "/data/connector-custom-options.json?a=1",
    "viewSource": "/data/connector-custom-view.json?a=1"
});
</script>
{% endraw %}
