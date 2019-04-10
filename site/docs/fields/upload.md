---
layout: documentation-field
title: Upload Field
header: Upload Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```upload``` field provides a mechanism that enables end users to upload one or more files to a server endpoint and
have references to those files stored in the JSON of your form.  For example, you may have an array of files in your
JSON consisting of filenames to assets that are uploaded to your server - something like:

```
{
    "title": "My Files",
    "files": [{
        "filename": "/folder1/folder2/file3.jpg"
    }, {
        "filename": "/folder1/folder2/file4.pdf"
    }]
}
````

This field renders an upload control so that end users can pick at local files and upload them.  It provides the hook
points so that you can learn about the uploaded files and wire back descriptors that get plugged into your array.
Descriptors can be any format you like.  That way, when people edit an existing JSON, the descriptors can be resolved
to physical assets on your server.

In addition, the upload control supports thumbnail previews and progress bar controls.  It uses the much-esteemed
<a href="http://blueimp.github.io/jQuery-File-Upload/">jQuery File Upload</a> plugin under the hood.

The control accepts an <code>upload</code> configuration object which gets passed to the file upload plugin.
The following are typically specified:

```
{
    // url of the endpoint
    "url": "/",

    // (optional) type of data being posted
    "dataType": "json",

    // (optional) "get" or "post" typically
    "method": "post",

    // whether to automatically upload when a file is selected
    "autoUpload": true,

    // whether to show a separate submit button (needed if not auto-upload)
    "showSubmitButton": false
}
````

And more properties can be specified as needed by the underlying plugin.

The control also supports drag and drop of files from the desktop into the web page provided that you're using
an HTML5 File API compatible browser.  Which, as you might expect, doesn't include IE8 or IE9.

<!-- INCLUDE_API_DOCS: upload -->


## Example 1
Single related file upload.
An example of a single file upload control.  Uploads are posted to <code>/fileupload/index.php</code>.
We've wired this up using a postRender callback so you can see the generated JSON by clicking 'view'.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "view": "bootstrap-create",
    "schema": {
        "type": "array",
    },
    "options": {
        "type": "upload",
        "label": "Upload File",
        "upload": {
            "url": "http://www.alpacajs.org/fileupload/index.php",
            "autoUpload": true
        },
        "name": "files"
    },
    "postRender": function(control) {
        var button = $("<button class='btn btn-default'>View</button>");
        control.getFieldEl().append("<br/>").append(button);
        $(button).click(function() {
            alert(JSON.stringify(control.getValue(), null, 3));
        });
    }
});
</script>
{% endraw %}




## Example 2
Content creation form with support for multiple uploads as attachments.  Note that the file uploads post right away
to <code>/fileupload/index.php</code>.

The form is not submitted until the user clicks submit at which time the form posts to form.php.

In addition, we specify the <code>maxFileSize</code>, <code>maxNumberOfFiles</code>, <code>multiple</code> and
<code>fileTypes</code> settings to adjust the behavior of the control.

<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "view": "bootstrap-create",
    "schema": {
        "type": "object",
        "properties": {
            "title": {
                "type": "string",
                "title": "Title",
                "required": true
            },
            "files": {
                "type": "array",
                "title": "Files",
                "required": true
            }
        }
    },
    "options": {
        "fields": {
            "files": {
                "type": "upload",
                "multiple": true,
                "maxFileSize": 25000000,
                "maxNumberOfFiles": 3,
                "fileTypes": "(\.|\/)(gif|jpe?g|png)$",
                "upload": {
                    "url": "http://www.alpacajs.org/fileupload/index.php"
                },
                "name": "files"
            }
        },
        "focus": true,
        "form": {
            "attributes": {
                "method": "POST",
                "action": "http://www.alpacajs.org/php/echo.php",
                "enctype": "multipart/form-data"
            },
            "buttons": {
                "submit": {
                    "value": "Submit"
                }
            }
        }
    }
});
</script>
{% endraw %}




## Example 3
The <code>formData</code> property lets us pass multipart data along with each upload.  This is useful if the upload.php script
knows how to handle multipart.  It can use this form data to make decisions about where to place content.  The upload
control supports tokenization with some limited information:

<table class="table table-bordered table-striped">
    <thead>
        <tr>
            <th>token</th>
            <th>value</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>index</td>
            <td>The # of the file being uploaded (starting at 0)</td>
        </tr>
        <tr>
            <td>name</td>
            <td>Filename of the file (from browser)</td>
        </tr>
        <tr>
            <td>size</td>
            <td>Size of the file in bytes</td>
        </tr>
        <tr>
            <td>url</td>
            <td>Upload URL for the file</td>
        </tr>
        <tr>
            <td>thumbnailUrl</td>
            <td>Thumbail URL for the file</td>
        </tr>
    </tbody>
