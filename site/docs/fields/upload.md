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
    // type of data being posted
    "dataType": "json",

    // url of the endpoint
    "url": "/",

    // "get" or "post" typically
    "method": "post",

    // whether to show preview images
    "showUploadPreview": true,

    // whether to automatically upload when a file is selected
    "autoUpload": true,

    // max allowed file size in bytes
    "maxFileSize": 25000000,

    // maximum number of files that are permitted to be uploaded
    "maxNumberOfFiles": 1,

    // whether to show a separate submit button (needed if not auto-upload)
    "showSubmitButton": false
}
````

And more properties can be specified as needed by the underlying plugin.

The control also supports drag and drop of files from the desktop into the web page provided that you're using
an HTML5 File API compatible browser.  Which, as you might expect, doesn't include IE8 or IE9.


## Example 1
Single related file upload.
An example of a single file upload control.  Uploads are posted to /upload.php.
We've wired this up using a postRender callback so you can see the generated JSON by clicking 'view'.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "view": "bootstrap-create",
    "schema": {
        "type": "string",
    },
    "options": {
        "type": "upload",
        "label": "Upload File",
        "upload": {
            "url": "upload.php",
            "autoUpload": true,
        }
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
to /upload.php.  The form is not submitted until the user clicks submit at which time the form posts to form.php.

The '''formData''' property lets us pass multipart data along with each upload.  This is useful if the upload.php script
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

<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "view": "bootstrap-create",
    "schema": {
        "type": "object",
        "properties": {
            "title": {
                "type": "string"
            },
            "files": {
                "type": "string"
            }
        }
    },
    "options": {
        "fields": {
            "title": {
                "type": "text",
                "label": "Title"
            },
            "files": {
                "type": "upload",
                "label": "Files",
                "upload": {
                    "formData": {
                        "path": "/folder1/folder2/{filename}"
                    },
                    "url": "upload.php",
                    "autoUpload": true,
                    "maxFileSize": 25000000,
                    "maxNumberOfFiles": 1,
                    "showSubmitButton": false
                },
                "multiple": true
            }
        },
        "focus": true,
        "renderForm": true,
        "form": {
            "attributes": {
                "method": "POST",
                "action": "form.php",
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


