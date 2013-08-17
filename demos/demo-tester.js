var setup = function()
{
    var MODAL_TEMPLATE = ' \
        <div class="modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="overflow: visible !important"> \
            <div class="modal-header"> \
                <h3 class="modal-title"></h3> \
            </div> \
            <div class="modal-body"></div> \
            <div class="modal-footer"></div> \
        </div> \
    ';

    var schema = {
        "type": "object",
        "properties": {
            "title": {
                "type": "string"
            }
        }
    };
    var options = {
        "fields": {
            "title": {
                "type": "text",
                "label": "Title"
            }
        }
    };
    var data = {
        "title": "Hello World"
    };

    var setupEditor = function(id, json)
    {
        var text = JSON.stringify(json, null, "    ");

        var editor = ace.edit(id);
        editor.setTheme("ace/theme/textmate");
        editor.getSession().setMode("ace/mode/json");
        editor.renderer.setHScrollBarAlwaysVisible(false);
        editor.setShowPrintMargin(false);
        editor.setValue(text);

        setTimeout(function() {
            editor.clearSelection();
        }, 100);

        return editor;
    };

    var editor1 = setupEditor("schema", schema);
    var editor2 = setupEditor("options", options);
    var editor3 = setupEditor("data", data);

    var mainViewField = null;
    var mainPreviewField = null;
    var mainDesignerField = null;

    var doRefresh = function(el, buildInteractionLayers, disableErrorHandling, cb)
    {
        try
        {
            schema = JSON.parse(editor1.getValue());
        }
        catch (e)
        {
        }

        try
        {
            options = JSON.parse(editor2.getValue());
        }
        catch (e)
        {
        }

        try
        {
            data = JSON.parse(editor3.getValue());
        }
        catch (e)
        {
        }

        if (schema)
        {
            var config = {
                "schema": schema
            };
            if (options)
            {
                config.options = options;
            }
            if (data)
            {
                config.data = data;
            }
            config.postRender = function(form) {

                if (buildInteractionLayers)
                {
                    var iCount = 0;

                    // cover every control with an interaction layer
                    form.getEl().find(".alpaca-fieldset-item-container").each(function() {

                        var alpacaFieldId = $(this).attr("alpaca-id");

                        iCount++;
                        $(this).attr("icount", iCount);

                        var width = $(this).outerWidth();
                        var height = $(this).outerHeight();

                        // cover div
                        var cover = $("<div></div>");
                        $(cover).addClass("cover");
                        $(cover).attr("alpaca-ref-id", alpacaFieldId);
                        $(cover).css({
                            "position": "relative",
                            "margin-top": "-" + height + "px",
                            "width": width,
                            "height": height,
                            "opacity": 0,
                            "background-color": "white",
                            "z-index": 900
                        });
                        $(cover).attr("icount-ref", iCount);
                        $(this).append(cover);

                        // interaction div
                        var interaction = $("<div class='interaction'></div>");
                        var buttonGroup = $("<div class='btn-group pull-right'></div>");
                        //var schemaButton = $("<button class='btn button-schema' alpaca-ref-id='" + alpacaFieldId + "'>Schema</button>");
                        var schemaButton = $('<button class="btn btn-small button-schema" alpaca-ref-id="' + alpacaFieldId + '"><i class="icon-list"></i></button>');
                        buttonGroup.append(schemaButton);
                        //var optionsButton = $("<button class='btn button-options' alpaca-ref-id='" + alpacaFieldId + "'>Options</button>");
                        var optionsButton = $('<button class="btn btn-small button-options" alpaca-ref-id="' + alpacaFieldId + '"><i class="icon-wrench"></i></button>');
                        buttonGroup.append(optionsButton);
                        //var removeButton = $("<button class='btn btn-danger button-remove' alpaca-ref-id='" + alpacaFieldId + "'>Delete</button>");
                        var removeButton = $('<button class="btn btn-danger btn-small button-remove" alpaca-ref-id="' + alpacaFieldId + '"><i class="icon-white icon-remove"></i></button>');
                        buttonGroup.append(removeButton);
                        interaction.append(buttonGroup);
                        interaction.append("<div style='clear:both'></div>");
                        $(interaction).addClass("interaction");
                        $(interaction).attr("alpaca-ref-id", alpacaFieldId);
                        $(interaction).css({
                            "position": "relative",
                            "margin-top": "-" + height + "px",
                            "width": width,
                            "height": height,
                            "opacity": 1,
                            //"background-color": "white",
                            "z-index": 901
                        });
                        $(interaction).attr("icount-ref", iCount);
                        $(this).append(interaction);
                        $(buttonGroup).css({
                            "margin-top": ($(interaction).height() / 2) - ($(buttonGroup).height() / 2),
                            "margin-right": "8px"
                        });
                        $(schemaButton).off().click(function(e) {

                            e.preventDefault();
                            e.stopPropagation();

                            var alpacaId = $(this).attr("alpaca-ref-id");

                            editSchema(alpacaId);
                        });
                        $(optionsButton).off().click(function(e) {

                            e.preventDefault();
                            e.stopPropagation();

                            var alpacaId = $(this).attr("alpaca-ref-id");

                            editOptions(alpacaId);
                        });
                        $(removeButton).off().click(function(e) {

                            e.preventDefault();
                            e.stopPropagation();

                            var alpacaId = $(this).attr("alpaca-ref-id");
                            removeField(alpacaId);
                        });

                        // when hover, highlight
                        $(interaction).hover(function(e) {
                            var iCount = $(interaction).attr("icount-ref");
                            $(".cover[icount-ref='" + iCount + "']").addClass("ui-hover-state");
                        }, function(e) {
                            var iCount = $(interaction).attr("icount-ref");
                            $(".cover[icount-ref='" + iCount + "']").removeClass("ui-hover-state");
                        });
                    });

                    // add dashed
                    form.getEl().find(".alpaca-fieldset-items-container").addClass("dashed");
                    form.getEl().find(".alpaca-fieldset-item-container").addClass("dashed");

                    // for every container, add a "first" drop zone element
                    // this covers empty containers as well as 0th index insertions
                    form.getEl().find(".alpaca-fieldset-items-container").each(function() {
                        $(this).prepend("<div class='dropzone'></div>");
                    });

                    // after every element in a container, add something which allows inserts "after"
                    form.getEl().find(".alpaca-fieldset-item-container").each(function() {
                        $(this).after("<div class='dropzone'></div>");
                    });

                    form.getEl().find(".dropzone").droppable({
                        "tolerance": "touch",
                        "drop": function( event, ui ) {

                            var draggable = $(ui.draggable);

                            if (draggable.hasClass("form-element"))
                            {
                                var dataType = draggable.attr("data-type");
                                var fieldType = draggable.attr("data-field-type");

                                // based on where the drop occurred, figure out the previous and next Alpaca fields surrounding
                                // the drop target

                                // previous
                                var previousField = null;
                                var previousFieldKey = null;
                                var previousItemContainer = $(event.target).prev();
                                if (previousItemContainer)
                                {
                                    var previousAlpacaId = $(previousItemContainer).attr("alpaca-id");
                                    previousField = Alpaca.fieldInstances[previousAlpacaId];

                                    previousFieldKey = $(previousItemContainer).attr("data-alpaca-item-container-item-key");
                                }

                                // next
                                var nextField = null;
                                var nextFieldKey = null;
                                var nextItemContainer = $(event.target).next();
                                if (nextItemContainer)
                                {
                                    var nextAlpacaId = $(nextItemContainer).attr("alpaca-id");
                                    nextField = Alpaca.fieldInstances[nextAlpacaId];

                                    nextFieldKey = $(nextItemContainer).attr("data-alpaca-item-container-item-key");
                                }

                                // parent field
                                var parentFieldAlpacaId = $(event.target).parent().parent().attr("alpaca-field-id");
                                var parentField = Alpaca.fieldInstances[parentFieldAlpacaId];

                                // now do the insertion
                                insertField(schema, options, data, dataType, fieldType, parentField, previousField, previousFieldKey, nextField, nextFieldKey);
                            }
                            else if (draggable.hasClass("interaction"))
                            {
                                console.log("INTERACTION");
                            }

                        },
                        "over": function (event, ui ) {
                            $(event.target).addClass("dropzone-hover");
                        },
                        "out": function (event, ui) {
                            $(event.target).removeClass("dropzone-hover");
                        }
                    });

                    // init any in-place draggables
                    form.getEl().find(".interaction").draggable({
                        "appendTo": "body",
                        "helper": function() {
                            var iCount = $(this).attr("icount-ref");
                            var clone = $(".alpaca-fieldset-item-container[icount='" + iCount + "']").clone();
                            return clone;
                        },
                        "cursorAt": {
                            "top": 100
                        },
                        "zIndex": 300,
                        "refreshPositions": true,
                        "start": function(event, ui) {
                            $(".dropzone").addClass("dropzone-highlight");
                        },
                        "stop": function(event, ui) {
                            $(".dropzone").removeClass("dropzone-highlight");
                        }
                    });
                }

                cb(null, form);
            };
            config.error = function(err)
            {
                Alpaca.defaultErrorCallback(err);

                cb(err);
            };

            if (disableErrorHandling)
            {
                Alpaca.defaultErrorCallback = function(error) {
                    console.log("Alpaca encountered an error while previewing form -> " + error.message);
                };
            }
            else
            {
                Alpaca.defaultErrorCallback = Alpaca.DEFAULT_ERROR_CALLBACK;
            }

            $(el).alpaca(config);
        }
    };

    var editSchema = function(alpacaFieldId, callback)
    {
        var field = Alpaca.fieldInstances[alpacaFieldId];

        var fieldSchema = field.getSchemaOfSchema();
        var fieldSchemaOptions = field.getOptionsForSchema();
        var fieldData = field.schema;

        delete fieldSchema.title;
        delete fieldSchema.description;
        if (fieldSchema.properties)
        {
            delete fieldSchema.properties.title;
            delete fieldSchema.properties.description;
            delete fieldSchema.properties.dependencies;
        }
        var fieldConfig = {
            schema: fieldSchema
        };
        if (fieldSchemaOptions)
        {
            fieldConfig.options = fieldSchemaOptions;
        }
        if (fieldData)
        {
            fieldConfig.data = fieldData;
        }
        fieldConfig.view = {
            "parent": "VIEW_BOOTSTRAP_EDIT_LIST",
            "displayReadonly": false
        };
        fieldConfig.postRender = function(control)
        {
            var modal = $(MODAL_TEMPLATE.trim());
            modal.find(".modal-title").append(field.getTitle());
            modal.find(".modal-body").append(control.getEl());

            modal.find('.modal-footer').append("<button class='btn pull-right okay' data-dismiss='modal' aria-hidden='true'>Okay</button>");
            modal.find('.modal-footer').append("<button class='btn pull-left' data-dismiss='modal' aria-hidden='true'>Cancel</button>");

            $(modal).modal({
                "keyboard": true
            });

            $(modal).find(".okay").click(function() {

                field.schema = control.getValue();

                var top = findTop(field);
                regenerate(top);

                if (callback)
                {
                    callback();
                }
            });

            // clean up the generated formatting
            control.getEl().find(".alpaca-controlfield-helper").remove();
            control.getEl().find(".alpaca-fieldset-helper").css({
                "padding-top": "0px",
                "padding-bottom": "0px"
            });
            control.getEl().find(".alpaca-fieldset-legend").css({
                "margin-bottom": "0px"
            });
            control.getEl().find("input").css({
                "margin-bottom": "0px"
            });
            control.getEl().find("label").css({
                "margin-bottom": "0px"
            });
            control.getEl().find(".alpaca-controlfield-container").css({
                "padding-top": "0px",
                "padding-bottom": "0px"
            });
            modal.find(".modal-body").css({
                "padding-top": "0px"
            });
        };

        var x = $("<div><div class='fieldForm'></div></div>");
        $(x).find(".fieldForm").alpaca(fieldConfig);
    };

    var editOptions = function(alpacaFieldId, callback)
    {
        var field = Alpaca.fieldInstances[alpacaFieldId];

        var fieldOptionsSchema = field.getSchemaOfOptions();
        var fieldOptionsOptions = field.getOptionsForOptions();
        var fieldOptionsData = field.options;

        delete fieldOptionsSchema.title;
        delete fieldOptionsSchema.description;
        if (fieldOptionsSchema.properties)
        {
            delete fieldOptionsSchema.properties.title;
            delete fieldOptionsSchema.properties.description;
            delete fieldOptionsSchema.properties.dependencies;
            delete fieldOptionsSchema.properties.readonly;
        }
        if (fieldOptionsOptions.fields)
        {
            delete fieldOptionsOptions.fields.title;
            delete fieldOptionsOptions.fields.description;
            delete fieldOptionsOptions.fields.dependencies;
            delete fieldOptionsOptions.fields.readonly;
        }

        var fieldConfig = {
            schema: fieldOptionsSchema
        };
        if (fieldOptionsOptions)
        {
            fieldConfig.options = fieldOptionsOptions;
        }
        if (fieldOptionsData)
        {
            fieldConfig.data = fieldOptionsData;
        }
        fieldConfig.view = {
            "parent": "VIEW_BOOTSTRAP_EDIT_LIST",
            "displayReadonly": false
        };
        fieldConfig.postRender = function(control)
        {
            var modal = $(MODAL_TEMPLATE.trim());
            modal.find(".modal-title").append(field.getTitle());
            modal.find(".modal-body").append(control.getEl());

            modal.find('.modal-footer').append("<button class='btn pull-right okay' data-dismiss='modal' aria-hidden='true'>Okay</button>");
            modal.find('.modal-footer').append("<button class='btn pull-left' data-dismiss='modal' aria-hidden='true'>Cancel</button>");

            $(modal).modal({
                "keyboard": true
            });

            $(modal).find(".okay").click(function() {

                field.options = control.getValue();

                var top = findTop(field);
                regenerate(top);

                if (callback)
                {
                    callback();
                }
            });

            // clean up the generated formatting
            control.getEl().find(".alpaca-controlfield-helper").remove();
            control.getEl().find(".alpaca-fieldset-helper").css({
                "padding-top": "0px",
                "padding-bottom": "0px"
            });
            control.getEl().find(".alpaca-fieldset-legend").css({
                "margin-bottom": "0px"
            });
            control.getEl().find("input").css({
                "margin-bottom": "0px"
            });
            control.getEl().find("label").css({
                "margin-bottom": "0px"
            });
            control.getEl().find(".alpaca-controlfield-container").css({
                "padding-top": "0px",
                "padding-bottom": "0px"
            });
            modal.find(".modal-body").css({
                "padding-top": "0px"
            });
        };

        var x = $("<div><div class='fieldForm'></div></div>");
        $(x).find(".fieldForm").alpaca(fieldConfig);
    };

    var refreshView = function(callback)
    {
        if (mainViewField)
        {
            mainViewField.getEl().replaceWith("<div id='viewDiv'></div>");
            mainViewField.destroy();
            mainViewField = null;
        }

        doRefresh($("#viewDiv"), false, false, function(err, form) {

            if (!err)
            {
                mainViewField = form;
            }

            if (callback)
            {
                callback();
            }

        });
    };

    var refreshPreview = function(callback)
    {
        if (mainPreviewField)
        {
            mainPreviewField.getEl().replaceWith("<div id='previewDiv'></div>");
            mainPreviewField.destroy();
            mainPreviewField = null;
        }

        doRefresh($("#previewDiv"), false, false, function(err, form) {

            if (!err)
            {
                mainPreviewField = form;
            }

            if (callback)
            {
                callback();
            }

        });
    };

    var refreshDesigner = function(callback)
    {
        $(".dropzone").remove();
        $(".interaction").remove();
        $(".cover").remove();

        if (mainDesignerField)
        {
            mainDesignerField.getEl().replaceWith("<div id='designerDiv'></div>");
            mainDesignerField.destroy();
            mainDesignerField = null;
        }

        doRefresh($("#designerDiv"), true, false, function(err, form) {

            if (!err)
            {
                mainDesignerField = form;
            }

            if (callback)
            {
                callback();
            }

        });
    };

    var refresh = function(callback)
    {
        var current = $("UL.nav.nav-tabs LI.active A.tab-item");
        $(current).click();
    };

    var rtChange = false;
    editor1.on("change", function() {
        rtChange = true;
    });
    editor2.on("change", function() {
        rtChange = true;
    });
    editor3.on("change", function() {
        rtChange = true;
    });

    // background "thread" to detect changes and update the preview div
    var rtProcessing = false;
    var rtFunction = function() {

        if (rtChange && !rtProcessing)
        {
            rtProcessing = true;
            if (mainPreviewField)
            {
                mainPreviewField.getEl().replaceWith("<div id='previewDiv'></div>");
                mainPreviewField.destroy();
                mainPreviewField = null;
            }
            doRefresh($("#previewDiv"), false, true, function(err, form) {

                if (!err)
                {
                    mainPreviewField = form;
                }

                rtChange = false;
                rtProcessing = false;
            });
        }

        setTimeout(rtFunction, 1000);

    };
    rtFunction();


    var isCoreField = function(type)
    {
        var cores = ["any", "array", "checkbox", "file", "hidden", "number", "object", "radio", "select", "text", "textarea"];

        var isCore = false;
        for (var i = 0; i < cores.length; i++)
        {
            if (cores[i] == type)
            {
                isCore = true;
            }
        }

        return isCore;
    };

    // types
    var types = [{
        "type": "string",
        "title": "String",
        "description": "A textual property"
    }, {
        "type": "number",
        "title": "Number",
        "description": "A numerical property"
    }, {
        "type": "boolean",
        "title": "Boolean",
        "description": "A true/false property"
    }, {
        "type": "object",
        "title": "Object",
        "description": "A collection of keyed sub-properties"
    }, {
        "type": "array",
        "title": "Array",
        "description": "An array of sub-properties"
    }];
    for (var i = 0; i < types.length; i++)
    {
        var title = types[i].title;
        var type = types[i].type;
        var description = types[i].description;

        var div = $("<div class='form-element draggable ui-widget-content' data-type='" + type + "'></div>");
        $(div).append("<div><span class='form-element-title'>" + title + "</span> (<span class='form-element-type'>" + type + "</span>)</div>");
        $(div).append("<div class='form-element-field-description'>" + description + "</div>");

        $("#types").append(div);
    }


    // show all fields
    for (var type in Alpaca.fieldClassRegistry)
    {
        var instance = new Alpaca.fieldClassRegistry[type]();

        var schemaSchema = instance.getSchemaOfSchema();
        var schemaOptions = instance.getOptionsForSchema();
        var optionsSchema = instance.getSchemaOfOptions();
        var optionsOptions = instance.getOptionsForOptions();
        var title = instance.getTitle();
        var description = instance.getDescription();
        var type = instance.getType();
        var fieldType = instance.getFieldType();

        var div = $("<div class='form-element draggable ui-widget-content' data-type='" + type + "' data-field-type='" + fieldType + "'></div>");
        $(div).append("<div><span class='form-element-title'>" + title + "</span> (<span class='form-element-type'>" + fieldType + "</span>)</div>");
        $(div).append("<div class='form-element-field-description'>" + description + "</div>");

        var isCore = isCoreField(fieldType);
        if (isCore)
        {
            $("#basic").append(div);
        }
        else
        {
            $("#advanced").append(div);
        }

        // init all of the draggable form elements
        $(".form-element").draggable({
            "appendTo": "body",
            "helper": "clone",
            "zIndex": 300,
            "refreshPositions": true,
            "start": function(event, ui) {
                $(".dropzone").addClass("dropzone-highlight");
            },
            "stop": function(event, ui) {
                $(".dropzone").removeClass("dropzone-highlight");
            }
        });
    }

    $(".tab-item-source").click(function() {

        // we have to monkey around a bit with ACE Editor to get it to refresh
        editor1.setValue(editor1.getValue());
        editor2.setValue(editor2.getValue());
        editor3.setValue(editor3.getValue());

        setTimeout(function() {
            refreshPreview();
        }, 50);
    });
    $(".tab-item-view").click(function() {
        setTimeout(function() {
            refreshView();
        }, 50);
    });
    $(".tab-item-designer").click(function() {
        setTimeout(function() {
            refreshDesigner();
        }, 50);
    });

    $(".tab-source-schema").click(function() {
        // we have to monkey around a bit with ACE Editor to get it to refresh
        editor1.setValue(editor1.getValue());
    });

    $(".tab-source-options").click(function() {
        // we have to monkey around a bit with ACE Editor to get it to refresh
        editor2.setValue(editor2.getValue());
    });

    $(".tab-source-data").click(function() {
        // we have to monkey around a bit with ACE Editor to get it to refresh
        editor3.setValue(editor3.getValue());
    });

    var insertField = function(schema, options, data, dataType, fieldType, parentField, previousField, previousFieldKey, nextField, nextFieldKey)
    {
        var itemSchema = {
            "type": dataType
        };
        var itemOptions = {};
        if (fieldType)
        {
            itemOptions.type = fieldType;
        }
        itemOptions.label = "New ";
        if (fieldType)
        {
            itemOptions.label += fieldType;
        }
        else if (dataType)
        {
            itemOptions.label += dataType;
        }
        var itemData = null;

        var itemKey = null;
        if (parentField.getType() === "array")
        {
            itemKey = 0;
            if (previousFieldKey)
            {
                itemKey = previousFieldKey + 1;
            }
        }
        else if (parentField.getType() === "object")
        {
            itemKey = "new" + new Date().getTime();
        }

        var insertAfterId = null;
        if (previousField)
        {
            insertAfterId = previousField.id;
        }

        parentField.addItem(itemKey, itemSchema, itemOptions, itemData, insertAfterId, false);

        var top = findTop(parentField);

        regenerate(top);
    };

    var assembleSchema = function(field, schema)
    {
        // copy any properties from this field's schema into our schema object
        for (var k in field.schema)
        {
            if (field.schema.hasOwnProperty(k) && typeof(field.schema[k]) != "function")
            {
                schema[k] = field.schema[k];
            }
        }
        // a few that we handle by hand
        schema.type = field.getType();
        // reset properties, we handle that one at a time
        delete schema.properties;
        if (field.childrenByPropertyId)
        {
            schema.properties = {};
            for (var propertyId in field.childrenByPropertyId)
            {
                var childField = field.childrenByPropertyId[propertyId];
                schema.properties[propertyId] = {};
                assembleSchema(childField, schema.properties[propertyId]);
            }
        }
    };

    var assembleOptions = function(field, options)
    {
        // copy any properties from this field's options into our options object
        for (var k in field.options)
        {
            if (field.options.hasOwnProperty(k) && typeof(field.options[k]) != "function")
            {
                options[k] = field.options[k];
            }
        }
        // a few that we handle by hand
        options.type = field.getFieldType();
        // reset fields, we handle that one at a time
        delete options.fields;
        if (field.childrenByPropertyId)
        {
            options.fields = {};
            for (var propertyId in field.childrenByPropertyId)
            {
                var childField = field.childrenByPropertyId[propertyId];
                options.fields[propertyId] = {};
                assembleOptions(childField, options.fields[propertyId]);
            }
        }
    };

    var findTop = function(field)
    {
        // now get the top control
        var top = field;
        while (top.parent)
        {
            top = top.parent;
        }

        return top;
    };

    var regenerate = function(top)
    {
        // walk the control tree and re-assemble the schema, options + data
        var _schema = {};
        assembleSchema(top, _schema);
        var _options = {};
        assembleOptions(top, _options);
        // data is easy
        var _data = top.getValue();
        if (!_data) {
            _data = {};
        }

        editor1.setValue(JSON.stringify(_schema, null, "    "));
        editor2.setValue(JSON.stringify(_options, null, "    "));
        editor3.setValue(JSON.stringify(_data, null, "    "));

        setTimeout(function() {
            refresh();
        }, 100);
    };

    var removeField = function(alpacaId)
    {
        var field = Alpaca.fieldInstances[alpacaId];

        var parentField = field.parent;
        parentField.removeItem(alpacaId);

        var top = findTop(field);
        regenerate(top);
    };

    $(".tab-item-source").click();
};

$(document).ready(function() {

    // wait a bit to allow ACE to load
    setTimeout(function() {
        setup();
    }, 200);
});