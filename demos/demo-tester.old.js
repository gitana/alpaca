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
        editor.clearSelection();

        return editor;
    };

    var editor1 = setupEditor("schema", schema);
    var editor2 = setupEditor("options", options);
    var editor3 = setupEditor("data", data);

    var form = null;

    var refresh = function(callback)
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
            config.postRender = function(_form) {
                form = _form;

                // cover every control with an interaction layer
                form.getEl().find(".alpaca-fieldset-item-container").each(function() {

                    var alpacaFieldId = $(this).attr("alpaca-id");

                    var width = $(this).width();
                    var height = $(this).height();
                    console.log("H: " + height);

                    // cover div
                    var cover = $("<div></div>");
                    $(cover).addClass("cover");
                    $(cover).attr("alpaca-ref-id", alpacaFieldId);
                    $(cover).css({
                        "margin-top": "-" + height + "px",
                        "width": width,
                        "height": height,
                        "background": "blue",
                        "opacity": 0.1,
                        "z-index": 1000
                    });
                    $(this).append(cover);

                    // interaction div
                    var interaction = $("<div></div>");
                    var buttonGroup = $("<div class='btn-group pull-right'></div>");
                    var removeButton = $("<button class='btn btn-danger' alpaca-ref-id='" + alpacaFieldId + "'>Remove</button>");
                    interaction.append(buttonGroup);
                    buttonGroup.append(removeButton);
                    $(interaction).addClass("interaction");
                    $(interaction).attr("alpaca-ref-id", alpacaFieldId);
                    $(interaction).css({
                        "margin-top": "-" + height + "px",
                        "width": width,
                        "height": height,
                        "opacity": 1,
                        "border": "10px black solid",
                        "z-index": 1001
                    });
                    $(this).append(interaction);
                    $(removeButton).off().click(function(e) {

                        e.preventDefault();

                        var alpacaId = $(this).attr("alpaca-ref-id");
                        removeField(alpacaId);
                    });

                    var field = Alpaca.fieldInstances[alpacaFieldId];
                    var fieldSchema = field.getSchemaOfSchema();
                    var fieldSchemaOptions = field.getOptionsForSchema();
                    var fieldOptions = field.getSchemaOfOptions();
                    var fieldOptionsOptions = field.getOptionsForOptions();

                    var x = $("<div><div class='fieldForm'></div></div>");

                    var fieldConfig = {
                        schema: fieldSchema
                    };
                    if (fieldSchemaOptions)
                    {
                        fieldConfig.options = fieldSchemaOptions;
                    }
                    fieldConfig.postRender = function(control)
                    {
                        var modal = $(MODAL_TEMPLATE.trim());
                        modal.find(".modal-title").append(field.getTitle());
                        modal.find(".modal-body").append(control.getEl());

                        modal.find('.modal-footer').append("<button class='btn pull-right okay' data-dismiss='modal' aria-hidden='true'>Okay</button>");
                        modal.find('.modal-footer').append("<button class='btn pull-left' data-dismiss='modal' aria-hidden='true'>Cancel</button>");

                        $(cover).off().click(function()
                        {
                            $(modal).modal({
                                "keyboard": true
                            });
                        });
                    };

                    $(x).find(".fieldForm").alpaca(fieldConfig);

                    /*
                    $(cover).popover({
                        container: 'body',
                        trigger: 'click',
                        html: true,
                        placement: 'right',
                        content: x
                    });
                    $(cover).on("shown", function() {
                        //debugger;
                    });
                    $(cover).on("hidden", function() {
                    });
                    */

                });

                // for every container, add a "first" drop zone element
                // this covers empty containers as well as 0th index insertions
                form.getEl().find(".alpaca-fieldset-items-container").each(function() {
                    $(this).prepend("<div class='dropzone'>ONE</div>");
                });

                // after every element in a container, add something which allows inserts "after"
                form.getEl().find(".alpaca-fieldset-item-container").each(function() {
                    $(this).after("<div class='dropzone'>TWO</div>");
                });

                $(".dropzone").droppable({
                    tolerance: "touch",
                    drop: function( event, ui ) {
                        var dataType = $(ui.draggable).attr("data-type");
                        var fieldType = $(ui.draggable).attr("data-field-type");

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
                    },
                    over: function (event, ui ) {
                        $(event.target).addClass("dropzone-hover");
                    },
                    out: function (event, ui) {
                        $(event.target).removeClass("dropzone-hover");
                    }
                });

                // init all of the draggables
                $(".form-element").draggable({
                    appendTo: "body",
                    helper: "clone",
                    zIndex: 300
                });

                if (callback)
                {
                    callback();
                }
            };

            $(".dropzone").remove();
            $(".interaction").remove();
            $(".cover").remove();

            if (form)
            {
                form.destroy();
            }

            $("#formDiv").alpaca(config);
        }
    };

    refresh();

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
    }

    $(".tab-item-form").click(function() {
        refresh();
    });

    $(".tab-item-form").click();

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

        console.log("Generated schema: " + JSON.stringify(_schema, null, "   "));

        editor1.setValue(JSON.stringify(_schema, null, "    "));
        editor2.setValue(JSON.stringify(_options, null, "    "));
        editor3.setValue(JSON.stringify(_data, null, "    "));

        refresh();
    };

    var removeField = function(alpacaId)
    {
        var field = Alpaca.fieldInstances[alpacaId];

        var parentField = field.parent;
        parentField.removeItem(alpacaId);

        var top = findTop(field);
        regenerate(top);
    };
};

$(document).ready(function() {

    // wait a bit to allow ACE to load
    setTimeout(function() {
        setup();
    }, 200);
});