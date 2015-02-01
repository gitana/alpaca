---
layout: page
title: Getting Started with Alpaca
#tagline: Easy Forms for jQuery
sitemap:
  priority: 1.0
---
{% include JB/setup %}

This page provides a detailed, walk-through tutorial that describes how you might go about building your first
Alpaca form.  It isn't all that complicated but this guide goes step-by-step.  Because, well... some people
are all about step-by-step instructions with lots of details.

If you're more interested in seeing a quick demo, check out our <a href="examples.html">examples</a> page.

{% capture page1 %}{% include tutorial/page1.md %}{% endcapture %}
{% capture page2 %}{% include tutorial/page2.md %}{% endcapture %}
{% capture page3 %}{% include tutorial/page3.md %}{% endcapture %}
{% capture page4 %}{% include tutorial/page4.md %}{% endcapture %}
{% capture page5 %}{% include tutorial/page5.md %}{% endcapture %}

<!-- STEP 1 -->
<div class="step">

    <img src="{{ BASE_PATH }}/images/step-1.png"/>

    <p>
        Launch your favorite text editor and create an empty HTML file.  We're going to build a web page so you're
        going to want to make sure the HTML file has a <code>head</code> section and a <code>body</code> section.
        In the <code>head</code> section, make sure that you include jQuery and also Alpaca.
    </p>
    <p>
        In the body, we'll add a single <code>DIV</code> element.  We'll use this to hold our form.
    </p>
    <p>
        It might end up looking something like this:
    </p>
    <div class="codewrap">
        <pre class="prettyprint linenums tutorial">{{ page1 | xml_escape }}</pre>
    </div>
</div>

<!-- END OF STEP 1 -->


<!-- STEP 2 -->
<div class="step">
    <img src="{{ BASE_PATH }}/images/step-2.png"/>
    <p>So far so good.  Of course, the page doesn't do much yet.  Let's add in a form!</p>
    <p>Add a <code>div</code> to the body section of your HTML file.  This <code>DIV</code> is a placeholder element
    that we're going to use to hold our Alpaca form.  We use jQuery to get a hold of the <code>DIV</code>
    and then we call the <code>$.alpaca</code> function on it to make things happen.</p>
    <p>When we call this function, we can pass in the JSON schema of the form as well as optional configuration options
    that tell Alpaca what kinds of controls to render as well as how to lay them out.</p>
    <p>Let's start by specifying only the <code>schema</code> parameter.  This is a JSON schema document that describes
    the data structure of a "User Feedback" object with three properties, name, feedback and ranking.</p>
    <p>
    As illustrated in the following example, Alpaca is able to render a basic feedback form based on the provided schema.
    It maps object property to form field based on it data type and format. For example, a string type object property
    will be mapped to a text field. However if we specify a list of allowed values for the property with an enum attribute,
    Alpaca will instead render a radio button group (or a drop-down select if the number of enum options is more than three)
    with all values listed in the enum attribute. Since it is not a required field, Alpaca will automatically append
    a None option to the radio button group which maps to empty value.
    </p>
    <p>
    The feedback form we have at this point is very basic because the schema parameter only describes the data
    structure and format. As for the options of the rendered form fields, Alpaca makes a lot of assumptions,
    e.g. the size of text field is set as 40 as default.
    </p>

    <div class="codewrap">
        <pre class="prettyprint linenums tutorial">{{ page2 | xml_escape }}</pre>
    </div>

    <p>
    If you load this page in a browser, you'll then see the following:
    </p>
    <div class="tutorial-panel">
        <div class="panel panel-default">
          <div class="panel-body">
            <div id="form2" class="tutorial-example"></div>
          </div>
        </div>
    </div>
</div>

<!-- END OF STEP 2 -->


<!-- STEP 3 -->
<div class="step">
    <img src="{{ BASE_PATH }}/images/step-3.png"/>
    <p>
        To render a better feedback form, let us add an options parameter in addition to the schema parameter. The
        options parameter is another JSON document that specifies type and options for the rendered form fields. It now
        sets the size of name field as 20, maps the feedback object property to a textarea field and uses drop-down
        select for the ranking object property with custom option labels.
    </p>
    <p>
        The options parameter can also be used to provide additional field labels and help messages or overwrite the
        ones that came from the schema parameter. In general, we can couple the same schema parameter with
        different options parameters to render the form in various formats.
    </p>

    <div class="codewrap">
        <pre class="prettyprint linenums tutorial">{{ page3 | xml_escape }}</pre>
    </div>

    <p>
        If you reload your browser, you'll now see something like this:
    </p>
    <div class="tutorial-panel">
        <div class="panel panel-default">
          <div class="panel-body">
            <div id="form3" class="tutorial-example"></div>
          </div>
        </div>
    </div>
</div>

