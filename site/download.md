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
You can include Alpaca in your projects by referencing the JS and CSS right from the <a href="https://www.jsdelivr.com" target="_blank">jsDelivr CDN</a>:

```
http://cdn.jsdelivr.net/npm/alpaca@{{site.alpaca_version}}/dist/alpaca/bootstrap/alpaca.min.js
http://cdn.jsdelivr.net/npm/alpaca@{{site.alpaca_version}}/dist/alpaca/bootstrap/alpaca.min.css
```

The example above is for <code>bootstrap</code>.  You can also access the builds for <code>web</code>,
<code>jquerymobile</code> and <code>jqueryui</code>.  SSL support is included with the CDN.

## NPM
The easiest way to get Alpaca is to use <a href="https://www.npmjs.com/package/alpaca">NPM</a> (Node Package Manager):

````
npm install alpaca
````

## Bower
The other easiest way to get Alpaca is to use <a href="http://bower.io" target="_blank">Twitter Bower</a>:

````
bower install alpaca
````

## Build it from Source
If you're a system integrator, a developer or someone who likes to understand how things work, then the best way to
get your hands on Alpaca is to <a href="https://github.com/gitana/alpaca" target="_blank">build Alpaca from source</a>.

The build is pretty straightforward.  Check the README.md file for precise instructions.

It uses Bower, Node and Gulp to produce different distributions.  It also optionally uses Jekyll to produce the web site,
documentation and samples, all of which you can run locally.

Here is a link to the download of the project source:

* <a href="https://github.com/gitana/alpaca/archive/master.zip">alpaca-{{site.alpaca_version}}.zip</a>

## Archived / Old Releases
We used to provide online documentation to older versions of Alpaca.  We no longer do.  Instead, we ask that you
check out the source code for your given release and build the web site from scratch.  The web site is contained
along with the source and so you should be able to build the site and reference all of the documentation that way.

The web site that you're looking at presently is for the current release.  Going forward, we're going to stick with
that and suggest that you upgrade your Alpaca to the latest version.
 