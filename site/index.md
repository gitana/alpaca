---
layout: page
title: Easy Web Forms for jQuery
title2: Alpaca - Easy Web Forms for jQuery
#tagline: Web Forms for jQuery and Bootstrap
---
{% include JB/setup %}

Alpaca provides the easiest way to generate interactive HTML5 forms for web and mobile applications.
It uses JSON Schema and simple Handlebars templates to generate great looking user interfaces on top of
<a href="http://twitter.github.com/bootstrap" target="_blank">Twitter Bootstrap</a>,
<a href="http://jqueryui.com" target="_blank">jQuery UI</a>,
<a href="http://jquerymobile.com" target="_blank">jQuery Mobile</a>
and HTML5.

Everything you need is provided out of the box.  Alpaca comes pre-stocked with a large library of controls,
templates, layouts and features to make rendering JSON-driven forms easy.  It is designed around an extensible
object-oriented pattern, allowing you to implement new controls, templates, I18N bundles and custom data
persistence for your projects.

Alpaca is open-source and provided to you under the Apache 2.0 license.  It is supported by
<a href="https://www.cloudcms.com">Cloud CMS</a> and is in use by organizations and within projects all around the world.

<div class="video-container" align="center">
     <iframe src="http://www.youtube.com/embed/mK4BXiGNbvA" frameborder="0" width="560" height="315"> </iframe>
</div>

## How do I use Alpaca?

<!-- STEP 1 -->
<div class="step">
    <img src="{{ BASE_PATH }}/images/step-1.png"/>
    Copy the following into the <code>&lt;head/&gt;</code> block of your web page:
    <br/>
    <br/>

<div class="codewrap">
<pre class="prettyprint linenums">
&lt;script type="text/javascript" src="alpaca.min.js"&gt;&lt;/script&gt;
&lt;link type="text/css" href="alpaca.min.css" rel="stylesheet"/&gt;
</pre>
</div>

</div>

<!-- STEP 2 -->
<div class="step">
    <img src="{{ BASE_PATH }}/images/step-2.png"/>
    Call <code>$.alpaca()</code> with your form schema and any configuration:
    <br/>
    <br/>

<div class="codewrap">
<pre class="prettyprint linenums">
&lt;div id="form1"&gt;&lt;/div&gt;

&lt;script type="text/javascript"&gt;
$("#form1").alpaca({
    "schema": {
        "title": "What do you think of Alpaca?",
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "title": "Name"
            },
            "ranking": {
                "type": "string",
                "title": "Ranking",
                "enum": ['excellent', 'not too shabby', 'alpaca built my hotrod']
            }
        }
    }
});
&lt;/script&gt;
</pre>
</div>

</div>

<!-- STEP 3 -->
<div class="step">
    <img src="{{ BASE_PATH }}/images/step-3.png"/>
    Enjoy your newly rendered Alpaca form!
    <br/>
    <br/>
    <div class="tutorial-panel">
        <div class="panel panel-default">
          <div class="panel-body">
            <div id="form1"></div>
          </div>
        </div>
    </div>
</div>


## Who uses Alpaca?

Lots of people.  Alpaca is an open-source project and has been around for almost 3 years.  We've had a great time
building it and have enjoyed the pull requests and adoption within some really great companies worldwide.  Here
are a few notable ones:

<div class="community">

    <div class="row">
        <div class="col-md-3">
            <div class="icon-holder">
                <a href="http://www.pearsoned.com/" target="_blank">
                    <img src="{{ BASE_PATH }}/images/community/pearson-150.png" style="max-width:125px" />
                </a>
            </div>
        </div>
        <div class="col-md-3">
            <div class="icon-holder">
                <a href="http://www.fox.com/" target="_blank">
                    <img src="{{ BASE_PATH }}/images/community/fox-entertainment-150.png" style="max-width:125px" />
                </a>
            </div>
        </div>
        <div class="col-md-3">
            <div class="icon-holder">
                <a href="http://www.trinet.com/" target="_blank">
                    <img src="{{ BASE_PATH }}/images/community/trinet-150.jpg" style="max-width:125px" />
                </a>
            </div>
        </div>
        <div class="col-md-3">
            <div class="icon-holder">
                <a href="http://www.cloudcms.com/" target="_blank">
                    <img src="{{ BASE_PATH }}/images/community/cloudcms-150.png" style="max-width:125px" />
                </a>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            <div class="icon-holder">
                <a href="http://www.sony.com/" target="_blank">
                    <img src="{{ BASE_PATH }}/images/community/sony-150.jpg" style="max-width:125px" />
                </a>
            </div>
        </div>
        <div class="col-md-3">
            <div class="icon-holder">
                <a href="http://hbsp.harvard.edu/" target="_blank">
                    <img src="{{ BASE_PATH }}/images/community/harvard-business-publishing-150.jpg" style="max-width:125px" />
                </a>
            </div>
        </div>
        <div class="col-md-3">
            <div class="icon-holder">
                <a href="http://www.biogenidec.com/" target="_blank">
                    <img src="{{ BASE_PATH }}/images/community/biogen-idec-150.png" style="max-width:125px" />
                </a>
            </div>
        </div>
        <div class="col-md-3">
            <div class="icon-holder">
                <a href="http://www.exari.com/" target="_blank">
                    <img src="{{ BASE_PATH }}/images/community/exari-150.png" style="max-width:125px" />
                </a>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            <div class="icon-holder">
                <a href="http://www.virginmobileusa.com/" target="_blank">
                    <img src="{{ BASE_PATH }}/images/community/virgin-mobile-150.jpg" style="max-width:125px" />
                </a>
            </div>
        </div>
        <div class="col-md-3">
            <div class="icon-holder">
                <a href="http://www.sprint.com/" target="_blank">
                    <img src="{{ BASE_PATH }}/images/community/sprint-150.png" style="max-width:125px" />
                </a>
            </div>
        </div>
        <div class="col-md-3">
            <div class="icon-holder">
                <a href="http://www.evolvedmediasolutions.co.uk/" target="_blank">
                    <img src="{{ BASE_PATH }}/images/community/evolved-media-solutions-150.png" style="max-width:125px" />
                </a>
            </div>
        </div>
        <div class="col-md-3">
            <div class="icon-holder">
                <a href="http://www.fxnetworks.com/" target="_blank">
                    <img src="{{ BASE_PATH }}/images/community/fx-networks-150.png" style="max-width:125px" />
                </a>
            </div>
        </div>
    </div>
