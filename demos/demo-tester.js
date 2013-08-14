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

    var refresh = function()
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
            };

            if (form)
            {
                form.destroy();
            }

            $("#formDiv").alpaca(config);
        }

    };

    $(".btn.run").off().click(function(e) {
        e.preventDefault();

        refresh();
    });

    /*
    editor1.on("change", function(e) {
        refresh();
    });
    editor2.on("change", function(e) {
        refresh();
    });
    editor3.on("change", function(e) {
        refresh();
    });
    */

    refresh();
};

$(document).ready(function() {

    // wait a bit to allow ACE to load
    setTimeout(function() {
        setup();
    }, 200);
});