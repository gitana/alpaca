//Alpaca.logLevel = Alpaca.DEBUG;

$(document).ready(function() {

    var redirectUri = window.location.href + "?received=true";
    //console.log(redirectUri);
    //debugger;

    $("#contactus").alpaca({
        "view": "bootstrap-create",
        "schema": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "required": true
                },
                "email": {
                    "type": "string",
                    "required": true
                },
                "phone": {
                    "type": "string",
                    "required": true
                },
                "interest": {
                    "type": "string",
                    "required": true,
                    "enum": [
                        "support",
                        "implementation",
                        "advisory",
                        "training"
                    ]
                },
                "comments": {
                    "type": "string",
                    "required": true
                },
                "redirectUri": {
                    "type": "string",
                    "default": redirectUri
                }
            }
        },
        "options": {
            "form":{
                "attributes":{
                    "action":"https://www.cloudcms.com/landing/alpaca",
                    "method":"post"
                },
                "buttons":{
                    "submit":{
                        "value": "Send to Cloud CMS"
                    }
                }
            },
            "fields": {
                "name": {
                    "label": "Your Name"
                },
                "email": {
                    "label": "Your Email Address",
                    "type": "email"
                },
                "phone": {
                    "label": "Your Phone Number",
                    "type": "text"
                },
                "interest": {
                    "type": "select",
                    "label": "What do you need help with?",
                    "required": true,
                    "removeDefaultNone": false,
                    "optionLabels": [
                        "Production Support",
                        "Development",
                        "Consulting Services",
                        "Training"
                    ]
                },
                "comments": {
                    "label": "Tell us about your Project",
                    "type": "textarea"
                },
                "redirectUri": {
                    "label": false,
                    "hidden": true
                }
            },
            "focus": "name"
        },
        "postRender": function() {
            $(".alpaca-form-buttons-container").css({
                "text-align": "center"
            });
            $(".alpaca-form-button-submit").off().click(function() {
                doBlock("Please wait while your form is submitted...", true);
            });
        }
    });

});

// if received, modal popup
var doBlock = function(message, hideClose)
{
    var modal = (function (message, hideClose) {

        var TEMPLATE = ' \
            <div class="modal fade"> \
                <div class="modal-dialog"> \
                    <div class="modal-content"> \
                        <div class="modal-header"> \
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
                            <h4 class="modal-title">Please Wait...</h4> \
                        </div> \
                        <div class="modal-body"> \
                        </div> \
                        <div class="modal-footer"> \
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> \
                        </div> \
                    </div> \
                </div> \
            </div> \
        ';

        var div = $(TEMPLATE);
        $(div).find(".modal-body").html(message);

        if (hideClose)
        {
            $(div).find(".btn").hide();
        }

        return {
            show: function() {
                div.modal();
            },
            hide: function () {
                div.modal('hide');
            }
        };
    })(message, hideClose);

    modal.show();

    return modal;
};

var getParameterByName = function(name)
{
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if(results == null)
    {
        return "";
    }
    else
    {
        return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
};

// if request parameter "received == true", then show success message
var received = getParameterByName("received");
if (received)
{
    doBlock("Thank you!  Your information was received.<br/><br/>Someone will be in touch with you shortly.");
}