<!-- STEP 4 -->
<div class="step">
    <img src="{{ BASE_PATH }}/images/step-4.png"/>
    <p>
        The ultimate reason for using Alpaca forms service is to provide end users with a friendly interface for
        collecting their inputs. Those collected information normally needs to be submitted to and stored in a backend
        system such as database, CMS etc.
    </p>
    <p>
        With the schema parameter and the optional options parameter, Alpaca has rendered a decent feedback form with
        normal HTML form tags. To make it interact with backend services, we have a few options:
    </p>
    <ol class="bullets">
        <li>
            Render the form inside a FORM tag instead of the div tag. The FORM tag can come with all required attributes
            such as action, method etc. A submit button can also be added to the FORM tag. Clicking on the
            submit button will result in form submission just like any other HTML form.
        </li>
        <li>
            Or we can ask Alpaca to render the FORM tag for us by providing form related options in the options
            parameter. As shown in the following example, Alpaca now renders the FORM tag with the specified method and
            endpoint as well as a SUBMIT button. Try to click the SUBMIT button and see what happens!
        </li>
    </ol>
    <p>
        Alpaca sets the name attribute of a rendered field based on its schema property name in case we didn't
        specify it through the options parameter. For the following example, we will have "name" for the name field and
        "your_feedback" for the feedback field.
    </p>
    <p>
        We have also provide Alpaca with a new data parameter which is a JSON document used by Alpaca as the initial
        data for populating the form. We have also make both name and ranking field as required field. Now if you leave
        the name field empty, Alpaca will automatically invalidate the field and display an error message.
    </p>
    <p>
        You may also notice this rendered form has different styles than the previous example. That is because we set
        Alpaca with a view parameter which makes Alpaca to pick a different set of templates for form rendition.
    </p>

    <div class="codewrap">
        <pre class="prettyprint linenums tutorial">{{ page4 | xml_escape }}</pre>
    </div>

    <p>
        If you reload your browser, you'll now see something like this:
    </p>
    <div class="tutorial-panel">
        <div class="panel panel-default">
          <div class="panel-body">
            <div id="form4" class="tutorial-example"></div>
          </div>
        </div>
    </div>
</div>


<!-- STEP 5 -->
<div class="step">
    <img src="{{ BASE_PATH }}/images/step-5.png"/>
    <p>
        Alpaca is capable of not only rendering a form based on JSON schema but also reassembling form inputs into a
        JSON document according to the data structure described by the same JSON schema.
    </p>
    <p>
        This brings us a better option for interacting Alpaca with backend services. As shown in the following example,
        we can specify a click handler for any of our form buttons.  The handler has a <code>this</code> set to the
        form instance which we can use to call <code>getValue</code> as well manually run validation, check validation
        state and execute any other form methods we'd like.  The form instance exposes a method called
        <code>submit</code> to post the form as well as a method called <code>ajaxSubmit</code> that will submit
        behind the scenes and hand back a jQuery promise object.
    </p>
    <p>
        We also can use a <code>postRender</code> callback to get a hold of the rendered form object once it has been
        drawn to the screen.  We can use this to hook in additional event listeners, change CSS or bind other parts
        of the DOM to our form for interactivity.
    </p>
    <p>
        For developers, this will be the place to do any required post-processing since Alpaca will feed the callback
        function with the top-most form control that it constructs. We can easily gain access to any other Alpaca form
        control by using API such as
        <code>renderedForm.children</code>, <code>renderedForm.childrenByPropertyId</code>,
        <code>renderedForm.getControlByPath</code>, etc. From any Alpaca form control, we can get the DOM element
        of its outer DOM element calling <i>field.getFieldEl()</i>.
    </p>

    <div class="codewrap">
        <pre class="prettyprint linenums tutorial">{{ page5 | xml_escape }}</pre>
    </div>

    <p>
        If you reload your browser, you'll now see something like this:
    </p>
    <div class="tutorial-panel">
        <div class="panel panel-default">
          <div class="panel-body">
            <div id="form5" class="tutorial-example"></div>
          </div>
        </div>
    </div>
</div>


<!-- STEP 6 -->
<div class="step">
    <img src="{{ BASE_PATH }}/images/step-6.png"/>
    <p>
        Alpaca is a client-side forms engine which means form rendition and data processing all happen on client
        side <i>e.g.</i> client browser. This provides a great foundation for high performance and scalability since
        JSON is the native data format that all browsers understand and it is the easiest format for data manipulation.
        Once the jQuery and Alpaca library are downloaded and cached on client side, there will be no other overhead.
    </p>
    <p>
        Plugging Alpaca into your existing application should be fairly straightforward. All you need to do is to
        provide an endpoint for serving Alpaca with data in JSON and another endpoint for taking re-assembled JSON
        document with user inputs from Alpaca for data persistence. Most modern day backend systems may already
        have those two endpoints.
    </p>
    <p>
        As illustrated by the above examples, using Alpaca is mainly through configuration rather than coding. Since
        schema and options parameters are also JSON documents, they can be stored in and served by your back
        systems as well. If you can plugin an adapter that converts XML document to JSON document, you can use Alpaca for
        your XML data as well.
    </p>
</div>

<script type="text/javascript" src="{{ BASE_PATH }}/tutorial/tutorial.js"> </script>
