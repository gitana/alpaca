---
layout: page
title: Documentation
header: Documentation
group: navigation
sitemap:
  priority: 1.0
---
{% include JB/setup %}

This documentation provides form builders and developers with a reference for working with field controls, layouts,
templates, callbacks and other extensibility points within Alpaca.  As a very richly designed and powerful forms
engine, you can do quite a lot with Alpaca and so we encourage you to read through the docs thoroughly.
Within them, you will find configuration details as well as inline examples that you can tweak and play with.

<a name="fields"></a>
<h2>Fields</h2>
Alpaca provides many different out-of-the-box field types.  The core field types have no external dependencies
whereas the extension types depend on various third-party libraries.

<br/>

<h4>Core Fields</h4>
<div class="row">
    <div class="col-md-4">
        <ul>
            <li><a href="{{ BASE_PATH }}/docs/fields/any.html">Any</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/array.html">Array</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/checkbox.html">Checkbox</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/file.html">File</a></li>
        </ul>
    </div>
    <div class="col-md-4">
        <ul>
            <li><a href="{{ BASE_PATH }}/docs/fields/hidden.html">Hidden</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/number.html">Number</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/object.html">Object</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/radio.html">Radio</a></li>
        </ul>
    </div>
    <div class="col-md-4">
        <ul>
            <li><a href="{{ BASE_PATH }}/docs/fields/select.html">Select</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/textarea.html">Text Area</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/text.html">Text</a></li>
        </ul>
    </div>
</div>

<h4>More Fields</h4>
<div class="row">
    <div class="col-md-4">
        <ul>
            <li><a href="{{ BASE_PATH }}/docs/fields/address.html">Address</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/chooser.html">Chooser</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/color.html">Color</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/colorpicker.html">Color Picker</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/ckeditor.html">CK Editor</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/country.html">Country</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/currency.html">Currency</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/date.html">Date</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/datetime.html">Date Time</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/editor.html">Editor</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/email.html">Email</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/grid.html">Grid</a></li>
        </ul>
    </div>
    <div class="col-md-4">
        <ul>
            <li><a href="{{ BASE_PATH }}/docs/fields/image.html">Image</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/integer.html">Integer</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/ipv4.html">IPV4</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/json.html">JSON</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/lowercase.html">Lower Case</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/map.html">Map</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/markdown.html">Markdown Editor</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/optiontree.html">Option Tree</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/password.html">Password</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/personalname.html">Personal Name</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/phone.html">Phone</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/pickacolor.html">Pick A Color</a></li>
        </ul>
    </div>
    <div class="col-md-4">
        <ul>
            <li><a href="{{ BASE_PATH }}/docs/fields/search.html">Search</a></li>        
            <li><a href="{{ BASE_PATH }}/docs/fields/state.html">State</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/summernote.html">Summernote Editor</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/table.html">Table</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/tag.html">Tag</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/token.html">Token</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/time.html">Time</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/tinymce.html">Tiny MCE</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/upload.html">Upload</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/uppercase.html">Upper Case</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/url.html">URL</a></li>
            <li><a href="{{ BASE_PATH }}/docs/fields/zipcode.html">Zip Code</a></li>
        </ul>
    </div>
</div>

<a name="api"></a>
<h2>API Topics</h2>
We've provided chapters here on a variety of interesting API-related topics.

<div class="row">
    <div class="col-md-12">
        <ul>
            <li><a href="{{ BASE_PATH }}/docs/api/callbacks.html">Callbacks</a></li>
            <li><a href="{{ BASE_PATH }}/docs/api/connectors.html">Connectors</a></li>
            <li><a href="{{ BASE_PATH }}/docs/api/cookbook.html">Cookbook</a></li>
            <li><a href="{{ BASE_PATH }}/docs/api/conditional-dependencies.html">Conditional Dependencies</a></li>
            <li><a href="{{ BASE_PATH }}/docs/api/custom-fields.html">Custom Fields</a></li>
            <li><a href="{{ BASE_PATH }}/docs/api/datasources.html">Data Sources</a></li>
            <li><a href="{{ BASE_PATH }}/docs/api/dependencies.html">Dependencies</a></li>
            <li><a href="{{ BASE_PATH }}/docs/api/events.html">Events</a></li>
            <li><a href="{{ BASE_PATH }}/docs/api/functions.html">Functions</a></li>
            <li><a href="{{ BASE_PATH }}/docs/api/forms.html">Forms</a></li>
            <li><a href="{{ BASE_PATH }}/docs/api/i18n.html">Internationalization</a></li>
            <li><a href="{{ BASE_PATH }}/docs/api/layouts.html">Layouts</a></li>
            <li><a href="{{ BASE_PATH }}/docs/api/lookups.html">Lookups</a></li>
            <li><a href="{{ BASE_PATH }}/docs/api/observables.html">Observables</a></li>
            <li><a href="{{ BASE_PATH }}/docs/api/ordering.html">Ordering</a></li>
            <li><a href="{{ BASE_PATH }}/docs/api/references.html">References</a></li>
            <li><a href="{{ BASE_PATH }}/docs/api/recursive-references.html">Recursive References</a></li>
            <li><a href="{{ BASE_PATH }}/docs/api/serialization.html">Serialization</a></li>
            <li><a href="{{ BASE_PATH }}/docs/api/templates.html">Templates</a></li>
            <li><a href="{{ BASE_PATH }}/docs/api/usage.html">Usage</a></li>
            <li><a href="{{ BASE_PATH }}/docs/api/validation.html">Validation</a></li>
            <li><a href="{{ BASE_PATH }}/docs/api/views.html">Views</a></li>
            <li><a href="{{ BASE_PATH }}/docs/api/wizards.html">Wizards</a></li>
        </ul>
    </div>
</div>

<a name="cookbook"></a>
<h2>Cookbook - More Examples</h2>
Here are some more examples of more complex form configurations.

<div class="row">
    <div class="col-md-4">
        <ul>
            <li><a href="{{ BASE_PATH }}/docs/cookbook/nested-tables.html">Nested Tables</a></li>
        </ul>
    </div>
    <div class="col-md-4">
        <ul>
        </ul>
    </div>
    <div class="col-md-4">
        <ul>
        </ul>
    </div>
</div>

<a name="api"></a>
<h2>JavaScript Documentation</h2>
We generate JSDoc for all of the Alpaca source code.

<div class="row">
    <div class="col-md-12">
        <ul>
            <li><a href="http://code.cloudcms.com/alpaca/{{ site.alpaca_version }}/jsdoc/index.html" target="_blank">Alpaca JSDoc</a></li>
        </ul>
    </div>
</div>
