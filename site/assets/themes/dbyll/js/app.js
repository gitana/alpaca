$( document ).ready(function() {

	/* Sidebar height set */
	$('.sidebar').css('min-height',$(document).height());

    var resizeSidebar = function()
    {
        if ($(window).width() >= 992)
        {
            var contentHeight = $(document).outerHeight();
            var windowHeight = $(window).outerHeight();
            var height = contentHeight;
            if (windowHeight > contentHeight)
            {
                height = windowHeight;
            }
            $(".row.top .sidebar-holder").height(height);
        }
        else
        {
            $(".row.top .sidebar-holder").height("auto");
        }
    };

    setTimeout(function() {
        resizeSidebar();
    }, 1000);

    $(window).on("resize", function() {
        resizeSidebar();
    });

	/* Secondary contact links */
	var scontacts = $('#contact-list-secondary');
	var contact_list = $('#contact-list');
	
	scontacts.hide();
	
	contact_list.mouseenter(function(){ scontacts.slideDown(); });
	
	contact_list.mouseleave(function(){ scontacts.slideUp(); });

    // autowire for bootstrap
    Alpaca.defaultUI = "bootstrap";


    //// SOURCE CODE VIEW/EDIT FOR EXAMPLES

    var exampleFields = $("div[id^='field'],table[id^='field']")
    $.each(exampleFields, function() {

        var currentId = $(this).attr('id');

        var readCode = function(id)
        {
            var code = $.trim($('#' + id + '-script').text());

            code = code.replace("<![CDATA[", "").replace("]]>", "");

            // do some code cleanup
            code = js_beautify(code, {
                "indent_size": 4,
                "preserve_newlines": false
            });

            return code;
        };
        var code = readCode(currentId);

        // containers
        var resultHeader = $("<h3>Result</h3>");
        var sourceHeader = $("<h3>Source</h3>");
        var sourceHolder = $("<div></div>");
        $(this).before(resultHeader);
        $(this).after(sourceHolder);
        $(this).after(sourceHeader);


        var outerDiv = $("<div style='position: relative; width: 100%;'></div>");

        var editorDiv = $("<div style='position: relative; width: 100%; height: 300px;'><div id='" + currentId + "-editor' style='position:absolute;top:0;bottom:0;left:0;right:0'></div></div>");

        var runButton = $("<a class='btn btn-primary run pull-left' href='javascript:void(0);'>Run &raquo;</a>");
        var resetButton = $("<a class='btn btn-danger reset pull-right' href='javascript:void(0);'>Reset</a>");

        var buttonsContainerDiv = $("<div id='" + currentId + "-buttons' style='padding-top:5px'></div>");
        buttonsContainerDiv.append(runButton);
        buttonsContainerDiv.append(resetButton);
        buttonsContainerDiv.append("<div style='clear:both'>");

        $(outerDiv).append(editorDiv);
        $(outerDiv).append(buttonsContainerDiv);

        // append in the html
        $(sourceHolder).append(outerDiv);

        // bind in the editor
        var el = $(editorDiv).find("#" + currentId + "-editor")[0];
        var editor = ace.edit(el);
        editor.setTheme("ace/theme/textmate");
        editor.getSession().setMode("ace/mode/javascript");
        editor.setShowPrintMargin(false);
        editor.setValue(code);
        editor.clearSelection();

        // make it so that the height calibrates to the content
        var heightUpdateFunction = function(editor, editorDiv) {

            return function()
            {
                // http://stackoverflow.com/questions/11584061/
                var newHeight =
                    editor.getSession().getScreenLength()
                        * editor.renderer.lineHeight
                        + editor.renderer.scrollBar.getWidth();

                $(editorDiv).height(newHeight.toString() + "px");

                // This call is required for the editor to fix all of
                // its inner structure for adapting to a change in size
                editor.resize();
            }
        }(editor, editorDiv);
        heightUpdateFunction();
        editor.getSession().on('change', heightUpdateFunction);


        // when they click "Run", we execute the code
        $(runButton).click(function(id, editor) {
            return function() {

                $("#" + id).empty();

                var code = editor.getValue();
                eval(code);
            };
        }(currentId, editor));

        // when they click the "Reset" button, we copy the script back and reset things
        $(resetButton).click(function(id, editor) {

            return function() {

                var code = readCode(id);

                // write into editor
                editor.setValue(code);
                editor.clearSelection();

                $("#" + id).empty();

                // run the code
                eval(code);

            };

        }(currentId, editor));

    });

});
