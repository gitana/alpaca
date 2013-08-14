var setup = function()
{
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

                form.getEl().find(".alpaca-fieldset-items-container").each(function() {

                    // add in a placeholder for inserts
                    var div = "<div class='dropzone'></div>";
                    $(this).after(div);

                });

                $(".dropzone").droppable({
                    tolerance: "touch",
                    drop: function( event, ui ) {
                        var dataType = $(ui.draggable).attr("data-type");
                        var fieldType = $(ui.draggable).attr("data-field-type");

                        var alpacaId = $($(event.target).parent().before().children()[0].children[0]).attr("alpaca-id");
                        var fieldInstance = Alpaca.fieldInstances[alpacaId];

                        insertField(schema, options, data, dataType, fieldType, fieldInstance);
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

    var insertField = function(schema, options, data, dataType, fieldType, field)
    {
        var itemPropertyId = "new" + new Date().getTime();

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

        var parentPath = field.parent.path;

        var parentPropertyId = null;
        if (field.path.lastIndexOf("/") > -1)
        {
            parentPropertyId = field.path.substring(field.path.lastIndexOf("/") + 1);
        }

        var tokens = [];
        if (parentPath && parentPath.length > 1)
        {
            tokens = parentPath.split("/");
        }

        // SCHEMA LOCATION
        var schemaLocation = "";
        for (var i = 0; i < tokens.length; i++)
        {
            if (tokens[i])
            {
                schemaLocation += "properties";
                schemaLocation += ".";
                schemaLocation += tokens[i];
            }
        }

        // OPTIONS LOCATION
        var optionsLocation = "";
        for (var i = 0; i < tokens.length; i++)
        {
            if (tokens[i])
            {
                optionsLocation += "fields";
                optionsLocation += ".";
                optionsLocation += tokens[i];
            }
        }

        // DATA LOCATION
        var dataLocation = "";
        for (var i = 0; i < tokens.length; i++)
        {
            if (tokens[i])
            {
                dataLocation += tokens[i];
                if (i + 1 < tokens.length)
                {
                    dataLocation += ".";
                }
            }
        }

        if (itemSchema)
        {
            var subSchema = schema;
            if (schemaLocation)
            {
                subSchema = Alpaca.traverseObject(schema, schemaLocation);
            }
        }

        if (itemOptions)
        {
            var subOptions = options;
            if (optionsLocation)
            {
                subOptions = Alpaca.traverseObject(options, optionsLocation);
            }
        }

        if (itemData)
        {
            var subData = data;
            if (dataLocation)
            {
                subData = Alpaca.traverseObject(data, dataLocation);
            }
        }

        // insert into the correct place
        if (subSchema)
        {
            var obj = {};
            for (var k in subSchema.properties)
            {
                obj[k] = subSchema.properties[k];
                if (k == parentPropertyId)
                {
                    obj[itemPropertyId] = itemSchema;
                }
            }
            subSchema.properties = obj;
            editor1.setValue(JSON.stringify(schema, null, "    "));
        }

        if (subOptions)
        {
            subOptions.fields[itemPropertyId] = itemOptions;
            editor2.setValue(JSON.stringify(options, null, "    "));
        }

        if (subData)
        {
            subData[itemPropertyId] = itemData;
            editor3.setValue(JSON.stringify(data, null, "    "));
        }

        refresh();
    };
};

$(document).ready(function() {

    // wait a bit to allow ACE to load
    setTimeout(function() {
        setup();
    }, 200);
});