</table>

<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "view": "bootstrap-create",
    "schema": {
        "type": "object",
        "properties": {
            "title": {
                "type": "string",
                "title": "Title",
                "required": true
            },
            "files": {
                "type": "array",
                "title": "Files",
                "required": true
            }
        }
    },
    "options": {
        "fields": {
            "files": {
                "type": "upload",
                "upload": {
                    "formData": {
                        "path": "/folder1/folder2/{filename}"
                    },
                    "url": "http://www.alpacajs.org/fileupload/index.php"
                },
                "name": "files"
            }
        },
        "focus": true,
        "form": {
            "attributes": {
                "method": "POST",
                "action": "http://www.httpbin.org/post",
                "enctype": "multipart/form-data"
            },
            "buttons": {
                "submit": {
                    "value": "Submit"
                }
            }
        }        
    }
});
</script>
{% endraw %}



## Example 4
The <code>errorHandler</code> property lets us specify a custom error handler to be fired when an upload is attempted
and is ruled to be invalid (such as an invalid file or an invalid size).

Here is an example where we restrict the file types to *.blahblah and a file size of 1.  Attempting to upload just about
anything will cause these to trip so that you can test it out.  The custom errorHandler brings up a Bootstrap modal
instead of a regular ol' JavaScript alert.

<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "view": "bootstrap-create",
    "schema": {
        "type": "object",
        "properties": {
            "files": {
                "type": "array",
                "title": "Files",
                "required": true
            }
        }
    },
    "options": {
        "fields": {
            "files": {
                "type": "upload",
                "maxFileSize": 1,
                "fileTypes": "(\.|\/)(blahblah)$",
                "maxNumberOfFiles": 3,
                "upload": {
                    "url": "http://www.alpacajs.org/fileupload/index.php"
                },
                "errorHandler": function(messages) {
                    $("#errorModal").find(".modal-body").empty().append("<p>" + messages.join("<br/>") + "</p>");
                    $("#errorModal").modal("show");
                },
                "name": "files"
            }
        },
        "focus": true,
        "form": {
            "attributes": {
                "method": "POST",
                "action": "http://www.httpbin.org/post",
                "enctype": "multipart/form-data"
            },
            "buttons": {
                "submit": {
                    "value": "Submit"
                }
            }
        }        
    }
});
</script>
{% endraw %}
<div id="errorModal" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title">An error has occurred!</h4>
            </div>
            <div class="modal-body">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

## Example 5
Here is the upload control rendered in display only mode.

<div id="field5"> </div>
{% raw %}
<script type="text/javascript" id="field5-script">
$("#field5").alpaca({
    "view": "bootstrap-display",
    "data": {
        "files": [{
            "id": "ad"
        }]
    },
    "schema": {
        "type": "object",
        "properties": {
            "files": {
                "type": "array",
                "title": "Files",
                "required": true
            }
        }
    },
    "options": {
        "fields": {
            "files": {
                "type": "upload",
                "maxFileSize": 1,
                "fileTypes": "(\.|\/)(blahblah)$",
                "maxNumberOfFiles": 3,
                "upload": {
                    "url": "http://www.alpacajs.org/fileupload/index.php"
                },
                "name": "files"
            }
        },
        "focus": true,
        "form": {
            "attributes": {
                "method": "POST",
                "action": "http://www.httpbin.org/post",
                "enctype": "multipart/form-data"
            },
            "buttons": {
                "submit": {
                    "value": "Submit"
                }
            }
        }
    }
});
</script>
{% endraw %}


## Example 6
The <code>progressall</code> property lets us specify a custom progress bar to indicate the progress of a file being uploaded.

<div id="field6"> </div>
{% raw %}
<script type="text/javascript" id="field6-script">
$("#field6").alpaca({
    "view": "bootstrap-create",
    "schema": {
        "type": "object",
        "properties": {
            "files": {
                "type": "string"
            }
        }
    },
    "options": {
        "fields": {
            "files": {
                "label": "Upload File...",
                "type": "upload",
                "multiple": false,
                "upload": {
                    "url": "http://www.alpacajs.org/fileupload/index.php"
                },
                "progressall": function (e, data) {

                    $("#field6").find(".progress").css("display", "block");
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $('#progress .progress-bar').css(
                        'width',
                        progress + '%'
                    );

                    if (data.loaded == data.total)
                    {
                        $("#field6").find(".progress").css("display", "none");
                    }
                }
            }
        },
        "form": {
            "attributes": {
                "method": "POST",
                "action": "http://www.httpbin.org/post",
                "enctype": "multipart/form-data"
            },
            "buttons": {
                "submit": {
                    "value": "Submit"
                }
            }
        }        
    }
});
</script>
{% endraw %}

