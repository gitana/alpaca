---
layout: page
title: Download Alpaca
#tagline: Easy Forms for jQuery
sitemap:
  priority: 1.0
---
{% include JB/setup %}

The latest version of Alpaca is {{ site.alpaca_version }} released on {{ site.alpaca_date }}.

## CDN
You can include Alpaca in your projects by referencing the JS and CSS right from our CDN:

```
http://code.cloudcms.com/alpaca/{{site.alpaca_version}}/bootstrap/alpaca.min.js
http://code.cloudcms.com/alpaca/{{site.alpaca_version}}/bootstrap/alpaca.min.css
```

The example above is for <code>bootstrap</code>.  You can also access the builds for <code>web</code>,
<code>jquerymobile</code> and <code>jqueryui</code>.

## Bower
The easiest way to get Alpaca is to use <a href="http://bower.io" target="_blank">Twitter Bower</a>:

````
bower install alpaca
````

## Previous Releases
We've made available previous releases and version of the web site.  In some cases, you may have to build
Alpaca yourself from source.  For convenience, we provide archived "old versions" of Alpaca and the documentation.

If you're on a previous release, we recommend you upgrade to the latest release!

<ul>
    <li>
        <a href="http://www.alpacajs.org/releases/1.1.3/index.html">Alpaca 1.1.3</a>
    </li>
    <li>
        <a href="http://www.alpacajs.org/releases/1.1.2/index.html">Alpaca 1.1.2</a>
    </li>
    <li>
        <a href="http://www.alpacajs.org/releases/1.1.1/index.html">Alpaca 1.1.1</a>
    </li>
    <li>
        <a href="http://www.alpacajs.org/releases/1.1.0/index.html">Alpaca 1.1.0</a>
    </li>
    <li>
        <a href="http://www.alpacajs.org/releases/1.0.9/index.html">Alpaca 1.0.9</a>
    </li>
    <li>
        <a href="http://www.alpacajs.org/releases/1.0.8/index.html">Alpaca 1.0.8</a>
    </li>
    <li>
        <a href="http://www.alpacajs.org/releases/1.0.7/index.html">Alpaca 1.0.7</a>
    </li>
    <li>
        <a href="http://www.alpacajs.org/releases/1.0.6/index.html">Alpaca 1.0.6</a>
    </li>
    <li>
        <a href="http://www.alpacajs.org/releases/1.0.5/index.html">Alpaca 1.0.5</a>
    </li>
    <li>
        <a href="http://www.alpacajs.org/releases/1.0.4/index.html">Alpaca 1.0.4</a>
    </li>
    <li>
        <a href="http://www.alpacajs.org/releases/1.0.3/index.html">Alpaca 1.0.3</a>
    </li>
    <li>
        <a href="http://www.alpacajs.org/releases/1.0.2/index.html">Alpaca 1.0.2</a>
    </li>
    <li>
        <a href="http://www.alpacajs.org/releases/1.0.1/index.html">Alpaca 1.0.1</a>
    </li>
    <li>
        <a href="http://www.alpacajs.org/releases/1.0.0/index.html">Alpaca 1.0.0</a>
    </li>
</ul>


## Build from Source
If you're a system integrator, a developer or someone who likes to understand how things work, then the best way to
get your hands on Alpaca is to build from <a href="https://github.com/gitana/alpaca" target="_blank">source</a>.

The build is pretty straightforward.

It uses Bower, Node and Gulp to produce different distributions.  It also optionally uses Jekyll to produce the web site,
documentation and samples, all of which you can run locally.

Here is a link to the download of the project source:

* <a href="https://github.com/gitana/alpaca/archive/master.zip">alpaca-{{site.alpaca_version}}.zip</a>