</div>

If you'd like to have your company logo listed above, please <a href="contact.html">drop us a line</a>.

## What Browsers are Supported?

Alpaca is a JavaScript library that uses jQuery and runs in most modern web browsers.  With every release of Alpaca,
we run a library of unit tests across a matrix of operating systems, browsers and versions.  As the project grows,
we are expanding this matrix to include more combinations and testing.

This table shows our tested stack.  If not shown, it means that Alpaca hasn't been tested on that platform and
browser combination.  That said, please feel free to evaluate on your own.  There is a good chance
Alpaca will run just fine.

<br/>

<div align="center" class="stack">
    <table class="stack">
        <thead>
            <th>Browser</th>
            <th>Windows</th>
            <th>Mac OSX</th>
            <th>iOS</th>
            <th>Android</th>
        </thead>
        <tbody>
            <tr>
                <td>Chrome</td>
                <td>
                    <img src="{{ BASE_PATH }}/images/supported-yes.png">
                </td>
                <td>
                    <img src="{{ BASE_PATH }}/images/supported-yes.png">
                </td>
                <td>
                    <!-- not applicable -->
                    -
                </td>
                <td>
                    <img src="{{ BASE_PATH }}/images/supported-yes.png">
                    <!-- not applicable -->
                </td>
            </tr>
            <tr>
                <td>Firefox</td>
                <td>
                    <img src="{{ BASE_PATH }}/images/supported-yes.png">
                </td>
                <td>
                    <img src="{{ BASE_PATH }}/images/supported-yes.png">
                </td>
                <td>
                    <!-- not applicable -->
                    -
                </td>
                <td>
                    <!-- not applicable -->
                    -
                </td>
            </tr>
            <tr>
                <td>Safari</td>
                <td>
                    <img src="{{ BASE_PATH }}/images/supported-yes.png">
                </td>
                <td>
                    <img src="{{ BASE_PATH }}/images/supported-yes.png">
                </td>
                <td>
                    <img src="{{ BASE_PATH }}/images/supported-yes.png">
                </td>
                <td>
                    <!-- not applicable -->
                    -
                </td>
            </tr>
            <tr>
                <td>Opera</td>
                <td>
                    <img src="{{ BASE_PATH }}/images/supported-yes.png">
                </td>
                <td>
                    <img src="{{ BASE_PATH }}/images/supported-yes.png">
                </td>
                <td>
                    <!-- not tested -->
                    -
                </td>
                <td>
                    <!-- not applicable -->
                    -
                </td>
            </tr>
            <tr>
                <td>IE</td>
                <td>
                    <img src="{{ BASE_PATH }}/images/supported-yes.png">
                    <br/>
                    (IE 9 and beyond)
                </td>
                <td>
                    <!-- not applicable -->
                    -
                </td>
                <td>
                    <!-- not applicable -->
                    -
                </td>
                <td>
                    <!-- not applicable -->
                    -
                </td>
            </tr>
        </tbody>
    </table>
</div>


## How do I get started?

You can drop Alpaca into your new or existing web or mobile projects.  Alpaca is a simple JavaScript library that
you can plug in wherever you'd like.  You can <a href="download.html">install or download Alpaca</a> using conventional
tools like Bower or NPM.  Or you can <a href="download.html">grab a release</a> from our
 <a href="download.html">download page</a>.


## Why is Alpaca open source?

When we were building Cloud CMS, we ended up producing a really great forms engine to serve as part of our front end
We're big on open source, having worked on such projects as Alfresco and the Spring Framework in the past.  We thought
it only made sense to put Alpaca into the wild to see what it could do.

We're thrilled with the results.  Alpaca has enjoyed several years of iteration and today stands as a really nicely
packaged library for developers, system integrators and many others to use within their projects.

We'd love for you to <a href="download.html">try out Alpaca</a> and to <a href="source.html">contribute to the
project</a>.  If you're able to fix a bug, add a new feature or implement something cool, it'll probably go a long
way to helping someone else out there.  And that's what community is all about.


## Do you offer Support for Alpaca?

We offer formal, production and development support for Alpaca via a support contract.  A support contract gives your
developers a channel for expressing priority features and requirements.  It also provides our team with a way to
guarantee a service-level commitment for your production apps.

To learn more about production support, please <a href="contact.html">contact Cloud CMS</a>
 with information about your project.  A member of team will be in touch with you right away.

<script>
$("TABLE.stack").dataTable({
    "bAutoWidth": false,
    "bInfo": false,
    "bLengthChange": false,
    "bFilter": false,
    "bPaginate": false
});
</script>

<script>
$("#form1").alpaca({
    "schema": {
        "title": "What do you think of Alpaca?",
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "title": "Name"
            },
            "ranking": {
                "type": "string",
                "title": "Ranking",
                "enum": ['excellent', 'not too shabby', 'alpaca built my hotrod']
            }
        }
    },
    "options": {
        "focus": false
    }
});
</script>
