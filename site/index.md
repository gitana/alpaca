---
layout: page
title: Welcome to Alpaca!
#tagline: Easy Forms for jQuery
---
{% include JB/setup %}


Alpaca provides the easiest and fastest way to generate interactive forms for the web and mobile devices.
It runs simply as HTML5 or more elaborately using Bootstrap, jQuery Mobile or jQuery UI.  Alpaca uses Handlebars
to process JSON schema and provide developers with an extensible framework for implementing controls, wizards,
layouts, I18N support and an custom data persistence.

<br/>

<!--
<div align="center" class="front-ui-images">
    <span class="bootstrap">
        <a href="http://twitter.github.com/bootstrap" target="_blank">
            <img src="{{ BASE_PATH }}/images/bootstrap.png" alt="Twitter Bootstrap" title="Twitter Bootstrap" style="width: 200px">
        </a>
    </span>
    <span class="jquerymobile">
        <a href="http://jquerymobile.com" target="_blank">
            <img src="{{ BASE_PATH }}/images/jquery-mobile.png" alt="JQuery Mobile" title="JQuery Mobile" style="width: 200px">
        </a>
    </span>
    <span class="jqueryui">
        <a href="http://jqueryui.com" target="_blank">
            <img src="{{ BASE_PATH }}/images/jquery-ui.jpg" alt="JQuery UI" title="JQuery UI" style="width: 200px">
        </a>
    </span>
</div>

<br/>
-->


<div class="video-container" align="center">
     <iframe src="http://www.youtube.com/embed/mK4BXiGNbvA" frameborder="0" width="560" height="315"> </iframe>
</div>

## How do I use Alpaca?

<br/>

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

Alpaca is an open source project that is in use by lots of customers including the following:

<br/>

<div class="row">
    <div class="col-md-3">
        <img src="{{ BASE_PATH }}/images/customers/pearson.png" style="max-width:150px" />
    </div>
    <div class="col-md-3">
        <img src="{{ BASE_PATH }}/images/customers/fox-entertainment.png" style="max-width:150px" />
    </div>
    <div class="col-md-3">
        <img src="{{ BASE_PATH }}/images/customers/cloudcms.png" style="max-width:150px" />
    </div>
    <div class="col-md-3">
        <img src="{{ BASE_PATH }}/images/customers/evolved-media.png" style="max-width:150px" />
    </div>
</div>

<br/>

If you'd like to list your company, just <a href="contact.html">contact us</a>.

## Browser Support

Alpaca is a JavaScript library that uses jQuery and runs in most modern web browsers.  With every release of Alpaca,
we run a library of unit tests across a matrix of operating systems, browsers and versions.  As the project grows,
we are expanding this matrix to include more combinations and testing.

This table shows our tested stack.  If not shown, it means that Alpaca hasn't been tested on that platform and
browser combination.  That said, please feel free to evaluate on your own.  There is a good chance
Alpaca will run just fine.

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


## Getting Started

It's easy to get started.  You can grab the code and drop it into your new or existing projects.  You can also download
the source code, build it yourself and customize Alpaca for your own projects.  Check out our
<a href="documentation.html">documentation</a>, <a href="download.html">downloads</a> and
<a href="release-notes.html">release notes</a>.


## Open Source Project

Alpaca is a community-led <a href="https://github.com/gitana/alpaca" target="_blank">open-source project</a>
licensed under Apache 2.0.

Join the <a href="http://www.github.com/gitana/alpaca" target="_blank">Alpaca Project</a> on GitHub to
grab a copy of the source code and contribute to the growing Alpaca Community.

If you have a question about Alpaca, please visit the <a href="http://www.cloudcms.org">Alpaca Forums</a>.
We'd love to get to know you and to hear your feedback!


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
        "title": "User Feedback",
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "title": "What is your name?"
            },
            "ranking": {
                "type": "string",
                "title": "What do you think of Alpaca?",
                "enum": ['Most excellent.','Not too shabby, my good man.','Alpaca built my hotrod!']
            }
        }
    }
});
</script>
<script>
    //window.prettyPrint && prettyPrint();
</script>
