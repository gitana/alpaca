# Alpaca - Easy Forms for jQuery #

Alpaca is the Easy Forms Engine for jQuery and Twitter Bootstrap.

It is built around JSON schema to keep things simple. Using Alpaca, you can express your forms object model, types, properties and validation logic. Forms rendered with Alpaca provide intuitive interfaces for your users while giving your business an assurance of data compliance.

Alpaca comes pre-configured to work nicely with the following web frameworks:

- jQuery
- Twitter Bootstrap
- jQuery UI
- jQuery Mobile
- Barebones (empty CSS)

The Alpaca library is pre-packaged with controls, wizards, layouts, I18N support and pluggable template engines. We ship with support for jQuery Tmpl, EJS and Handlebars. Documentation and API information is provided so that you can extend Alpaca as you see fit.

The philosophy behind Alpaca is that you should design your forms once and have them work on lots of different devices and UI engines without recoding. Here is a sample registration form written once and rendered using four different approaches:

- [Twitter Bootstrap](http://www.alpacajs.org/demos/bootstrap/registration)
- [jQuery Mobile](http://www.alpacajs.org/demos/jquerymobile/registration)
- [jQuery UI](http://www.alpacajs.org/demos/browser/registration)
- [With AMD and RequireJS](http://www.alpacajs.org/demos/amd/registration)

Alpaca is an community-led open-source project licensed under Apache 2.0.

## Project Home Page

For information about the Alpaca Project, visit its home page at http://www.alpacajs.org.

We've collected videos, tutorials, API documentation and much more to help you get started.

## Compatibility

Alpaca is compatible with jQuery 1.8.x and jQuery 1.9.x.

## Discussion Board

If you have a question about Alpaca, please visit the [Alpaca Forums](http://www.cloudcms.org/forums/categories/alpaca).

This is a place where we encourage the community and developer community to get together to support one another in their Alpaca-related
projects.

## Contributions

In the spirit of open source software development, Alpaca always encourages community code contributions.

## Building Alpaca

In order to build Alpaca, you need to have [Apache Ant](http://ant.apache.org/) installed on your machine.  Ant executes a build script
(`build.xml`) to assemble the Alpaca build products.

First, clone a copy of the Alpaca git repo by running:

```
git clone git://github.com/gitana/alpaca.git
```

Make sure you have Apache Ant installed by testing:

```
ant -version
```

You can then build Alpaca by running:

```
ant clean package
```

The built version of Alpaca will be put in the `build/package` subdirectory.  This directory contains the Alpaca web site
(the same site that is deployed to [http://www.alpacajs.org](http://www.alpacajs.org)) along with all of the build
products.  These build products include:

### Alpaca JavaScript and CSS

The assets you need to reference for the built version of Alpaca are these:

 * /js/alpaca.js
 * /css

The `alpaca.js` file contains all of the basic and advanced fields.  If you only want the basic fields, you can reference the
`alpaca-core.js` file instead.

### Alpaca ZIP distributions

The build also produces two ZIP files which contain all of the assets.

 * /downloads/alpaca.zip
 * /downloads/alpaca-basic.zip (just the basic fields)

### Alpaca Components

If you're using AMD to include Alpaca, the AMD files are located in:

 * /components/alpaca (all fields)
 * /components/alpaca-core (just the basic fields)
 * /components/alpaca-extra (just the advanced fields)

## Running the Unit Tests

The unit tests are written using QUnit and are located in the `build/package/tests` directory.
You will need to run them using your web browser but in order to do that, you first need to mount
the `build/package` directory into your web server.  The Ant script provides a helper target to
let you do this.

First, create a file called `custom-local.properties` in the root of your Alpaca project.  In it, define a single
property that points to the destination where you would like your Alpaca build directory to be copied.  This should be
a virtual directory under your web server.

Here is an example:

```
local.docroot.basepath=/var/www
```

Then, run the following:

```
ant full
```

This will build Alpaca and copy the resulting assets to `/var/www/alpaca`.  If you've set up `/var/www` as the docroot
for your web server, you can run the QUnit tests by opening a web browser and pointing to:

```
http://localhost/alpaca/tests/index.html
```

## Connecting to Cloud CMS

Alpaca works with any backend HTTP service.  There is a connector layer and you can plug in your own persistence for forms, schema, options and layout.

Alpaca works out-of-the-box with [Cloud CMS](http://www.cloudcms.com).  Cloud CMS is a cost-effective backend content management system for mobile and web applications.  If you're looking for a quick way to capture and report on forms, please consider checking it out.

## Questions?

If you have any questions, please feel free to submit and issue or ask on
the [Alpaca Discussion Forums](http://www.cloudcms.org/forums/categories/alpaca).

## Authors

+ [@cloudcms](http://github.com/cloudcms)
+ [@uzquiano](http://github.com/uzquiano)
+ [@yaworsw](http://www.github.com/yaworsw)
+ [@drq](http://github.com/drq)


Thanks for assistance and contributions:

+ [@Maethorin](http://github.com/Maethorin)
+ [@jlanders68](http://github.com/jlanders68)
+ [@JocelynDelalande](http://github.com/JocelynDelalande)
+ [@Ognian](http://www.github.com/Ognian)
+ [@globocom](http://www.github.com/globocom)
+ [@urba](http://www.github.com/urba)
+ [@colegatron](http://www.github.com/colegatron)
+ [@Kirosoft](http://www.github.com/Kirosoft)
+ [@1337](http://www.github.com/1337)

