# Alpaca - Easy Forms for jQuery and Bootstrap

Alpaca provides the easiest and fastest way to generate interactive forms for the web and mobile devices. It runs simply as HTML5 or more elaborately using Bootstrap, jQuery Mobile or jQuery UI. Alpaca uses Handlebars to process JSON schema and provide developers with an extensible framework for implementing controls, wizards, layouts, I18N support and an custom data persistence.

The goal of Alpaca is to provide the open source community with a fantastic forms engine that rivals or beats what most
proprietary vendors offer.  Using Alpaca, you can host really nice forms for your back end services, whether they
are proprietary, enterprise or SaaS offerings.

The philosophy behind Alpaca is that you should design your forms once and have them work on lots of different devices
and UI engines without having to do the same work twice.

Here is a sample registration form written once and rendered using four different approaches:

- [Twitter Bootstrap](http://www.alpacajs.org/demos/bootstrap/registration)
- [jQuery Mobile](http://www.alpacajs.org/demos/jquerymobile/registration)
- [jQuery UI](http://www.alpacajs.org/demos/browser/registration)
- [With AMD and RequireJS](http://www.alpacajs.org/demos/amd/registration)

Alpaca is an open-source project licensed under Apache 2.0.  It is actively developed and maintained by
<a href="https://www.cloudcms.com">Cloud CMS</a>.
<a href="https://www.alpacajs.org/contact.html">Enterprise support is available</a> for your production deployments.


## Project Home Page

For information, demos and documentation regarding Alpaca, please visit the
<a href="http://www.alpacajs.org">the Alpaca Forms home page</a>.


## Compatibility

Alpaca is compatible with jQuery 1.9.1 and up.


## Issues and Discussions

If you have a question about Alpaca, please visit the [Alpaca Forums](http://www.cloudcms.org/forums/categories/alpaca).
This is a place where we encourage the community and developer community to get together to support one another in their Alpaca-related
projects.

If you find an issue with Alpaca, please <a href="https://github.com/gitana/alpaca/issues">add a new issue ticket</a>.


## How to Build Alpaca

The first thing you should do is grab the source.  We won't cover how to do that here but instead we recommend that
you learn about Git and GitHub.  You can pull the source down to your local machine to build things locally.

The command line for doing this is basically:

    git clone https://github.com/gitana/alpaca.git


### Prerequisites

To build Alpaca, you will need to have Node.js, Gulp and Bower installed.  If you're new to Node.js or Gulp, you could
check out this writeup - http://travismaynard.com/writing/getting-started-with-gulp.

Once you have Node.js installed, you essentially need to do this:

    npm install gulp -g
    npm install bower -g


### Building Alpaca

Building Alpaca is pretty easy.  Just run:

    npm install

This will do the following for you:

- pull down all of the Node module dependencies
- run Bower to pull down client-side (browser) dependencies

To then build, you can do this:

    npm start

If you want to use Gulp directly, you can alternatively run this:

    gulp clean default

Either ```npm start``` or ```gulp clean default``` will build everything.
The build distribution assets will be in ```build/alpaca```.


### Building the Web Site and Running a local Web Server

Alpaca includes a web site along with documentation, samples and much more.
To build the web site, you will first need to install Jekyll (not covered here).

Simply do this:

    gulp site

And you can run a local web server like this:

    gulp server


### Alpaca Distributions

The build produces four sets of assets and they are placed in:

- ```build/alpaca/web``` (for basic web forms and layout)
- ```build/alpaca/bootstrap``` (for bootstrap enabled forms and layout)
- ```build/alpaca/jqueryui``` (for jQuery UI enabled forms and layout)
- ```build/alpaca/jquerymobile``` (for jQuery Mobile enabled forms and layout)

Each directory contains a JS file and a CSS file for its respective build.

Each JS file is UMD ready and will work within both an AMD and CommonJS container.


### Troubleshooting

If you run into any Bower related issues during the build, you might want to clear out your Bower cache using this
command:

    bower cache clean

And then try again.


### Manual build commands

While ```npm install``` will pretty much do everything for you, there are also some manual commands you can run if you
need to perform individual steps:

- To install Bower assets, do ```bower install```
- To clear Bower cache, do ```bower cache clean```
- To run the Gulp build, do ```gulp```
- To build the Alpaca web site, do ```gulp default server```
- To run a local Alpaca web server, ```gulp default server```


## CDN

All of the Alpaca distribution assets are available via CDN at http://cdn.alpacajs.org.


## Connecting to Cloud CMS

Alpaca works with any backend HTTP service.  There is a connector layer and you can plug in your own persistence for forms, schema, options and layout.

Alpaca works out-of-the-box with [Cloud CMS](http://www.cloudcms.com).  Cloud CMS is a cost-effective backend content management system for mobile and web applications.  If you're looking for a quick way to capture and report on forms, please consider checking it out.


## Questions, Getting Involved and Contributing

There are several ways to interact with the Alpaca community.

- [Browse the documentation](http://www.alpacajs.org/documentation.html) and try out the interactive examples.  On each page, you'll find a Disqus forum that you can use to ask questions specific to that page.  As others browse the documentation, they'll find your question and will have the context at hand to answer it.
- [Visit the Alpaca.js forums](http://www.cloudcms.org) and ask your question to the broader Cloud CMS community.  Be sure to include code samples, URLs or http://jsfiddle.net/ links so that others can reproduce your scenario quickly.  It's always best to empower others to help you.
- [Add a GitHub Issue](https://github.com/gitana/alpaca/issues) if you've found an actual bug or have a feature request that you'd like to get prioritized into the roadmap.
- [Submit a Pull Request](https://github.com/gitana/alpaca) if you've fixed a bug and want to contribute code back to the Alpaca project.  This is the most powerful and effective way to influence the product.  Pull requests give you a way to write your own additions or adjustments to the code base and make it very easy for us to merge your changes into the product.
- [Contact Cloud CMS](https://www.cloudcms.com) if you have an urgent issue, a high priority deliverable or need technical support for Alpaca in production.  Cloud CMS sponsors the Alpaca project and can put engineers on your project to get things done quickly.

## Can I fork Alpaca and use it my own projects?

Yes, absolutely.  That's the whole idea.  Fork it, use it in your projects, make money from it, live a better life, spend more time with
your kids.  We hope that Alpaca proves useful to you.

If you come up with something good (like a bug fix or a new feature), consider submitting a Pull Request back to the project so that
others may benefit.  And so that they too might, in turn, get more sleep, enjoy your work, be happier and get more out of this adventure
called life.

## Contributors

+ [@cloudcms](http://github.com/cloudcms)
+ [@uzquiano](http://github.com/uzquiano)
+ [@yaworsw](http://github.com/yaworsw)
+ [@drq](http://github.com/drq)
+ [@Maethorin](http://github.com/Maethorin)
+ [@jlanders68](http://github.com/jlanders68)
+ [@JocelynDelalande](http://github.com/JocelynDelalande)
+ [@Ognian](http://www.github.com/Ognian)
+ [@globocom](http://www.github.com/globocom)
+ [@urba](http://www.github.com/urba)
+ [@colegatron](http://www.github.com/colegatron)
+ [@Kirosoft](http://www.github.com/Kirosoft)
+ [@1337](http://www.github.com/1337)
+ [@jkernagis2](https://github.com/jkernagis2)
+ [@ASchriever](https://github.com/ASchriever)
+ [@hooflung64](https://github.com/hooflung64)
+ [@Shadowsrik](https://github.com/Shadowsrik)
+ [@deviant32](https://github.com/deviant32)
+ [@vikramsawant786](https://github.com/vikramsawant786)
+ [@tylerperyea](https://github.com/tylerperyea)
+ [@picsoung](https://github.com/picsoung)
+ [@jmcgdz](https://github.com/jmcgdz)
+ [@ytaka](https://github.com/ytaka)
+ [@jflowers45](https://github.com/jflowers45)
+ [@paierh](https://github.com/paierh)
+ [@darmar](https://github.com/darmar)
+ [@arthurportas](https://github.com/arthurportas)
+ [@emircal](https://github.com/emircal)
+ [@xaviergonz](https://github.com/xaviergonz)
+ [@musicist288](https://github.com/musicist288)
+ [@mschnee](https://github.com/mschnee)
+ [@Uxio0](https://github.com/Uxio0)

...and many others via the [Alpaca Web Site](http://www.alpacajs.org), the [Alpaca Forums](http://www.cloudcms.org) and
[Alpaca Issues](https://github.com/gitana/alpaca/issues)!