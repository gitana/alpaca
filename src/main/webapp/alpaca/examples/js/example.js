$(function() {
    // Add theme switcher
    function addThemeSwitcher(container, position) {
        var pos = {
            top: '10px',
            right: '10px',
            zIndex: 10
        };
        $('<div id="themeContainer" style="position: absolute; overflow-x: hidden;"></div>').css($.extend(pos, position)).appendTo(container || 'body').themeswitcher();
    }

    ;

    addThemeSwitcher($('.alpaca-example-header'), {
        top: '26px',
        right: '20px'
    });

    // Enable source view buttons
    /*
     $.each($("div[id^='field'],table[id^='field']"), function() {
     var currentId = $(this).attr('id');

     $(this).after('<span><small><button id="' + currentId + '-code-button">Source Code</button></small></span><pre id="' + currentId + '-pre" style="margin: -15px 0px 0px 5px;"><code id="' + currentId + '-code" style="margin: 15px 0px 0px 5px;"></code></pre>').after('<div class="alpaca-clear"></div>');
     $('#' + currentId + '-pre').hide();
     $('#' + currentId + '-code-button').button({
     icons: {
     primary: "ui-icon-circle-arrow-e"
     }
     }).click(function() {
     var code = $.trim($('#' + currentId + '-script').html());
     $('#' + currentId + '-code').html(code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
     $('#' + currentId + '-pre').toggle();
     $('.ui-icon', this).toggleClass("ui-icon-circle-arrow-e").toggleClass("ui-icon-circle-arrow-s");
     });
     });
     */
    $.each($("div[id^='field'],table[id^='field']"), function() {
        var currentId = $(this).attr('id');

        $(this).after('<div class="clear" style="min-height:10px;"></div><span><small><button id="' + currentId + '-code-button">Source Code</button></small></span><div class="code-block" id="' + currentId + '-block"><pre id="' + currentId + '-pre" class="brush: js; toolbar: false;"></pre></div>').after('<div class="gitana-clear"></div>');
        $('#' + currentId + '-block').hide();
        var code = $.trim($('#' + currentId + '-script').html());
        $('#' + currentId + '-pre').html(code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
        $('#' + currentId + '-code-button').button({
            icons: {
                primary: "ui-icon-circle-arrow-e"
            }
        }).click(function() {
                $('#' + currentId + '-block').toggle();
                $('.ui-icon', this).toggleClass("ui-icon-circle-arrow-e").toggleClass("ui-icon-circle-arrow-s");
            });
    });

    // Example JSON
    var examples = [
        {
            "title":"Form Gallery",
            "examples" : [
                {
                    "title": "Customer Profile",
                    "examples": [
                        {
                            "id":"customer-profile-create",
                            "title":"Create",
                            "link":"../../forms/customer-profile/create-form.html"
                        },
                        {
                            "id":"customer-profile-create-simple",
                            "title":"Create (Simplified)",
                            "link":"../../forms/customer-profile/create-simple-form.html"
                        },
                        {
                            "id":"customer-profile-edit",
                            "title":"Edit",
                            "link":"../../forms/customer-profile/edit-form.html"
                        },
                        {
                            "id":"customer-profile-edit-simple",
                            "title":"Edit (Simplified)",
                            "link":"../../forms/customer-profile/edit-simple-form.html"
                        },
                        {
                            "id":"customer-profile-edit-custom",
                            "title":"Edit (Customized)",
                            "link":"../../forms/customer-profile/edit-custom-view-form.html"
                        },
                        {
                            "id":"customer-profile-edit-readonly",
                            "title":"Edit (Readonly)",
                            "link":"../../forms/customer-profile/edit-readonly-form.html"
                        },
                        {
                            "id":"customer-profile-view-custom",
                            "title":"View (Customized)",
                            "link":"../../forms/customer-profile/custom-view-form.html"
                        },
                        {
                            "id":"customer-list",
                            "title":"Customer List",
                            "link":"../../forms/customer-profile/list-table-form.html"
                        }
                    ]
                }
            ]
        },
        {
            "title":"Component Gallery",
            "examples" : [
                {
                    "title": "Controls",
                    "examples": [
                        {
                            "id":"text-field",
                            "title":"Text Field",
                            "link":"../../fields/controls/text-field.html"
                        },
                        {
                            "id":"checkbox-field",
                            "title":"Checkbox Field",
                            "link":"../../fields/controls/checkbox-field.html"
                        },
                        {
                            "id":"number-field",
                            "title":"Number Field",
                            "link":"../../fields/controls/number-field.html"
                        },
                        {
                            "id":"any-field",
                            "title":"Any Field",
                            "link":"../../fields/controls/any-field.html"
                        },
                        {
                            "id":"array-field",
                            "title":"Array Field",
                            "link":"../../fields/controls/array-field.html"
                        },
                        {
                            "id":"object-field",
                            "title":"Object Field",
                            "link":"../../fields/controls/object-field.html"
                        },
                        {
                            "id":"integer-field",
                            "title":"Integer Field",
                            "link":"../../fields/controls/integer-field.html"
                        },
                        {
                            "id":"radio-field",
                            "title":"Radio Button Field",
                            "link":"../../fields/controls/radio-field.html"
                        },
                        {
                            "id":"select-field",
                            "title":"Select Field",
                            "link":"../../fields/controls/select-field.html"
                        },
                        {
                            "id":"uppercase-field",
                            "title":"Uppercase Field",
                            "link":"../../fields/controls/uppercase-field.html"
                        },
                        {
                            "id":"lowercase-field",
                            "title":"Lowercase Field",
                            "link":"../../fields/controls/lowercase-field.html"
                        },
                        {
                            "id":"ipv4-field",
                            "title":"IPV4 Field",
                            "link":"../../fields/controls/ipv4-field.html"
                        },
                        {
                            "id":"email-field",
                            "title":"Email Field",
                            "link":"../../fields/controls/email-field.html"
                        },
                        {
                            "id":"password-field",
                            "title":"Password Field",
                            "link":"../../fields/controls/password-field.html"
                        },
                        {
                            "id":"date-field",
                            "title":"Date Field",
                            "link":"../../fields/controls/date-field.html"
                        },
                        {
                            "id":"phone-field",
                            "title":"Phone Field",
                            "link":"../../fields/controls/phone-field.html"
                        },
                        {
                            "id":"personalname-field",
                            "title":"Personal Name Field",
                            "link":"../../fields/controls/personalname-field.html"
                        },
                        {
                            "id":"time-field",
                            "title":"Time Field",
                            "link":"../../fields/controls/time-field.html"
                        },
                        {
                            "id":"json-field",
                            "title":"JSON Editor Field",
                            "link":"../../fields/controls/json-field.html"
                        },
                        {
                            "id":"tag-field",
                            "title":"Tag Field",
                            "link":"../../fields/controls/tag-field.html"
                        },
                        {
                            "id":"map-field",
                            "title":"Map Field",
                            "link":"../../fields/controls/map-field.html"
                        },
                        {
                            "id":"textarea-field",
                            "title":"Textarea Field",
                            "link":"../../fields/controls/textarea-field.html"
                        },
                        {
                            "id":"wysiwyg-field",
                            "title":"WYSIWYG Field",
                            "link":"../../fields/controls/wysiwyg-field.html"
                        },
                        {
                            "id":"file-field",
                            "title":"File Field",
                            "link":"../../fields/controls/file-field.html"
                        },
                        {
                            "id":"combo-field",
                            "title":"Combo Fields",
                            "link":"../../fields/controls/combo-field.html"
                        },
                        {
                            "id":"dependency-field",
                            "title":"Dependency Field",
                            "link":"../../fields/controls/dependency-field.html"
                        },
                        {
                            "id":"conditional-field",
                            "title":"Conditional Field",
                            "link":"../../fields/controls/conditional-field.html"
                        }
                    ]
                },
                {
                    "title": "Form",
                    "examples": [
                        {
                            "id":"form-controls",
                            "title":"Buttons",
                            "link":"../../fields/form-controls/buttons.html"
                        }
                    ]
                },
                {
                    "title": "Validation",
                    "examples": [
                        {
                            "id":"validation",
                            "title":"Validation",
                            "link":"../../fields/validation/validation-examples.html"
                        }
                    ]
                },
                {
                    "title": "Wizards",
                    "examples": [
                        {
                            "id":"auto-wizard",
                            "title":"Auto Wizard",
                            "link":"../../fields/wizards/auto-wizard.html"
                        },
                        {
                            "id":"template-wizard",
                            "title":"Template Wizard",
                            "link":"../../fields/wizards/wizard.html"
                        }
                    ]
                },
                {
                    "title": "I18N",
                    "examples": [
                        {
                            "id":"i18n-chinese",
                            "title":"Chinese",
                            "link":"../../fields/i18n/i18n-chinese.html"
                        },
                        {
                            "id":"i18n-spanish",
                            "title":"Spanish",
                            "link":"../../fields/i18n/i18n-spanish.html"
                        }
                    ]
                },
                {
                    "title": "Layouts",
                    "examples": [
                        {
                            "id":"layout-two-column",
                            "title":"Two-Column",
                            "link":"../../fields/layouts/two-column-layout.html"
                        }
                    ]
                },
                {
                    "title": "Callbacks",
                    "examples": [
                        {
                            "id":"callback",
                            "title":"Callback",
                            "link":"../../fields/callbacks/callback-examples.html"
                        }
                    ]
                },
                {
                    "title": "Views",
                    "examples": [
                        {
                            "id":"view",
                            "title":"View",
                            "link":"../../fields/views/view-examples.html"
                        }
                    ]
                },
                {
                    "title": "Connectors",
                    "examples": [
                        {
                            "id":"simple-connector",
                            "title":"Simple",
                            "link":"../../fields/connectors/simple-connector.html"
                        },
                        {
                            "id":"gitana-connector",
                            "title":"Gitana",
                            "link":"../../fields/connectors/gitana-connector.html"
                        }
                    ]
                }
            ]
        }
    ];

    var currentExampleId = $('.alpaca-example-header').attr('id');

    function _renderSideBar(container, items) {
        var bar = $('<ul>' + items.title + '</span></ul>');
        $.each(items.examples, function(i, item) {
            var itemBar = $('<li></li>');
            if (item.examples) {
                _renderSideBar(itemBar, item);
            } else {
                var listItem = $('<span><span class="ui-icon ui-icon-document" style="float:left"></span><a href="' + item.link + '">' + item.title + '</a></span>');
                itemBar.append(listItem);
                if (item.id == currentExampleId) {
                    itemBar.addClass('ui-state-highlight');
                }
                itemBar.hover(function() {
                    $(this).addClass('ui-state-hover');
                }, function() {
                    $(this).removeClass('ui-state-hover');
                });
            }
            itemBar.appendTo(bar);
        });
        bar.appendTo(container);
    }

    ;

    function renderSideBar(container) {
        $.each(examples, function(i, items) {
            container.append('<h3><a href="#">' + items.title + '</a></h3>');
            var bar = $('<ul></ul>');
            $.each(items.examples, function(i, item) {
                var itemBar = $('<li></li>');
                _renderSideBar(itemBar, item);
                itemBar.appendTo(bar);
            });
            bar.wrap('<div></div>');
            bar.appendTo(container);
        });
    }

    ;

    if (!Alpaca.isValEmpty(currentExampleId)) {
        var sideBar = $('<div id="sidebar"></div>');
        renderSideBar(sideBar);
        //$('h2:first', sideBar).addClass('ui-widget-header');
        //sideBar.prepend('<div class="alpaca-example-sidebar-header ui-widget ui-widget-content ui-widget-header ui-corner-top">' + jsonDocument.title + '</div>');
        $('.alpaca-example-body').prepend(sideBar).prepend('<div style="clear:both"></div>');
        $('#sidebar').wrap('<div class="alpaca-example-sidebar"></div>');
        $('#sidebar').accordion({
            autoHeight: false,
            navigation: true
        });
        $('.alpaca-example-header h2').prepend('<a href="../../../index.html">Alpaca</a><span> > </span>');
    }

    var getParameters = function(parameters, name) {
        var strParameters = "";
        strParameters += "<thead><tr><th>" + name + "</th><th>Description</th><th>Type</th><th>Required</th><th>Default</th></tr></thead>";
        var oddRow = true
        $.each(parameters, function(key, val) {
            var className = "odd";
            if (oddRow) {
                oddRow = false;
            } else {
                oddRow = true;
                className = "even"
            }
            strParameters += "<tr class='" + className + "'>";
            strParameters += "<td>" + key + "</td>";
            var description = val['description'];
            if (val['enum']) {
                description += "<br/>Allowed options : " + val['enum'].join(',');
            }
            if (val['readonly']) {
                description += "<br/><b>Readonly</b>";
            }
            strParameters += "<td>" + val['title'] + "<br/>" + description + "</td>";
            strParameters += "<td>" + val['type'] + "</td>";
            var required = val['required'] ? "true" : "false";
            strParameters += "<td>" + required + "</td>";
            var defaultVal = val['default'] != null ? val['default'] : "";
            strParameters += "<td>" + defaultVal + "</td>";
            strParameters += "</tr>";

            if (val['properties']) {
                $.each(val['properties'], function(key2, val2) {
                    if (oddRow) {
                        oddRow = false;
                        className = "odd";
                    } else {
                        oddRow = true;
                        className = "even"
                    }
                    strParameters += "<tr class='" + className + "'>";
                    strParameters += "<td>" + key + "." + key2 + "</td>";
                    strParameters += "<td>" + val2['title'] + "<br/>" + val2['description'] + "</td>";
                    strParameters += "<td>" + val2['type'] + "</td>";
                    required = val2['required'] ? "true" : "false";
                    strParameters += "<td>" + required + "</td>";
                    defaultVal = val2['default'] != null ? val2['default'] : "";
                    strParameters += "<td>" + defaultVal + "</td>";
                    strParameters += "</tr>";
                });
            }
        });
        return strParameters;
    };

    var currentExampleAlpacaTypes = $('.alpaca-example-header').attr('alpaca-types');

    if (!Alpaca.isValEmpty(currentExampleAlpacaTypes)) {
        var alpacaTypeClass = Alpaca.getFieldClass(currentExampleAlpacaTypes);
        if (alpacaTypeClass) {
            var newTypeClassInstance = new alpacaTypeClass();
            var schemaOfSchema = newTypeClassInstance.getSchemaOfSchema();
            //
            var schemaDocumentation = $('<div class="alpaca-schema"></div>');
            $('.alpaca-example-case').prepend(schemaDocumentation);
            schemaDocumentation.append('<h2>' + schemaOfSchema['title'] + '</h2>')
            schemaDocumentation.append('<h4>' + schemaOfSchema['description'] + '</h4>');
            schemaDocumentation.append('<div>[<a href="#schema">Schema</a>] [<a href="#options">Options</a>] [<a href="#examples">Examples</a>]</div>')
            schemaDocumentation.append('<h3><a name="schema">Schema</a></h3>')
            var strSchemaFields = "<table class='table'><caption>List of Supported Schema Properties</caption>";
            strSchemaFields += getParameters(schemaOfSchema.properties, "Property");
            strSchemaFields += "</table>";
            schemaDocumentation.append(strSchemaFields);

            var schemaOfOptions = newTypeClassInstance.getSchemaOfOptions();
            //
            var optionsDocumentation = $('<div class="alpaca-options"></div>');
            schemaDocumentation.after(optionsDocumentation);
            optionsDocumentation.append('<h3><a name="options">Options</a></h3>')
            var strOptionsFields = "<table class='table'><caption>List of Supported Options Fields</caption>";
            strOptionsFields += getParameters(schemaOfOptions.properties, "Field");
            strOptionsFields += "</table>";
            optionsDocumentation.append(strOptionsFields);
            optionsDocumentation.after('<h3><a name="examples">Examples</a></h3>');
        }
    }
});
