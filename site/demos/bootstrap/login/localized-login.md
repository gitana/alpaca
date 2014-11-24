---
layout: demo
title: Localized Login Demo
header: Localized Login Demo
framework: Twitter Bootstrap
---

The form below provides a localized login form in Spanish.  It uses the <code>es_ES</code> local to render the form
in Spanish using the configuration shown.  It also hooks in a custom validation and submission handler.

<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
Alpaca.setDefaultLocale("es_ES");
$("#field1").alpaca({
    "schema": {
        "type":"object",
        "properties": {
            "username": {
                "type":"string",
                "title":"Username",
                "required":true,
                "pattern":"^[a-zA-Z0-9_]+$"
            },
            "password": {
                "type":"string",
                "title":"Password",
                "required":true,
                "pattern":"^[a-zA-Z0-9_]+$"
            }
        }
    },
    "options":{
        "renderForm":true,
        "form":{
            "attributes":{
                "action":"../../endpoints/echo.php",
                "method":"post"
            },
            "buttons":{
                "submit":{}
            }
        },
        "fields": {
            "username": {
                "size": 20,
                "label": "Nombre de usuario"
            },
            "password": {
                "type" : "password",
                "size": 20,
                "label": "Contraseña"
            }
        }
    },
    "data": {
        "username": "1234",
        "password": "@@@"
    },
    "view" :{
        "parent": "bootstrap-create-horizontal",
        "fields": {
            "/username": {
                "messages": {
                    "es_ES": {
                        "invalidPattern": "Nombre de usuario no válido!"
                    }
                }
            }
        }
    },
    "postRender": function(renderedField) {
        var form = renderedField.form;
        if (form) {
            form.registerSubmitHandler(function(e) {
                return (renderedField.isValid(true));
            });
        }
    }
});
</script>
{% endraw %}
