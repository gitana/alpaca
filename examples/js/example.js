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

    addThemeSwitcher($('.alpaca-example-header'), {
        top: '6px',
        right: '0px'
    });

    // Enable source view buttons
    $.each($("div[id^='field'],table[id^='field']"), function() {
        var currentId = $(this).attr('id');

        var code = $.trim($('#' + currentId + '-script').html());
        $(this).after('<div class="clear" style="min-height:10px;"></div><div class="controls"><textarea class="input-xxlarge sample-code" id="' + currentId + '-code" rows="10" style="display:none;">' + code +'</textarea></div><div class="code-block" id="' + currentId + '-block"><pre id="' + currentId + '-pre" class="prettyprint linenums"></pre></div><div class="btn-toolbar"><a class="btn run" target-id="' + currentId + '" href="javascript:void(0);">Run &raquo;</a><a class="btn view" target-id="' + currentId + '" href="javascript:void(0);" style="display:none;">View Code</a><a class="btn edit" target-id="' + currentId + '" href="javascript:void(0);">Edit Code</a><a class="btn reset" target-id="' + currentId + '" href="javascript:void(0);">Reset</a></div><div class="clear" style="min-height:10px;"></div>').append('<div class="gitana-clear"></div>');;
        $('#' + currentId + '-pre').html(code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
    });

    $('.btn.run').click(function() {
        var targetId = $(this).attr('target-id');
        $('#' + targetId).empty();
        var code = $('textarea[id="' + targetId + "-code" + '"]').val();
        eval(code);
    });

    $('.btn.view').click(function() {
        var targetId = $(this).attr('target-id');
        var code = $('textarea[id="' + targetId + "-code" + '"]').val();
        $('#' + targetId + '-block pre').empty().html(prettyPrintOne(code.replace(/</g, '&lt;').replace(/>/g, '&gt;'), "", true));
        $('textarea#' + targetId + '-code').slideToggle();
        $('div#' + targetId + '-block').slideToggle();
        $('.btn.edit[target-id="' + targetId + '"]').slideToggle();
        $(this).slideToggle();
    });

    $('.btn.edit').click(function() {
        var targetId = $(this).attr('target-id');
        $('textarea#' + targetId + '-code').slideToggle();
        $('div#' + targetId + '-block').slideToggle();
        $('.btn.view[target-id="' + targetId + '"]').slideToggle();
        $(this).slideToggle();
    });

    $('.btn.reset').click(function() {
        var targetId = $(this).attr('target-id');
        var code = $.trim($('#' + targetId + '-script').html());
        $('textarea[id="' + targetId + "-code" + '"]').val(code);
    });

    window.prettyPrint && prettyPrint();

    // Example JSON
    var formExamples = [
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
                }
            ]
        },
        {
            "title": "Login Form",
            "examples": [
                {
                    "id":"simple-login-localized",
                    "title":"Localized Login Form",
                    "link":"../../forms/login/localized-login-form.html"
                }
            ]
        }
    ];

    var componentExamples = [{
        "title": "Fields - Basic",
        "examples": [
            {
                "id":"text-field",
                "title":"Text Field",
                "link":"../../components/fields/text-field.html"
            },
            {
                "id":"checkbox-field",
                "title":"Checkbox Field",
                "link":"../../components/fields/checkbox-field.html"
            },
            {
                "id":"number-field",
                "title":"Number Field",
                "link":"../../components/fields/number-field.html"
            },
            {
                "id":"any-field",
                "title":"Any Field",
                "link":"../../components/fields/any-field.html"
            },
            {
                "id":"array-field",
                "title":"Array Field",
                "link":"../../components/fields/array-field.html"
            },
            {
                "id":"object-field",
                "title":"Object Field",
                "link":"../../components/fields/object-field.html"
            },
            {
                "id":"radio-field",
                "title":"Radio Button Field",
                "link":"../../components/fields/radio-field.html"
            },
            {
                "id":"select-field",
                "title":"Select Field",
                "link":"../../components/fields/select-field.html"
            },
            {
                "id":"textarea-field",
                "title":"Textarea Field",
                "link":"../../components/fields/textarea-field.html"
            },
            {
                "id":"file-field",
                "title":"File Field",
                "link":"../../components/fields/file-field.html"
            }
        ]
    }, {
        "title": "Fields - Advanced",
        "examples": [
            {
                "id":"integer-field",
                "title":"Integer Field",
                "link":"../../components/fields/integer-field.html"
            },
            {
                "id":"uppercase-field",
                "title":"Uppercase Field",
                "link":"../../components/fields/uppercase-field.html"
            },
            {
                "id":"lowercase-field",
                "title":"Lowercase Field",
                "link":"../../components/fields/lowercase-field.html"
            },
            {
                "id":"ipv4-field",
                "title":"IPV4 Field",
                "link":"../../components/fields/ipv4-field.html"
            },
            {
                "id":"email-field",
                "title":"Email Field",
                "link":"../../components/fields/email-field.html"
            },
            {
                "id":"password-field",
                "title":"Password Field",
                "link":"../../components/fields/password-field.html"
            },
            {
                "id":"date-field",
                "title":"Date Field",
                "link":"../../components/fields/date-field.html"
            },
            {
                "id":"datetime-field",
                "title":"Datetime Field",
                "link":"../../components/fields/datetime-field.html"
            },
            {
                "id":"phone-field",
                "title":"Phone Field",
                "link":"../../components/fields/phone-field.html"
            },
            {
                "id":"personalname-field",
                "title":"Personal Name Field",
                "link":"../../components/fields/personalname-field.html"
            },
            {
                "id":"time-field",
                "title":"Time Field",
                "link":"../../components/fields/time-field.html"
            },
            {
                "id":"json-field",
                "title":"JSON Editor Field",
                "link":"../../components/fields/json-field.html"
            },
            {
                "id":"tag-field",
                "title":"Tag Field",
                "link":"../../components/fields/tag-field.html"
            },
            {
                "id":"map-field",
                "title":"Map Field",
                "link":"../../components/fields/map-field.html"
            },
            {
                "id":"wysiwyg-field",
                "title":"WYSIWYG Field",
                "link":"../../components/fields/wysiwyg-field.html"
            },
            {
                "id":"address-field",
                "title":"Address Field",
                "link":"../../components/fields/address-field.html"
            }
        ]
    }, {
        "title": "Form",
        "examples": [
            {
                "id":"form-buttons",
                "title":"Buttons",
                "link":"../../components/form-controls/buttons.html"
            }
        ]
    }, {
        "title": "Validation",
        "examples": [
            {
                "id":"validation",
                "title":"Validation",
                "link":"../../components/validation/validation-examples.html"
            }
        ]
    }, {
        "title": "Dependency",
        "examples": [
            {
                "id":"dependency-field",
                "title":"Dependency Field",
                "link":"../../components/dependency/dependency-field.html"
            },
            {
                "id":"conditional-field",
                "title":"Conditional Field",
                "link":"../../components/dependency/conditional-field.html"
            }
        ]
    }, {
        "title": "Wizards",
        "examples": [
            {
                "id":"auto-wizard",
                "title":"Auto Wizard",
                "link":"../../components/wizards/auto-wizard.html"
            },
            {
                "id":"template-wizard",
                "title":"Template Wizard",
                "link":"../../components/wizards/wizard.html"
            }
        ]
    }, {
        "title": "I18N",
        "examples": [
            {
                "id":"i18n-chinese",
                "title":"Chinese",
                "link":"../../components/i18n/i18n-chinese.html"
            },
            {
                "id":"i18n-spanish",
                "title":"Spanish",
                "link":"../../components/i18n/i18n-spanish.html"
            }
        ]
    }, {
        "title": "Layouts",
        "examples": [
            {
                "id":"layout-two-column",
                "title":"Two-Column",
                "link":"../../components/layouts/two-column-layout.html"
            },
            {
                "id":"layout-table",
                "title":"Table",
                "link":"../../components/layouts/table-layout/table-layout.html"
            },
            {
                "id":"layout-yaml",
                "title":"YAML",
                "link":"../../components/layouts/yaml-layout/yaml-layout.html"
            }
        ]
    }, {
        "title": "Preview",
        "examples": [
            {
                "id":"preview",
                "title":"Preview",
                "link":"../../components/preview/preview-examples.html"
            }
        ]
    }, {
        "title": "API",
        "examples": [
            {
                "id":"callback",
                "title":"Callback",
                "link":"../../components/callbacks/callback-examples.html"
            }
        ]
    }];

    var currentExampleId = $('.alpaca-example-header').attr('id');
    var currentExampleType = $('.alpaca-example-header').attr('alpaca-types');

    function renderSideBar(container, examples) {
        $.each(examples, function(j, example) {
            var sectionContainer = $('<div class="widget"><div class="widget-title"><h2>' + example.title +'</h2></div><div class="widget-body"></div></div>');
            var bar = $('<ul></ul>');
            $.each(example.examples, function(i, item) {
                var itemBar = $('<li></li>');
                //<span><span class="ui-icon ui-icon-document" style="float:left"></span>
                var listItem = $('<span><a href="' + item.link + '">' + item.title + '</a></span>');
                itemBar.append(listItem);
                if (item.id == currentExampleId) {
                    itemBar.addClass('ui-state-highlight');
                }
                itemBar.hover(function() {
                    $(this).addClass('ui-state-hover');
                }, function() {
                    $(this).removeClass('ui-state-hover');
                });
                itemBar.appendTo(bar);
            });
            bar.appendTo($('.widget-body',sectionContainer));
            sectionContainer.appendTo(container);
        });
    }

    if (!Alpaca.isValEmpty(currentExampleId)) {
        var sideBar = $('<div id="sidebar"></div>');
        if (currentExampleType == 'form') {
            renderSideBar(sideBar,formExamples);
        } else {
            renderSideBar(sideBar,componentExamples);
        }
        $('.side-bar').prepend(sideBar).prepend('<div style="clear:both"></div>');
        $('#sidebar').wrap('<div class="alpaca-example-sidebar"></div>');
        //$('.alpaca-example-header h1').prepend('<a href="../../../../index.html">Alpaca</a><span> :: </span>');
    }

    var getParameters = function(parameters, name) {
        var strParameters = "";
        strParameters += "<thead><tr><th>" + name + "</th><th>Description</th><th>Type</th><th>Default</th></tr></thead>";
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
            if (val['required']) {
                description += "<br/><b>Required</b>";
            }

            strParameters += "<td>" + /*val['title'] + "<br/>" +*/ description + "</td>";
            strParameters += "<td>" + val['type'] + "</td>";
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
                    strParameters += "<td>" /*+ val2['title'] + "<br/>"*/ + val2['description'] + "</td>";
                    strParameters += "<td>" + val2['type'] + "</td>";
                    //required = val2['required'] ? "true" : "false";
                    //strParameters += "<td>" + required + "</td>";
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
            //schemaDocumentation.append('<h1>' + schemaOfSchema['title'] + '</h1>')
            schemaDocumentation.append('<h4>' + schemaOfSchema['description'] + '</h4>');
            schemaDocumentation.append('<div>[<a href="#schema">Schema</a>] [<a href="#options">Options</a>] [<a href="#examples">Examples</a>]</div>')
            schemaDocumentation.append('<h2><a name="schema">Schema</a></h2>')
            var strSchemaFields = "<table class='table'><caption>List of Supported Schema Properties</caption>";
            strSchemaFields += getParameters(schemaOfSchema.properties, "Property");
            strSchemaFields += "</table>";
            schemaDocumentation.append(strSchemaFields);

            var schemaOfOptions = newTypeClassInstance.getSchemaOfOptions();
            //
            var optionsDocumentation = $('<div class="alpaca-options"></div>');
            schemaDocumentation.after(optionsDocumentation);
            optionsDocumentation.append('<h2><a name="options">Options</a></h2>')
            var strOptionsFields = "<table class='table'><caption>List of Supported Options Fields</caption>";
            strOptionsFields += getParameters(schemaOfOptions.properties, "Field");
            strOptionsFields += "</table>";
            optionsDocumentation.append(strOptionsFields);
            optionsDocumentation.after('<h2><a name="examples">Examples</a></h2>');
        }
    }
});
