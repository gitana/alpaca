# Alpaca - Easy Forms for jQuery

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

To build Alpaca, you will need to have Node.js and Gulp installed.  If you're new to Node.js or Gulp, you could
check out this writeup - http://travismaynard.com/writing/getting-started-with-gulp.  If you want to build the
Alpaca web site, you'll also need to install Jekyll.

The first thing you should do is sync the code:

    git clone https://github.com/gitana/alpaca.git

### Alpaca

Building Alpaca is pretty easy.  Just run:

    npm install

And then:

    gulp default

This will build Alpaca and place the distribution assets in: ```build/alpaca```

### Alpaca Web Site

To build the Alpaca web site, just run:

    gulp default web

This will build Alpaca and start it up on ```http://localhost:9999```.

## Alpaca Distributions

The build produces four sets of assets and they are placed in:

- ```build/alpaca/web``` (for basic web forms and layout)
- ```build/alpaca/bootstrap``` (for bootstrap enabled forms and layout)
- ```build/alpaca/jqueryui``` (for jQuery UI enabled forms and layout)
- ```build/alpaca/jquerymobile``` (for jQuery Mobile enabled forms and layout)

Each directory contains a JS file and a CSS file for its respective build.

Each JS file is UMD ready and will work within both an AMD and CommonJS container.

## Running the Unit Tests

TODO

## Questions?

If you have any questions, please feel free to submit and issue or ask on
the [Alpaca Discussion Forums](http://www.cloudcms.org/forums/categories/alpaca).

## Authors

+ [@cloudcms](http://github.com/cloudcms)
+ [@uzquiano](http://github.com/uzquiano)
+ [@yaworsw](http://github.com/yaworsw)
+ [@drq](http://github.com/drq)


Thanks for assistance and contributions:

+ [@Maethorin](http://github.com/Maethorin)
+ [@jlanders68](http://github.com/jlanders68)
+ [@JocelynDelalande](http://github.com/JocelynDelalande)
+ [@Ognian](http://www.github.com/Ognian)
+ [@globocom](http://www.github.com/globocom)
+ [@urba](http://www.github.com/urba)
+ [@colegatron](http://www.github.com/colegatron)
