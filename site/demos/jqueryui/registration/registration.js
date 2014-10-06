$(document).ready(function() {

    /**
     * Initial data
     *
     * Fill in the JSON data that should be populated into the form.  This can be any JSON data that you'd like
     * provided that it fits the schema and options (if you provide those).
     *
     */
    var data = {};

    /**
     * JSON-schema for the form
     *
     * The form schema defines the data types, validation logic and other constraints that need to be satisfied in
     * order for the form to be considered valid.
     *
     * This should follow the JSON-schema convention.
     * @see http://json-schema.org
     *
     * Full schema settings are listed here:
     * @see http://www.alpacajs.org
     *
     */
    var schema = {
        "properties": {
            "name": {
                "type": "string"
            },
            "email": {
                "type": "string"
            },
            "organization": {
                "type": "string"
            },
            "workPhone": {
                "type": "string"
            },
            "cellPhone": {
                "type": "string"
            },
            "address1": {
                "type": "string"
            },
            "address2": {
                "type": "string"
            },
            "city": {
                "type": "string"
            },
            "state": {
                "type": "string"
            },
            "zipcode": {
                "type": "string"
            },
            "country": {
                "type": "string"
            },
            "emergencyContact": {
                "type": "string"
            },
            "vegetarian": {
                "type": "boolean",
                "required": true,
                "enum": [true, false],
                "default": false
            },
            "dietaryComments": {
                "type": "string"
            },
            "roomJune3": {
                "type": "boolean",
                "required": true,
                "enum": [true, false],
                "default": false
            },
            "roomJune4": {
                "type": "boolean",
                "required": true,
                "enum": [true, false],
                "default": false
            },
            "roomJune5": {
                "type": "boolean",
                "required": true,
                "enum": [true, false],
                "default": false
            },
            "smoking": {
                "type": "boolean",
                "required": true,
                "enum": [true, false],
                "default": false,
                "readonly": true
            },
            "dinnerJune3": {
                "type": "boolean",
                "required": true,
                "enum": [true, false],
                "default": false
            },
            "dinnerJune4": {
                "type": "boolean",
                "required": true,
                "enum": [true, false],
                "default": false
            },
            "cambridgeTour": {
                "type": "boolean",
                "required": true,
                "enum": [true, false],
                "default": false
            },
            "travel": {
                "type": "number",
                "enum": [1,2,3],
                "default": 1,
                "required": true
            },
            "labWebsite": {
                "type": "string",
                "format": "uri"
            },
            "photoFile": {
                "type": "string",
                "format": "uri"
            },
            "researchDescription": {
                "type": "string"
            }
        }
    };

    /**
     * Layout options for the form
     *
     * These options describe UI configuration for the controls that are rendered for the data and schema.  You can
     * tweak the layout and presentation aspects of the form in this section.
     *
     * Full options settings are listed here:
     * @see http://www.alpacajs.org
     *
     */
    var options = {
        "fields": {
            "name": {
                "type": "text",
                "label": "Name:"
            },
            "email": {
                "type": "email",
                "label": "Email Address:"
            },
            "organization": {
                "type": "text",
                "label": "Organization:"
            },
            "workPhone": {
                "type": "phone",
                "label": "Work phone:"
            },
            "cellPhone": {
                "type": "phone",
                "label": "Cell phone:"
            },
            "address1": {
                "type": "text",
                "label": "Address:"
            },
            "address2": {
                "type": "text",
                "label": "Address:"
            },
            "city": {
                "type": "text",
                "label": "City:"
            },
            "state": {
                "type": "state",
                "label": "State:"
            },
            "zipcode": {
                "type": "zipcode",
                "label": "Zip/Postal code:"
            },
            "country": {
                "type": "country",
                "label": "Country (if other than U.S.):"
            },
            "emergencyContact": {
                "type": "text",
                "label": "Emergency contact (name and number):"
            },
            "vegetarian": {
                "type": "radio",
                "label": "Are you a vegetarian:",
                "optionLabels": ["Yes", "No"]
            },
            "dietaryComments": {
                "type": "text",
                "label": "Please specify any other dietary requirements:"
            },
            "roomJune3": {
                "type": "radio",
                "label": "Will you need a room on Monday, June 3rd?",
                "optionLabels": ["Yes", "No"]
            },
            "roomJune4": {
                "type": "radio",
                "label": "Will you need a room on Tuesday, June 4th?",
                "optionLabels": ["Yes", "No"]
            },
            "roomJune5": {
                "type": "radio",
                "label": "Will you need a room on Wednesday, June 5th?",
                "optionLabels": ["Yes", "No"]
            },
            "smoking": {
                "type": "radio",
                "label": "Note that all rooms are non-smoking:",
                "optionLabels": ["Yes", "No"]
            },
            "dinnerJune3": {
                "type": "radio",
                "label": "Will you be attending the reception and dinner on Monday, June 3rd?",
                "optionLabels": ["Yes", "No"]
            },
            "dinnerJune4": {
                "type": "radio",
                "label": "Will you be attending the reception and dinner on Tuesday, June 4th?",
                "optionLabels": ["Yes", "No"]
            },
            "cambridgeTour": {
                "type": "radio",
                "label": "Cambridge tour (date and time to be determined)?",
                "optionLabels": ["Yes", "No"]
            },
            "travel": {
                "type": "radio",
                "label": "",
                "optionLabels": [
                    "I will use your travel agent.",
                    "I will make my own travel arrangements.",
                    "I am local and do not require travel arrangements."
                ]
            },
            "labWebsite": {
                "type": "text",
                "label": "",
                "size": 80
            },
            "photoFile": {
                "type": "file",
                "label": ""
            },
            "researchDescription": {
                "type": "textarea",
                "rows": 5,
                "cols": 60,
                "label": "",
                "wordlimit": 250
            }
        },
        "form": {
            "attributes": {
                "method": "POST",
                "action": "save.php",
                "enctype": "multipart/form-data"
            },
            "buttons": {
                "submit": {
                    "value": "Submit the Form"
                }
            }
        }
    };

    /**
     * This is an optional post render callback that Alpaca will call once the form finishes rendering.  The form
     * rendering itself is asynchronous as it may load templates or other resources for use in generating the UI.
     *
     * Once the render is completed, this callback is fired and the top-level Alpaca control is handed back.
     *
     * @param field
     */
    var postRenderCallback = function(field) {

        // when an update is made to any fields in this control, we listen for the update and refresh
        // the DIV with id interests-summary
        $(field.getContainerEl()).bind("fieldupdate", function() {

            // the json for the entire representation of the form
            var value = field.getValue();

            // summary
            var summary = "";
            if (value.name && value.email && value.organization)
            {
                // assemble a summary string
                summary = value.name + " (" + value.email + ") from " + value.organization;
            }

            // set summary
            $("#interests-summary").val(summary);

        });

    };

    /**
     * If you'd like to define a custom layout (html) file for your form, you first define a new view.
     */
    Alpaca.registerView({
        "id": "registration",
        "parent": "jqueryui-create",
        "title": "Registration Create View for the Web",
        "layout" : {
            "template": './registration-layout.html',
            "bindings": {
                "name": "contact-info-fields",
                "email": "contact-info-fields",
                "organization": "contact-info-fields",
                "workPhone": "contact-info-fields",
                "cellPhone": "contact-info-fields",
                "address1": "contact-info-fields",
                "address2": "contact-info-fields",
                "city": "contact-info-fields",
                "state": "contact-info-fields",
                "zipcode": "contact-info-fields",
                "country": "contact-info-fields",
                "emergencyContact": "contact-info-fields",
                "vegetarian": "contact-info-fields",
                "dietaryComments": "contact-info-fields",
                "roomJune3": "contact-info-fields",
                "roomJune4": "contact-info-fields",
                "roomJune5": "contact-info-fields",
                "smoking": "contact-info-fields",
                "dinnerJune3": "contact-info-fields",
                "dinnerJune4": "contact-info-fields",
                "cambridgeTour": "contact-info-fields",
                "travel": "travel-arrangements-fields",
                "labWebsite": "interests-1",
                "photoFile": "interests-2",
                "researchDescription": "interests-3"
            }
        },
        "messages": {
            "invalidEmail": "Please enter a valid email address.",
            "invalidPhone": "Please enter a valid phone number.",
            "wordLimitExceeded": "The maximum word limit of {0} has been exceeded."
        }
    });

    /**
     * Render the form.
     *
     * We call alpaca() with the data, schema and options to tell Alpaca to render into the selected dom element(s).
     *
     */
    $("#form").alpaca({
        "data": data,
        "schema": schema,
        "options": options,
        "postRender": postRenderCallback,
        "view": "registration"
    });
});