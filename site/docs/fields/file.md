---
layout: documentation-field
title: File Field
header: File Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```file``` field.

<!-- INCLUDE_API_DOCS: file -->


## Example 1
File field.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "",
    "options": {
        "type": "file",
        "label": "Ice Cream Photo:",
        "helper": "Pick your favorite ice cream picture."
    },
    "schema": {
        "type": "string",
        "format": "uri"
    }
});
</script>
{% endraw %}


## Example 2
File field rendered in display-only mode.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "/abc.html",
    "options": {
        "type": "file",
        "label": "Ice Cream Photo:",
        "helper": "Pick your favorite ice cream picture."
    },
    "schema": {
        "type": "string",
        "format": "uri"
    },
    "view": "bootstrap-display"
});
</script>
{% endraw %}


## Example 3
Nested file fields.
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "schema": {
        "title": "Update your Profile",
        "type": "object",
        "properties": {
            "name": {
                "type": "string"
            },
            "files": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "avatar": {
                            "type": "string",
                            "format": "uri"
                        },
                        "description": {
                            "type": "string"
                        }
                    }
                }
            }
        }
    },
    "options": {
        "fields": {
            "name": {
                "type": "text",
                "label": "What is your name?"
            },
            "files": {
                "fields": {
                    "item": {
                        "fields": {
                            "avatar": {
                                "type": "file",
                                "label": "Photo"
                            },
                            "description": {
                                "type": "textarea",
                                "label": "Please describe this photo"
                            }
                        }
                    },
                    "label": "Your Photos",
                    "helper": "Select the photos your would like to upload"
                }
            }
        }
    }
});
</script>
{% endraw %}


## Example 4
Select an image file to see it with instant thumbnail preview
<div id="imageInfo" style="display:none">
    <table>
        <tr>
            <td nowrap="nowrap" class="imagePreview" style="width: 220px"> </td>
            <td width="100%" class="imageProperties"> </td>
        </tr>
    </table>
</div>
<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "schema": {
        "type": "string",
        "format": "uri"
    },
    "options": {
        "type": "file",
        "label": "Upload an image file",
        "selectionHandler": function(files, data) {
            var img = $(".imagePreview").html("").append("<img style='max-width: 200px; max-height: 200px' src='" + data[0] + "'>");
            var p = $(".imageProperties").html("").append("<p></p>");
            $(p).append("Name: " + files[0].name + "<br/>");
            $(p).append("Size: " + files[0].size + "<br/>");
            $(p).append("Type: " + files[0].type + "<br/>");
            $("#imageInfo").css({
                "display": "block"
            });
        }
    }
});
</script>
{% endraw %}

## Example 5
Upload a file and track via a progress bar.  A lot of folks ask about how to upload an asset and track it via
a progress bar.  There are many ways to do this.  Here we show one way to do it by using a form and tracking when
the submit button is clicked.
Select an image file to see it with instant thumbnail preview
<div class="progress progress-striped active">
    <div id="example5_progressbar" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">
        <span class="sr-only">0% Complete</span>
    </div>
</div>
<div id="field5"> </div>
{% raw %}
<script type="text/javascript" id="field5-script">
$("#field5").alpaca({
    "schema": {
        "type": "string",
        "format": "uri"
    },
    "options": {
        "type": "file",
        "label": "Select a file",
        "form": {
            "attributes": {
                "method": "POST",
                "action": "http://www.httpbin.org/post"
            },
            "buttons": {
                "submit": {
                    "title": "Upload File",
                    "click": function() {
                        // set up the XHR object manually so we can track progress and update our progress bar
                        var config = {};
                        config.xhr = function() {
                            var xhr = new window.XMLHttpRequest();
                            xhr.addEventListener("progress", function(evt){
                                if (evt.lengthComputable) {
                                    var percentComplete = evt.loaded / evt.total;
                                    var percentCompleteString = "" + (percentComplete * 100);
                                    var progressBar = $("#example5_progressbar");
                                    $(progressBar).attr("aria-valuenow", percentCompleteString);
                                    $(progressBar).css("width", "" + percentCompleteString + "%");
                                    $(progressBar).find("span").html(percentCompleteString + "% Complete");
                                }
                            }, false);
                            return xhr;
                        };
                        // submit the form using ajax so that the browser doesn't leave the page
                        // we track the XHR and write to the progress bar using the event listener above
                        this.ajaxSubmit(config);
                    }
                }
            }
        }

    }
});
</script>
{% endraw %}