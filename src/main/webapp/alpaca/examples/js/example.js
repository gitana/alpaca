$(function(){
    $.each($("div[id^='field']"), function(){
        var currentId = $(this).attr('id');
        $(this).after('<div>Code:</div><pre id="' + currentId + '-pre"><code id="' + currentId + '-code"></code></pre>');
        $('#' + currentId + '-code').html($('#' + currentId + '-script').html().trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
    });
});
