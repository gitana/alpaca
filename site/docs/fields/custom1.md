---
layout: documentation-field
title: Custom Field
header: Custom Field
group: navigation
tags: field
---
{% include JB/setup %}

<div id="field9"> </div>
{% raw %}
<script type="text/javascript" id="field9-script">
var data = {
    "virtual_custom_77": "<p><strong>test gras</strong></p>\n\n<p><em>test italique</em></p>\n\n<p><s><em>test barr&eacute;</em></s></p>\n"
};
var schema = {
    "title": "Processing",
    "description": "Processing Object Schema.",
    "type": "object",
    "properties": {
        "title": {
            "title": "Finalité principale",
            "type": "string",
            "maxLength": 200
        },
        "virtual_custom_77": {
            "title": "Test Display",
            "type": "any"
        }
    }
};
var options = {
    "form": {
        "attributes": {
            "action": "/includes/components/form/post.php",
            "method": "post"
        },
        "buttons": {
            "refresh": {
                "title": "Refresh",
                "click": function() {
                    this.topControl.childrenByPropertyId["virtual_custom_77"].refresh();
                }
            }
        }
    },
    "fields": {
        "virtual_custom_77": {
            "view": "bootstrap-display-horizontal",
            "order": 1
        },
        "title": {
            "order": 0,
            "disallowOnlyEmptySpaces": true,
            "helper": "D&eacute;terminer la finalit&eacute; principale du traitement"
        }
    },
    "hideInitValidationError": true
};
var view = {
    "parent": "bootstrap-edit-horizontal",
    "layout": {
        "template": "<div>\n<nav class=\"navbar navbar-default\" role=\"navigation\">\n\t<div class=\"container-fluid\">\n\t\t<!-- Brand and toggle get grouped for better mobile display -->\n\t\t<div class=\"navbar-header\">\n\t\t\t<button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#center-navbar-collapse\">\n\t\t\t\t<span class=\"sr-only\">Toggle navigation</span>\n\t\t\t\t<span class=\"icon-bar\"></span>\n\t\t\t\t<span class=\"icon-bar\"></span>\n\t\t\t\t<span class=\"icon-bar\"></span>\n\t\t\t</button>\n\t\t\t<a class=\"navbar-brand\" href=\"#\"><span class=\"glyphicon glyphicon-star\" title=\"Favori\"></span></a>\n\t\t</div>\n\n\t\t<!-- Collect the nav links, forms, and other content for toggling -->\n\t\t<div class=\"collapse navbar-collapse\" id=\"center-navbar-collapse\">\n\t\t\t<div class=\"nav navbar-nav navbar-left\" id=\"center-toolset-1\"></div>\r\n\t\t\t<div class=\"nav navbar-nav navbar-left\" id=\"center-toolset-2\"></div>\n\t\t</div><!-- /.navbar-collapse -->\n\t</div><!-- /.container-fluid -->\n</nav>\n<div class=\"row\">\n<div class=\"col-md-12\" id=\"center-header\"></div>\n</div>\n<div class=\"row\">\n<div class=\"col-md-12\" id=\"center-tab-1-content\"></div>\n</div>\n<div class=\"row\">\n<div class=\"col-md-12\" id=\"center-footer\"></div>\n</div>\n</div>",
        "bindings": {
            "title": "center-tab-1-content",
            "virtual_custom_77": "center-tab-1-content"
        }
    }
};
$('#field9').alpaca({
    "data": data,
    "schema": schema,
    "options": options,
    "view": view
});
</script>
{% endraw %}
