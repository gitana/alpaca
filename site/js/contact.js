//Alpaca.logLevel = Alpaca.DEBUG;

$(document).ready(function() {

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
                "company": {
                    "type": "string",
                    "required": true
                },
                "phone": {
                    "type": "string",
                    "required": true
                },
                "comments": {
                    "type": "string",
                    "required": true
                },
                "newsletter": {
                    "type": "boolean",
                    "default": true
                },
                "redirectUri": {
                    "type": "string",
                    "default": window.location.href + "?received=true"
                }
            }
        },
        "options": {
            "renderForm":true,
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
                    "label": "Email Address",
                    "type": "email"
                },
                "company": {
                    "label": "Company Name"
                },
                "phone": {
                    "label": "Phone Number",
                    "type": "text"
                },
                "comments": {
                    "label": "Project Description",
                    "type": "textarea"
                },
                "newsletter": {
                    "label": false,
                    "rightLabel": "Sign up for the Cloud CMS Newsletter"
                },
                "redirectUri": {
                    "label": false,
                    "hidden": true
                }
            }
        },
        "postRender": function() {
            $(".alpaca-form-button-submit").css({
                "padding": "10px"
            }).click(function() {
                doBlock("Please wait while your form is submitted...", true);
            });
        }
    });

});

// if received, modal popup
var doBlock = function(message, hideClose)
{
    var modal = (function (message) {

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
    })(message);

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
