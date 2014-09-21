$(document).ready(function() {

    $("#field1").alpaca({
        "view": "bootstrap-create",
        "schema": {
            "type": "object",
            "properties": {
                "caption": {
                    "type": "string",
                    "required": true
                },
                "files": {
                    "type": "string"
                }
            }
        },
        "options": {
            "fields": {
                "caption": {
                    "label": "Caption"
                },
                "files": {
                    "type": "upload",
                    "label": "Files",
                    "upload": {
                        "formData": {
                            "path": "/folder1/folder2/{filename}"
                        },
                        "url": "upload/index.php",
                        "autoUpload": true,
                        "maxFileSize": 25000000,
                        "maxNumberOfFiles": 1,
                        "showSubmitButton": false
                    },
                    "multiple": true
                }
            },
            "focus": true,
            "form": {
                "attributes": {
                    "method": "POST",
                    "action": "form/index.php",
                    "enctype": "multipart/form-data"
                },
                "buttons": {
                    "submit": {
                        "value": "Submit"
                    }
                }
            }
        },
        "postRender": function(renderedField) {

            // TODO

        }
    });

});
