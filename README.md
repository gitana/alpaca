# Alpaca - JSON Forms for jQuery and Bootstrap

Alpaca provides the easiest and fastest way to generate interactive forms for the web and mobile devices. 
It runs simply as HTML5 or more elaborately using Bootstrap.

Alpaca uses Handlebars to process JSON schema and provide developers with an extensible framework for implementing controls, wizards, layouts, I18N support and an custom data persistence.

The goal of Alpaca is to provide the open source community with a fantastic forms engine that rivals or beats what most
proprietary vendors offer.  Using Alpaca, you can host really nice forms for your back end services, whether they
are proprietary, enterprise or SaaS offerings.

The philosophy behind Alpaca is that you should design your forms once and have them work on lots of different devices
and UI engines without having to do the same work twice.

Here is a sample registration form written once and rendered using different approaches:

- [Twitter Bootstrap](http://www.alpacajs.org/demos/bootstrap/registration)
- [Plain HTML5](http://www.alpacajs.org/demos/web/registration)
- [With AMD and RequireJS](http://www.alpacajs.org/demos/amd/registration)

Alpaca is an open-source project licensed under Apache 2.0.  It was started in 2010 and has been growing steadily
since thanks to a really awesome community of customers, consultants and technology champions world-wide.


## Web Site, Documentation and CDN

For information, demos and documentation regarding Alpaca, please visit the 
<a href="http://www.alpacajs.org">the Alpaca Forms web site</a>.

Going forward, all distribution assets are available via free CDN via jsDelivr.

For example - 

    https://cdn.jsdelivr.net/npm/alpaca@<version>/dist/alpaca/bootstrap/alpaca.min.js
    https://cdn.jsdelivr.net/npm/alpaca@<version>/dist/alpaca/bootstrap/alpaca.min.css
    
Where `<version>` should be filled in (example: 1.5.26).

For more information, visit the <a href="http://www.alpacajs.org">Alpaca Forms web site</a>.


## Sponsors

Cloud CMS is actively developed and maintained by <a href="https://gitana.io">Gitana Software, Inc.</a> (https://gitana.io).

Cloud CMS is an API-First, JSON-friendly Content Management Platform for mobile and web applications.  It provides the
ideal backend for Alpaca forms design, capture and reporting.  Stop by our web site to 
<a href="https://gitana.io">learn more about Cloud CMS</a>.

The project also has a large number of customers who use Alpaca, contribute code and receive support, some of whom are 
listed on our <a href="https://www.alpacajs.org">web site</a>.


## Official Support

We offer paid support for your technical development and production environments.  Paid support includes a service
level agreement for priority response and bug fixes.  

If you are interested in sponsoring or are interested in consulting services, please [Contact Us](http://www.alpacajs.org/support.html).
 

## Community

We have an awesome community.  Everything is straight up out in the open and anyone can build or contribute.  We keep
everything under an Apache 2.0 license so that you're free to do whatever you please with Alpaca.

There are several ways to interact with the Alpaca community.

- [Browse the documentation](http://www.alpacajs.org/documentation.html) and try out the interactive examples.  On each page, you'll find a Disqus forum that you can use to ask questions specific to that page.  As others browse the documentation, they'll find your question and will have the context at hand to answer it.
- [Visit the Alpaca.js web site](http://www.alpacajs.org) and ask your question to the broader Alpaca community.  Be sure to include code samples, URLs or http://jsfiddle.net/ links so that others can reproduce your scenario quickly.  It's always best to empower others to help you.
- [Add a GitHub Issue](https://github.com/gitana/alpaca/issues) if you've found an actual bug or have a feature request that you'd like to get prioritized into the roadmap.
- [Submit a Pull Request](https://github.com/gitana/alpaca) if you've fixed a bug and want to contribute code back to the Alpaca project.  This is the most powerful and effective way to influence the product.  Pull requests give you a way to write your own additions or adjustments to the code base and make it very easy for us to merge your changes into the product.
- [Get Developer Assistance](http://www.alpacajs.org/support.html) if you have an urgent issue and would like priority paid support.  Cloud CMS and/or its partners provide fast and reliable developer assistance for your projects.


## Extensibility

Alpaca is designed to be very extensible, allowing you to plug in new field implementations, DOM layouts, callbacks, CSS classes,
I18N bundles and much more.  It also integrates naturally to HTTP service backends using a connector layer.

Alpaca is ideal for consultants or organizations that wish to have a solid JavaScript form engine that provides a platform
that they can grow into for current and future project needs.


## Can I fork Alpaca and use it my own projects?

Yes, absolutely.  That's the whole idea.  Fork it, use it in your projects, make money from it, live a better life, spend more time with
your kids.  We hope that Alpaca is useful to you.

If you come up with something good (like a bug fix or a new feature), consider submitting a Pull Request back to the project so that
others may benefit.  And so that they too might, in turn, get more sleep, enjoy your work, be happier and get more out of this adventure
called life.
 
 
## Compatibility

The latest release of Alpaca is compatible with jQuery 1.9.1 and up.  For a full breakdown of the third-party
libraries (and versions) that the optional fields integrate with, check `site/package.json`.
 
In general, we aspire to support the latest versions of our third-party dependencies.  Some folks may want Alpaca to be
backward-compatible with earlier versions of dependencies and in general, it is our desire to have it be so.  But in
cases where that is not possible, we will opt for the latest.  In those cases, we recommend folks fall back to an 
earlier version of Alpaca.
 

## How to Build Alpaca

The first thing you should do is grab the source.  We won't cover how to do that here but instead we recommend that
you learn about Git and GitHub.  You can pull the source down to your local machine to build things locally.

The command line for doing this is basically:

    git clone https://github.com/gitana/alpaca.git


### Build

All you need is Node.js (20 or later).  Install the dependencies:

    npm install

And then build:

    npm run build

This will build to `dist/alpaca` (the directory that gets published) in well under a second.  Handlebars
templates are precompiled and JS / CSS are minified with [esbuild](https://esbuild.github.io).  The build script lives in `scripts/build.mjs` and the ordered list
of source files lives in `scripts/sources.mjs`.

| Command              | What it does                                                              |
|----------------------|---------------------------------------------------------------------------|
| `npm run build`      | Build the library into `dist/alpaca`                                      |
| `npm run watch`      | Build, then rebuild whenever `src/` changes                               |
| `npm test`           | Build, then run the test suite                                            |
| `npm run test:watch` | Run the test suite in watch mode                                          |
| `npm run bench`      | Benchmark rendering, validation and refresh (`--save` / `--compare` a run) |
| `npm run dev`        | Watch the library and serve the web site with live reload on :9999        |
| `npm run site`       | Build the library and the web site into `dist/site`                       |
| `npm run site:install` | Reinstall the web site's third-party libraries (`site/package.json`)      |
| `npm run docs:api`   | Generate JSDoc API docs into `build/jsdoc`                                |
| `npm run lint`       | Run JSHint over `src/js`                                                  |
| `npm run clean`      | Remove `build` and `dist`                                                 |
| `npm run bump`       | Bump the minor version in `package.json` (no git commit or tag)           |


### Tests

Tests use [Vitest](https://vitest.dev).  Each test boots a fresh [jsdom](https://github.com/jsdom/jsdom) window with
jQuery, Handlebars and the built Alpaca bundle loaded as browser globals (see `tests/harness.js`), so they exercise
exactly what ships in `dist/alpaca`.  Test suites cover both the `web` and `bootstrap` distributions.

    npm test


### Building the Web Site

The web site (`site/`) is built with [Eleventy](https://www.11ty.dev) using Liquid templates and Markdown.  The site's
third-party libraries (jQuery, Bootstrap, CKEditor, etc.) are declared in `site/package.json` and published under
`/lib`.  They're installed automatically the first time you build or serve the site.

Build it to `dist/site`:

    npm run site

Or run it locally with live reload at http://localhost:9999 (this also rebuilds Alpaca as you edit `src/`):

    npm run dev

Only files that start with front matter (`---`) are treated as templates; everything else under `site/` is copied
as-is.  Field documentation pages can include `<!-- INCLUDE_API_DOCS: <fieldType> -->` to have schema and options
tables generated from the field's implementation.


### Alpaca Distributions

The build produces two sets of assets and they are placed in:

- `dist/alpaca/web` (for basic web forms and layout)
- `dist/alpaca/bootstrap` (for bootstrap enabled forms and layout)

Each directory contains a JS file and a CSS file (plus minified versions) for its respective build.

Each JS file is UMD ready and will work within both an AMD and CommonJS container, or as a plain `<script>` that
defines a global `Alpaca`.


### Releasing

Bump the minor version with `npm run bump` (or use `npm version patch` / `major`).  Then run `./deploy.sh` to build, tag, publish to npm and push the web site.



## Contributors

Here is a long list of our project's brothers and sisters in arms.  
These folks have made numerous contributions to Alpaca over the years:

+ [@cloudcms](http://github.com/cloudcms)
+ [@uzquiano](http://github.com/uzquiano)
+ [@harrymoore](https://github.com/harrymoore)
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
+ [@mll5](https://github.com/mll5)
+ [@PoltoS](https://github.com/PoltoS)
+ [@billbarsch](https://github.com/billbarsch)
+ [@vittala](https://github.com/vittala)
+ [@robustified](https://github.com/robustified)
+ [@cniesen](https://github.com/cniesen)
+ [@degenhard](https://github.com/degenhard)
+ [@robsiera](https://github.com/robsiera)
+ [@cheeweep](https://github.com/cheeweep)
+ [@j123b567](https://github.com/j123b567)
+ [@scadams](https://github.com/scadams)
+ [@ryanmark](https://github.com/ryanmark)
+ [@techbrew-mc](https://github.com/techbrew-mc)
+ [@st3v](https://github.com/st3v)
+ [@basvandenheuvel](https://github.com/basvandenheuvel)
+ [@simonemedasfedro](https://github.com/simonemedasfedro)
+ [@78Gills](https://github.com/78Gills)
+ [@PirateSteve](https://github.com/PirateSteve)
+ [@dthompsonza](https://github.com/dthompsonza)
+ [@ousou](https://github.com/ousou)
+ [@azahid](https://github.com/azahid)
+ [@neilyoung](https://github.com/neilyoung)
+ [@apanagio](https://github.com/apanagio)
+ [@marcostorto](https://github.com/marcostorto)
+ [@ToreOlavKristiansen](https://github.com/ToreOlavKristiansen)
+ [@sachatrauwaen](https://github.com/sachatrauwaen)
+ [@sfesiura](https://github.com/sfesiura)
+ [@Felttrip](https://github.com/Felttrip)
+ [@gertingold](https://github.com/gertingold)
+ [@sivapalan](https://github.com/sivapalan)
+ [@caluwaertp](https://github.com/caluwaertp)
+ [@ambischof](https://github.com/ambischof)
+ [@hcmabreu](https://github.com/hcmabreu)
+ [@AzuraGroup](https://github.com/AzuraGroup)
+ [@mlarman70](https://github.com/mlarman70)
+ [@christoph007](https://github.com/christoph007)
+ [@MaZZly](https://github.com/MaZZly)
+ [@maximzmushko](https://github.com/maximzmushko)
+ [@DavidePastore](https://github.com/DavidePastore)
+ [@hauntingEcho](https://github.com/hauntingEcho)
+ [@ml2439](https://github.com/ml2439)
+ [@bradh](https://github.com/bradh)

...and many others via the [Alpaca Web Site](http://www.alpacajs.org) and
[Alpaca Issues](https://github.com/gitana/alpaca/issues)!
