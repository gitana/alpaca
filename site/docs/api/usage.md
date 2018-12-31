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

## Static Overrides

With Alpaca, you can always set field-level options to configure the behavior of individual fields.  However, in some
cases, you may prefer to set global behaviors so that you can avoid doing this on a per-field basis.

The following static variables can be set and will be picked up by field implementations:

- ```Alpaca.defaultLocale``` - the locale to use for an I18N message lookups.  This is offered as an alternative to specifying this within the view.
- ```Alpaca.defaultFocus``` - the focus to set for any rendered forms.  This is an alternative to specifying the focus on the options of a field or form.
- ```Alpaca.defaultSort``` - the sort settings to use for any fields with enumerated values.  This is an alternative fo specifying the sort on the options for a field.
- ```Alpaca.defaultSchemaFieldMapping``` - describes which field type to use for a given JSON schema type.  For example, you might map ```string``` to a ```Custom.TextFieldEx``` implementation class.  By doing so, whenever Alpaca encounters a ```string``` schema type and doesn't otherwise know what field type to use, it will use your custom field type.
- ```Alpaca.defaultFormatFieldMapping``` - describes which field type to use for a given JSON schema format.
- ```Alpaca.defaultDateFormat``` - the default format string for dates (defaults to "MM/DD/YYYY")  See moment.js documentation for more information.
- ```Alpaca.defaultTimeFormat``` - the default format string for times (defaults to "HH:SS").  See moment.js documentation for more information.
- ```Alpaca.defaultView``` - the default view to use for any Alpaca invocations where view isn't specified
- ```Alpaca.defaultToolbarSticky``` - the default options.toolbarSticky value to use for arrays.
- ```Alpaca.defaultDragAndDrop``` - the default options.dragAndDrop value to use for arrays.
- ```Alpaca.defaultUI``` - if view is omitted, Alpaca makes a best effort to determine which view to use.  Valid values are ```bootstrap```, ```jquerymobile``` or ```jqueryui```.  If not provided, defaults to a web view.

## Static Error Handler

Error handling can be configured on a per-form or per-field basis but can also be specified globally:

- ```Alpaca.defaultErrorCallback```

Alpaca tries to find the most relevant (closest proximity) error handler.  If nothing can be found, it will fallback
to using the defaultErrorCallback.  You can override like this:

````
Alpaca.defaultErrorCallback = function(err) {

    // log it for our own purposes
    console.log("Behold!  An Alpaca error: " + JSON.stringify(err));
    
    // and throw a proper JS error
    throw new Error("Alpaca caught an error with the default error handler: " + JSON.stringify(error));
};
````
