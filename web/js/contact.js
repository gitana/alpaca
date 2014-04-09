//Alpaca.logLevel = Alpaca.DEBUG;

$("#contactus").alpaca({
    "view": "VIEW_BOOTSTRAP_CREATE",
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
                "default": "http://www.alpacajs.org/web/consulting.html?received=true"
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
        $(".alpaca-form-button").css({
            "padding": "10px"
        });
    }
});

// if received, modal popup
var doBlock = function(message)
{
    var config = {
        message: "<div><p align='center'><img src='../examples/css/images/alpaca.png' /></p><br/><p class='center'>" + message + "</p></div>",
        centerX: true,
        centerY: true,
        css:
        {
            border: 'none',
            padding: '40px',
            backgroundColor: '#fff',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: 1,
            color: '#fff'
        }
    };

    jQuery.blockUI(config);
    jQuery('.blockUI.blockMsg').center(true);
};

var getParameterByName = function(name)
{
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if(results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
};

// if request parameter "received == true", then show success message
var received = getParameterByName("received");
if (received)
{
    doBlock("Thank you!  Your information was received.<br/><br/>Someone will be in touch with you shortly.<br/><br/><a href='consulting.html'>Done</a>");
}
