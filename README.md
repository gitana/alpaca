# Alpaca - Easy Web Forms for jQuery #

Alpaca is a plugin for jQuery, jQuery UI and jQuery Mobile that makes it easy to render beautiful HTML5 Web Forms for web and mobile applications.

Alpaca is built around JSON-Schema for expression of the form object model, types, properties, validation logic and constraints. It provides a comprehensive and extensible control library with support for wizards, layout, I18N and pluggable templating engines (like EJS and jQuery Templating).

Alpaca is an open-source, community-led project licensed under Apache 2.0.

## Project Home Page

For information about the Alpaca Project, visit its home page at http://www.alpacajs.org.

We've collected videos, tutorials, API documentation and much more to help you get started.

## Compatibility

Alpaca is compatible with jQuery 1.8.x and jQuery 1.9.0 using the jQuery Migrate Plugin.

## Discussion Board

If you have a question about Alpaca, please visit the [Alpaca Forums](http://www.cloudcms.org/forums/categories/alpaca).

This is a place where we encourage the community and developer community to get together to support one another in their Alpaca-related
projects.

## Contributions

In the spirit of open source software development, Alpaca always encourages community code contribution.

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

## Questions?

If you have any questions, please feel free to submit and issue or ask on 
the [Alpaca Discussion Forums](http://www.cloudcms.org/forums/categories/alpaca).

## Authors

+ [@drq](http://github.com/drq)
+ [@uzquiano](http://github.com/uzquiano)
+ [@cloudcms](http://github.com/cloudcms)

Thanks for assistance and contributions:

+ [@Maethorin](http://github.com/Maethorin)
+ [@jlanders68](http://github.com/jlanders68)
+ [@JocelynDelalande](http://github.com/JocelynDelalande)
