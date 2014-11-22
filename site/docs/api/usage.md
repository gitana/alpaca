---
layout: documentation-api
title: Usage
header: Usage
group: navigation
tags: field
---
{% include JB/setup %}

Alpaca is packaged up as a function that you call to render a form on top of a DOM element.  The function takes
in the target DOM element and a configuration block.  It then figures out the schema, options and layout information
that is needed and sets about compiling any dynamic templates and assembling any views needed to make things work.
And then it renders, executing templates and committing DOM elements to the target.  It wires everything up and then
fires the <code>postRender</code> callback.

At various points during the rendering process, callbacks are fired.  In places where it makes sense, these callbacks
are asynchronous meaning that the handler methods receive a callback function of their own as part of the invocation.
They are responsible for firing this callback when they are finished doing whatever they're doing.  This lets you
extend Alpaca and use AJAX to make backend server connections, run worker threads in parallel or do anything else
you want that might chew up time.

The callback pattern is simple and easy for anyone to pick up.  We've had some folks as for promises to be used and
that is a possibility for the future.

In other points, callbacks are synchronous (such as for UI embellishment via view callbacks).  This is consistent
with the DOM callback nature (such as click or mouseover handlers) wherein everything in synchronous anyway.

## Invoking the Alpaca function

You can invoke Alpaca like this:

````
Alpaca(el, config);
````

The config block can be fully expressed like this:

````
Alpaca(el, {
    "data" : {Any} field data (optional),
    "schema": {Object} field schema (optional),
    "options" : {Object} field options (optional),
    "view": {Object|String} field view (object or id reference) (optional),
    "render": {Function} callback function for replacing default rendering method (optional),
    "postRender": {Function} callback function for post-rendering  (optional),
    "error": {Function} callback function for error handling  (optional),
    "connector": {Alpaca.Connector} connector for retrieving or storing data, schema, options, view and templates. (optional)
});
````

## Using jQuery

Alpaca can be invoked right form jQuery using the <code>$.fn.alpaca</code> method.

````
$(el).alpaca({
    "data" : {Any} field data (optional),
    "schema": {Object} field schema (optional),
    "options" : {Object} field options (optional),
    "view": {Object|String} field view (object or id reference) (optional),
    "render": {Function} callback function for replacing default rendering method (optional),
    "postRender": {Function} callback function for post-rendering  (optional),
    "error": {Function} callback function for error handling  (optional),
    "connector": {Alpaca.Connector} connector for retrieving or storing data, schema, options, view and templates. (optional)
});
````
