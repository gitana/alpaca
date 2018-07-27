---
layout: documentation-api
title: Cookbook
header: Cookbook
group: navigation
tags: field
---
{% include JB/setup %}

Here we collect a series of odds and ends related to the kinds of common things you might do with Alpaca.
You might consider this a collection of best practices though certainly not the only way to do things.

## Refreshing a Form

If you render a form at some point decide that you want to refresh it, you can use the <code>get</code> <a href="/docs/api/functions.html">special function</a> to acquire the Alpaca control and the <code>refresh</code>
method to do the deed.

You might try something like this:

<div id="field1"></div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "Hello World",
    "postRender": function() {
        // at some point in the future, refresh this bad boy
        var control = $("#field1").alpaca("get");
        control.refresh(function() {
            // behold, i am the callback that is fired once the refresh completes
        });
    }
})
</script>
{% endraw %}

